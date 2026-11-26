from fastapi import APIRouter, status
from app.schemas.hero import Hero
from app.schemas.build import BuildOut
from app.services import hero as hero_service
from app.services import build as build_service
from app.database.connection import SessionDep

router = APIRouter(tags=["Heróis"], prefix="/heroes")


@router.get("/all_heroes", response_model=list[Hero])
def get_all_hero_route(session: SessionDep):
    return hero_service.get_all_heroes(session)

@router.get("/{id}", response_model=Hero)
def get_hero_route(id: int, session: SessionDep):
    return hero_service.get_hero_by_id(id, session)

@router.get("/{id}/builds", response_model=list[BuildOut])
def list_hero_builds(id: int, session: SessionDep):
    return build_service.list_build_by_hero_service(id, session)

