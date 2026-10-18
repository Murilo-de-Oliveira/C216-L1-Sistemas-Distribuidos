from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.models import Game
from app.schemas.game import GameCreate


def _as_utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


class GameRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_all(self) -> list[Game]:
        return list(self.session.scalars(select(Game)).all())

    def get(self, game_id: int) -> Game | None:
        return self.session.get(Game, game_id)

    def add(self, payload) -> Game:
        game = Game(**payload)
        
        self.session.add(game)
        self.session.commit()
        self.session.refresh(game)
        
        return game

    def replace(self, game_id: int, data: GameCreate) -> Game | None:
        game = self.session.get(Game, game_id)
        if game is None:
            return None
        
        payload = data.model_dump()
        payload["played_at"] = (
            _as_utc(data.played_at) if data.played_at else game.played_at
        )
        for field, value in payload.items():
            setattr(game, field, value)

        self.session.commit()
        self.session.refresh(game)
        
        return game

    def update(self, game_id: int, changes: dict) -> Game | None:
        game = self.session.get(Game, game_id)
        if game is None:
            return None
        
        if "played_at" in changes and changes["played_at"] is not None:
            changes = {**changes, "played_at": _as_utc(changes["played_at"])}
        
        for field, value in changes.items():
            setattr(game, field, value)
        
        self.session.commit()
        self.session.refresh(game)
        
        return game

    def delete(self, game_id: int) -> bool:
        game = self.session.get(Game, game_id)
        if game is None:
            return False
        
        self.session.delete(game)
        self.session.commit()
        
        return True
    
