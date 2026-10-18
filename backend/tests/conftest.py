import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.models.models import Game  # noqa: F401  (registra a tabela na Base)


@pytest.fixture
def session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # mesma conexão em todas as threads
    )
    Base.metadata.create_all(engine)
    with sessionmaker(bind=engine, autoflush=False)() as s:
        yield s
    Base.metadata.drop_all(engine)
    engine.dispose()


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
