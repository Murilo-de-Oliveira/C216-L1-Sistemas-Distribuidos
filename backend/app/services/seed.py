from datetime import datetime, timezone

from app.schemas.game import Color, ErrorTag, GameCreate, Result, TimeControl


def _dt(day: int, hour: int) -> datetime:
    return datetime(2026, 9, day, hour, 0, tzinfo=timezone.utc)


SEED_GAMES: list[GameCreate] = [
    GameCreate(
        color=Color.WHITE, result=Result.DRAW, time_control=TimeControl.RAPID,
        opening="Italiana", opponent_rating=1210, played_at=_dt(20, 19),
        notes="Tinha dama a mais e deixei o rei adversário sem lances.",
        error_tags=[ErrorTag.STALEMATE_BLUNDER],
    ),
    GameCreate(
        color=Color.BLACK, result=Result.LOSS, time_control=TimeControl.BLITZ,
        opening="Siciliana", opponent_rating=1340, played_at=_dt(21, 21),
        notes="Posição ganha, mas cheguei ao final com poucos segundos.",
        error_tags=[ErrorTag.TIME_TROUBLE],
    ),
    GameCreate(
        color=Color.WHITE, result=Result.WIN, time_control=TimeControl.RAPID,
        opening="Londres", opponent_rating=1180, played_at=_dt(22, 20),
    ),
    GameCreate(
        color=Color.BLACK, result=Result.LOSS, time_control=TimeControl.RAPID,
        opening="Francesa", opponent_rating=1295, played_at=_dt(23, 18),
        notes="Não vi o garfo de cavalo em dois lances.",
        error_tags=[ErrorTag.MISSED_SHORT_TACTIC, ErrorTag.HANGING_PIECE],
    ),
    GameCreate(
        color=Color.WHITE, result=Result.LOSS, time_control=TimeControl.BLITZ,
        opening="Ruy Lopez", opponent_rating=1400, played_at=_dt(24, 22),
        error_tags=[ErrorTag.TIME_TROUBLE, ErrorTag.OPENING_MISTAKE],
    ),
    GameCreate(
        color=Color.BLACK, result=Result.WIN, time_control=TimeControl.RAPID,
        opening="Caro-Kann", opponent_rating=1250, played_at=_dt(25, 19),
    ),
]
