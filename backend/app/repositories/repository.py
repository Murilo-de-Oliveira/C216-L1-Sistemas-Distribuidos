from app.database.connection import Session
from app.models.models import Hero, Item, Build, BuildItem
from sqlalchemy import select
from sqlalchemy.orm import selectinload

def get_hero_by_id(id: int, session: Session) -> Hero | None:
    return session.get(Hero, id)

def get_all_heroes(session: Session) -> list[Hero]:
    return list(session.scalars(select(Hero).order_by(Hero.name)).all())

def get_item_by_id(id: int, session: Session) -> Item | None:
    return session.get(Item, id)

def get_all_items(session: Session) -> list[Item]:
    return list(session.scalars(select(Item)).all())

def create_build(build: Build, session: Session) -> Build:
    session.add(build)
    session.flush()
    session.commit()
    return build

def get_build(id: int, session: Session) -> Build:
    return session.get(Build, id)

def delete_build(id: int, session: Session) -> None:
    build = session.get(Build, id)
    session.delete(build)
    session.commit()

def list_build_by_hero(id, session: Session) -> list[Build]:
    stmt = select(Build).options(selectinload(Build.items).joinedload(BuildItem.item)).where(Build.hero_id == id).order_by(Build.created_at.desc())
    return list(session.scalars(stmt))
