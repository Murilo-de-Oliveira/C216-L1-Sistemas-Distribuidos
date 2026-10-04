from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class Color(str, Enum):
    WHITE = "white"
    BLACK = "black"


class Result(str, Enum):
    WIN = "win"
    LOSS = "loss"
    DRAW = "draw"


class TimeControl(str, Enum):
    BULLET = "bullet"
    BLITZ = "blitz"
    RAPID = "rapid"
    CLASSICAL = "classical"


class ErrorTag(str, Enum):
    STALEMATE_BLUNDER = "stalemate_blunder"
    TIME_TROUBLE = "time_trouble"
    MISSED_SHORT_TACTIC = "missed_short_tactic"
    HANGING_PIECE = "hanging_piece"
    OPENING_MISTAKE = "opening_mistake"
    ENDGAME_MISTAKE = "endgame_mistake"


def _unique(tags: list[ErrorTag]) -> list[ErrorTag]:
    return list(dict.fromkeys(tags))


class GameBase(BaseModel):
    color: Color
    result: Result
    time_control: TimeControl
    opening: str | None = Field(None, max_length=80, examples=["Siciliana"])
    opponent_rating: int | None = Field(None, ge=0, le=3500, examples=[1450])
    notes: str | None = Field(None, max_length=500)
    error_tags: list[ErrorTag] = Field(default_factory=list)

    @field_validator("error_tags")
    @classmethod
    def remove_duplicate_tags(cls, tags: list[ErrorTag]) -> list[ErrorTag]:
        return _unique(tags)


class GameCreate(GameBase):
    played_at: datetime | None = None


class GamePatch(BaseModel):
    color: Color | None = None
    result: Result | None = None
    time_control: TimeControl | None = None
    opening: str | None = Field(None, max_length=80)
    opponent_rating: int | None = Field(None, ge=0, le=3500)
    notes: str | None = Field(None, max_length=500)
    error_tags: list[ErrorTag] | None = None
    played_at: datetime | None = None

    @field_validator("color", "result", "time_control", "error_tags", "played_at")
    @classmethod
    def reject_explicit_null(cls, value):
        # Só roda quando o campo é enviado; omitir o campo continua permitido.
        if value is None:
            raise ValueError("este campo não pode ser nulo; omita-o para não alterá-lo")
        return value

    @field_validator("error_tags")
    @classmethod
    def remove_duplicate_tags(cls, tags: list[ErrorTag]) -> list[ErrorTag]:
        return _unique(tags)


class GameOut(GameBase):
    id: int
    played_at: datetime


class GameStats(BaseModel):
    total: int
    wins: int
    losses: int
    draws: int
    win_rate: float | None = Field(None, description="Vitórias / total (0 a 1); nulo se não há partidas")
    error_tag_counts: dict[ErrorTag, int] = Field(
        description="Quantas partidas tiveram cada tag, da mais frequente para a menos"
    )
