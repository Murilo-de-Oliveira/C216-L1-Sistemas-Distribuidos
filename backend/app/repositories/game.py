from collections.abc import Iterable
from datetime import datetime, timezone

from app.schemas.game import GameCreate, GameOut


def _as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


class GameRepository:
    def __init__(self, seed: Iterable[GameCreate] = ()) -> None:
        self._games: dict[int, GameOut] = {}
        self._next_id = 1
        for game in seed:
            self.add(game)

    def list_all(self) -> list[GameOut]:
        return list(self._games.values())

    def get(self, game_id: int) -> GameOut | None:
        return self._games.get(game_id)

    def add(self, data: GameCreate) -> GameOut:
        payload = data.model_dump()
        payload["played_at"] = _as_utc(data.played_at or datetime.now(timezone.utc))
        game = GameOut(id=self._next_id, **payload)
        self._games[game.id] = game
        self._next_id += 1
        return game

    def replace(self, game_id: int, data: GameCreate) -> GameOut | None:
        existing = self._games.get(game_id)
        if existing is None:
            return None
        payload = data.model_dump()
        payload["played_at"] = (
            _as_utc(data.played_at) if data.played_at else existing.played_at
        )
        game = GameOut(id=game_id, **payload)
        self._games[game_id] = game
        return game

    def update(self, game_id: int, changes: dict) -> GameOut | None:
        existing = self._games.get(game_id)
        if existing is None:
            return None
        if "played_at" in changes:
            changes = {**changes, "played_at": _as_utc(changes["played_at"])}
        game = existing.model_copy(update=changes)
        self._games[game_id] = game
        return game

    def delete(self, game_id: int) -> bool:
        return self._games.pop(game_id, None) is not None
