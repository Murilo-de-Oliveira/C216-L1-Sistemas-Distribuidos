from fastapi import APIRouter, status
from app.schemas.hero import Hero
from app.services import hero as service
from app.database.connection import SessionDep

router = APIRouter(tags=["Heróis"], prefix="/heroes")


@router.get("/all_heroes", response_model=list[Hero])
def get_all_hero_route(session: SessionDep):
    return service.get_all_heroes(session)

@router.get("/{id}", response_model=Hero)
def get_hero_route(id: int, session: SessionDep):
    return service.get_hero_by_id(id, session)
