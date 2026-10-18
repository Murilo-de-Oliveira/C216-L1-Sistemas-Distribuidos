from collections import Counter
from datetime import UTC, datetime

from fastapi import HTTPException, status

from app.models.models import Game
from app.repositories.game import GameRepository
from app.schemas.game import (
    Color,
    ErrorTag,
    GameCreate,
    GamePatch,
    GameStats,
    Result,
    TimeControl,
)


def _as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


class GameService:
    def __init__(self, repo: GameRepository) -> None:
        self.repo = repo

    def _get_or_404(self, game_id: int) -> Game:
        game = self.repo.get(game_id)
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
    ) -> list[Game]:
        games = self.repo.list_all()
        if result is not None:
            games = [g for g in games if g.result == result]
        if color is not None:
            games = [g for g in games if g.color == color]
        if time_control is not None:
            games = [g for g in games if g.time_control == time_control]
        if error_tag is not None:
            games = [g for g in games if error_tag in (g.error_tags or [])]
        games.sort(key=lambda g: g.played_at, reverse=True)
        return games[offset : offset + limit]

    def get_game(self, game_id: int) -> Game:
        return self._get_or_404(game_id)

    def create_game(self, data: GameCreate) -> Game:
        payload = data.model_dump()
        payload["played_at"] = _as_utc(data.played_at or datetime.now(UTC))
        return self.repo.add(payload)

    def replace_game(self, game_id: int, data: GameCreate) -> Game:
        game = self.repo.replace(game_id, data)
        if game is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"Partida {game_id} não encontrada"
            )
        return game

    def patch_game(self, game_id: int, patch: GamePatch) -> Game:
        changes = patch.model_dump(exclude_unset=True)
        game = self.repo.update(game_id, changes)
        if game is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"Partida {game_id} não encontrada"
            )
        return game

    def delete_game(self, game_id: int) -> None:
        if not self.repo.delete(game_id):
            raise HTTPException(
                status.HTTP_404_NOT_FOUND, f"Partida {game_id} não encontrada"
            )

    def stats(self) -> GameStats:
        games = self.repo.list_all()
        total = len(games)
        wins = sum(g.result == Result.WIN for g in games)
        tag_counts = Counter(tag for g in games for tag in (g.error_tags or []))
        return GameStats(
            total=total,
            wins=wins,
            losses=sum(g.result == Result.LOSS for g in games),
            draws=sum(g.result == Result.DRAW for g in games),
            win_rate=round(wins / total, 4) if total else None,
            error_tag_counts=dict(tag_counts.most_common()),
        )
