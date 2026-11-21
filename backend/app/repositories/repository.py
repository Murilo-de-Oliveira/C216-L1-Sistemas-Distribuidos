from app.database.connection import Session
from app.models.models import Hero
from sqlalchemy import select

def get_hero_by_id(id: int, session: Session) -> Hero | None:
    return session.get(Hero, id)

def get_all_heroes(session: Session) -> list[Hero]:
    return list(session.scalars(select(Hero)).all())