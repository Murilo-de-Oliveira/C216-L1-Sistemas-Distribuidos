import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def valid_names():
    return ["Murilo", "Oliveira", "Domingos", "Figueiredo"]


def test_home_returns_expected_message(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Olá, Sistemas Distribuídos"}


def test_hello_with_simple_names(client):
    response = client.get("/hello/Murilo")
    assert response.status_code == 200
    assert response.json() == {"message": "Olá, Murilo"}


def test_hello_with_valid_names(client, valid_names):
    for name in valid_names:
        response = client.get(f"/hello/{name}")
        assert response.status_code == 200
        assert response.json()["message"] == f"Olá, {name}"


@pytest.mark.parametrize(
    "name, expected_message",
    [
        ("Murilo", "Olá, Murilo"),
        ("Múrílõ", "Olá, Múrílõ"),
        ("123", "Olá, 123"),
        ("😀", "Olá, 😀"),
        ("a" * 100, f"Olá, {'a' * 100}"),
    ],
)
def test_hello_parametrized(client, name, expected_message):
    response = client.get(f"/hello/{name}")
    assert response.status_code == 200
    assert response.json() == {"message": expected_message}


def test_without_name_returns_404(client):
    response = client.get("/hello/")
    assert response.status_code == 404
