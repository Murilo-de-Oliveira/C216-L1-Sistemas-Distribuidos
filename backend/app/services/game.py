from collections import Counter
from collections.abc import Iterable
from datetime import UTC, datetime

from fastapi import HTTPException, status

from app.schemas.game import (
    Color,
    ErrorTag,
    GameCreate,
    GameOut,
    GamePatch,
    GameStats,
    Result,
    TimeControl,
)
from app.services.seed import SEED_GAMES


def _as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


class GameService:
    def __init__(self, seed: Iterable[GameCreate] = ()) -> None:
        self._games: dict[int, GameOut] = {}
        self._next_id = 1
        for data in seed:
            self.create_game(data)

    def _get_or_404(self, game_id: int) -> GameOut:
        game = self._games.get(game_id)
        if game is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"Partida {game_id} não encontrada"
            )
        return game

    def list_games(
        self,
        *,
        result: Result | None = None,
        color: Color | None = None,
        time_control: TimeControl | None = None,
        error_tag: ErrorTag | None = None,
        limit: int = 20,
        offset: int = 0,
    ) -> list[GameOut]:
        games = list(self._games.values())
        if result is not None:
            games = [g for g in games if g.result == result]
        if color is not None:
            games = [g for g in games if g.color == color]
        if time_control is not None:
            games = [g for g in games if g.time_control == time_control]
        if error_tag is not None:
            games = [g for g in games if error_tag in g.error_tags]
        games.sort(key=lambda g: g.played_at, reverse=True)
        return games[offset : offset + limit]

    def get_game(self, game_id: int) -> GameOut:
        return self._get_or_404(game_id)

    def create_game(self, data: GameCreate) -> GameOut:
        payload = data.model_dump()
        payload["played_at"] = _as_utc(data.played_at or datetime.now(UTC))
        game = GameOut(id=self._next_id, **payload)
        self._games[game.id] = game
        self._next_id += 1
        return game

    def replace_game(self, game_id: int, data: GameCreate) -> GameOut:
        existing = self._get_or_404(game_id)
        payload = data.model_dump()
        payload["played_at"] = (
            _as_utc(data.played_at) if data.played_at else existing.played_at
        )
        game = GameOut(id=game_id, **payload)
        self._games[game_id] = game
        return game

    def patch_game(self, game_id: int, patch: GamePatch) -> GameOut:
        existing = self._get_or_404(game_id)
        changes = patch.model_dump(exclude_unset=True)
        if "played_at" in changes:
            changes["played_at"] = _as_utc(changes["played_at"])
        game = existing.model_copy(update=changes)
        self._games[game_id] = game
        return game

    def delete_game(self, game_id: int) -> None:
        self._get_or_404(game_id)
        del self._games[game_id]

    def stats(self) -> GameStats:
        games = list(self._games.values())
        total = len(games)
        wins = sum(g.result == Result.WIN for g in games)
        tag_counts = Counter(tag for g in games for tag in g.error_tags)
        return GameStats(
            total=total,
            wins=wins,
            losses=sum(g.result == Result.LOSS for g in games),
            draws=sum(g.result == Result.DRAW for g in games),
            win_rate=round(wins / total, 4) if total else None,
            error_tag_counts=dict(tag_counts.most_common()),
        )


game_service = GameService(SEED_GAMES)
