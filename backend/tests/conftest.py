import pytest


@pytest.fixture
def payload() -> dict:
    return {
        "color": "white",
        "result": "loss",
        "time_control": "blitz",
        "opening": "Siciliana",
        "opponent_rating": 1350,
        "notes": "Perdi no tempo.",
        "error_tags": ["time_trouble"],
    }
