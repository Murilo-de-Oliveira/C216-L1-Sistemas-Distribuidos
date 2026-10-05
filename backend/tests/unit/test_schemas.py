import pytest
from pydantic import ValidationError

from app.schemas.game import Color, ErrorTag, GameCreate, GamePatch

REQUIRED = {"color": "white", "result": "win", "time_control": "rapid"}


def test_game_create_uses_defaults_and_converts_enums():
    game = GameCreate(**REQUIRED, error_tags=["time_trouble"])
    assert game.color is Color.WHITE
    assert game.error_tags == [ErrorTag.TIME_TROUBLE]
    assert game.opening is None and game.notes is None and game.played_at is None
    assert GameCreate(**REQUIRED).error_tags == []


def test_game_create_rejects_invalid_values():
    assert GameCreate(**REQUIRED, opponent_rating=0)  # limites aceitos
    assert GameCreate(**REQUIRED, opponent_rating=3500)

    invalid = [
        {"opponent_rating": -1},
        {"opponent_rating": 3501},
        {"color": "green"},
        {"error_tags": ["not_a_tag"]},
        {"notes": "x" * 501},
    ]
    for change in invalid:
        with pytest.raises(ValidationError):
            GameCreate(**{**REQUIRED, **change})

    with pytest.raises(ValidationError):  # campo obrigatório ausente
        GameCreate(color="white", result="win")


def test_duplicate_tags_are_removed_keeping_order():
    tags = ["time_trouble", "hanging_piece", "time_trouble"]
    expected = [ErrorTag.TIME_TROUBLE, ErrorTag.HANGING_PIECE]
    assert GameCreate(**REQUIRED, error_tags=tags).error_tags == expected
    assert GamePatch(error_tags=tags).error_tags == expected


def test_game_patch_tracks_only_sent_fields_and_rejects_null_on_required():
    assert GamePatch().model_dump(exclude_unset=True) == {}
    assert GamePatch(notes="nova").model_dump(exclude_unset=True) == {"notes": "nova"}
    assert GamePatch(opening=None).model_dump(exclude_unset=True) == {
        "opening": None
    }  # limpar é permitido

    for field in ["color", "result", "time_control", "error_tags", "played_at"]:
        with pytest.raises(ValidationError):
            GamePatch(**{field: None})
