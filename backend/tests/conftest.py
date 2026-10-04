import pytest


def pytest_collection_modifyitems(items):
    for item in items:
        folder = item.path.parent.name
        if folder in {"unit", "integration"}:
            item.add_marker(getattr(pytest.mark, folder))


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
