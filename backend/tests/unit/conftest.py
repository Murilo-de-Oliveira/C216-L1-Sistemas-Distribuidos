import pytest

from app.repositories.game import GameRepository
from app.schemas.game import GameCreate
from app.services.game import GameService


@pytest.fixture
def service(session) -> GameService:
    return GameService(GameRepository(session))


@pytest.fixture
def game_data(payload) -> GameCreate:
    return GameCreate(**payload)
