from fastapi import HTTPException

from app.schemas.build import BuildCreate, BuildUpdate
from app.models.models import Build, BuildItem, Item
from app.repositories.repository import create_build, get_build, delete_build, list_build_by_hero, get_all_items
from app.database.connection import Session


def create_build_service(payload: BuildCreate, session: Session):
    build = Build(name=payload.name, description=payload.description, hero_id=payload.hero_id)
    build.items = [BuildItem(item_id=item_id, position=pos) for pos, item_id in enumerate(payload.items)]
    
    try:
        return create_build(build, session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Não foi possível criar a build: {e}")


def get_build_service(id: int, session: Session):
    try:
        return get_build(id, session)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Não foi possível buscar a build: {e}")


def update_build_service(id: int, payload: BuildUpdate, session: Session):
    build = get_build(id, session)
    build.name = payload.name
    build.description = payload.description

    if (payload.items != build.items) and (len(payload.items) != 0):
        build.items.clear()
        session.flush()
        build.items = [BuildItem(item_id=item_id, position=pos) for pos, item_id in enumerate(payload.items)]

    session.commit()

    return get_build(id, session)


def delete_build_service(id: int, session: Session) -> bool:
    try:
        delete_build(id, session)
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Não foi possível buscar a build: {e}")


def list_build_by_hero_service(id: int, session: Session) -> list[Build]:
    return list_build_by_hero(id, session)


def list_all_items_service(session: Session) -> list[Item]:
    return get_all_items(session)
