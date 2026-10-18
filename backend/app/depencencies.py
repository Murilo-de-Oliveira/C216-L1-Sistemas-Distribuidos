from typing import Annotated

from fastapi import Depends

from app.database.connection import SessionDep
from app.repositories.game import GameRepository
from app.services.game import GameService


def get_game_repository(session: SessionDep) -> GameRepository:
    return GameRepository(session)

GameRepoDep = Annotated[GameRepository, Depends(get_game_repository)]

def get_game_service(repo: GameRepoDep) -> GameService:
    return GameService(repo)

GameServiceDep = Annotated[GameService, Depends(get_game_service)]


