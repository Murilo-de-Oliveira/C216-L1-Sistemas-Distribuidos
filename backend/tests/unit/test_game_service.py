from datetime import UTC, datetime

import pytest
from fastapi import HTTPException

from app.schemas.game import Color, ErrorTag, GameCreate, GamePatch, Result, TimeControl


def make(payload, **overrides) -> GameCreate:
    return GameCreate(**{**payload, **overrides})


def utc(month: int) -> datetime:
    return datetime(2026, month, 1, tzinfo=UTC)


def test_list_applies_filters_sorting_and_pagination(service, payload):
    a = service.create_game(
        make(
            payload,
            result="win",
            color="white",
            time_control="rapid",
            error_tags=[],
            played_at=utc(1),
        )
    )
    b = service.create_game(
        make(
            payload,
            result="loss",
            color="black",
            time_control="blitz",
            error_tags=["time_trouble"],
            played_at=utc(3),
        )
    )
    c = service.create_game(
        make(
            payload,
            result="loss",
            color="white",
            time_control="blitz",
            error_tags=["hanging_piece"],
            played_at=utc(2),
        )
    )

    def ids(**filters):
        return [g.id for g in service.list_games(**filters)]

    assert ids() == [b.id, c.id, a.id]
    assert ids(result=Result.LOSS) == [b.id, c.id]
    assert ids(color=Color.BLACK) == [b.id]
    assert ids(time_control=TimeControl.BLITZ) == [b.id, c.id]
    assert ids(error_tag=ErrorTag.HANGING_PIECE) == [c.id]
    assert ids(result=Result.LOSS, color=Color.WHITE) == [c.id]
    assert ids(result=Result.DRAW) == []
    assert ids(limit=2) == [b.id, c.id]
    assert ids(limit=2, offset=2) == [a.id]


def test_replace_overwrites_fields_and_keeps_played_at(service, game_data):
    original = service.create_game(game_data)
    original_id = original.id
    original_played_at = original.played_at
    assert original.opening is not None  # garante que o teste é significativo

    new = service.replace_game(
        original_id, GameCreate(color="black", result="win", time_control="rapid")
    )

    assert new.id == original_id
    assert new.color is Color.BLACK
    assert new.opening is None and new.error_tags == []
    assert new.played_at == original_played_at


def test_patch_changes_only_sent_fields(service, game_data):
    original = service.create_game(game_data)
    original_id = original.id
    opening, error_tags = original.opening, list(original.error_tags)

    patched = service.patch_game(original_id, GamePatch(notes="outra nota"))
    assert patched.notes == "outra nota"
    assert patched.opening == opening and patched.error_tags == error_tags

    assert service.patch_game(original_id, GamePatch(opening=None)).opening is None
    assert service.get_game(original_id).opening is None


def test_delete_removes_game_and_unknown_ids_raise_404(service, game_data):
    first = service.create_game(game_data)
    second = service.create_game(game_data)
    first_id, second_id = first.id, second.id

    service.delete_game(first_id)
    assert [g.id for g in service.list_games()] == [second_id]

    operations = [
        lambda: service.get_game(99),
        lambda: service.replace_game(99, game_data),
        lambda: service.patch_game(99, GamePatch(notes="x")),
        lambda: service.delete_game(99),
        lambda: service.get_game(first_id),  # já removida
    ]
    for operation in operations:
        with pytest.raises(HTTPException) as error:
            operation()
        assert error.value.status_code == 404


def test_stats(service, payload):
    empty = service.stats()
    assert empty.total == 0 and empty.win_rate is None and empty.error_tag_counts == {}

    service.create_game(make(payload, result="win", error_tags=["hanging_piece"]))
    service.create_game(
        make(payload, result="loss", error_tags=["time_trouble", "hanging_piece"])
    )
    service.create_game(
        make(payload, result="loss", error_tags=["time_trouble", "hanging_piece"])
    )
    service.create_game(make(payload, result="draw", error_tags=["endgame_mistake"]))

    stats = service.stats()
    assert (stats.total, stats.wins, stats.losses, stats.draws) == (4, 1, 2, 1)
    assert stats.win_rate == 0.25
    assert list(stats.error_tag_counts.items()) == [  # do mais frequente ao menos
        (ErrorTag.HANGING_PIECE, 3),
        (ErrorTag.TIME_TROUBLE, 2),
        (ErrorTag.ENDGAME_MISTAKE, 1),
    ]