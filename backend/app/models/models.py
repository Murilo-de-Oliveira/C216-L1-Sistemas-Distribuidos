from datetime import datetime

from schemas.game import Color, Result, TimeControl
from sqlalchemy import JSON, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    color: Mapped[Color]
    result: Mapped[Result] = mapped_column(index=True)
    time_control: Mapped[TimeControl]
    opening: Mapped[str | None] = mapped_column(String(80))
    opponent_rating: Mapped[int | None]
    notes: Mapped[str | None] = mapped_column(String(500))
    error_tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    played_at: Mapped[datetime | None] = mapped_column(default=None)
