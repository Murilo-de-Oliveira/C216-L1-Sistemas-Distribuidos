import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.routers.game import get_service
from app.services.game import GameService


@pytest.fixture
def client() -> TestClient:
    service = GameService()
    app = create_app()
    app.dependency_overrides[get_service] = lambda: service
    return TestClient(app)


@pytest.fixture
def create_game(client, payload):
    def _create(**overrides) -> dict:
        response = client.post("/games", json={**payload, **overrides})
        assert response.status_code == 201, response.text
        return response.json()

    return _create
