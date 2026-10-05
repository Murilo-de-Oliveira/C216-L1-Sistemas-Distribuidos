import pytest

from app.schemas.game import GameCreate
from app.services.game import GameService


@pytest.fixture
def service() -> GameService:
    return GameService()


@pytest.fixture
def game_data(payload) -> GameCreate:
    return GameCreate(**payload)
