import pytest
from fastapi.testclient import TestClient

from app.database.connection import get_session
from app.main import create_app


@pytest.fixture
def client(session) -> TestClient:
    app = create_app()
    app.dependency_overrides[get_session] = lambda: session
    return TestClient(app)


@pytest.fixture
def create_game(client, payload):
    def _create(**overrides) -> dict:
        response = client.post("/games", json={**payload, **overrides})
        assert response.status_code == 201, response.text
        return response.json()

    return _create