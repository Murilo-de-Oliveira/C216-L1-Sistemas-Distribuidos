from fastapi import APIRouter, status
from app.schemas.build import BuildCreate, BuildOut, BuildUpdate
from app.services import build as service
from app.database.connection import SessionDep

router = APIRouter(tags=["Builds"], prefix="/builds")


@router.post("", response_model=BuildOut, status_code=201)
def create_build_route(payload: BuildCreate, session: SessionDep):
    return service.create_build_service(payload, session)

@router.get("/{id}", response_model=BuildOut, status_code=200)
def get_build_route(id: int, session: SessionDep):
    return service.get_build_service(id, session)

@router.put("/{id}", response_model=BuildOut, status_code=200)
def update_build_route(id: int, payload: BuildUpdate, session: SessionDep):
    return service.update_build_service(id, payload, session)

@router.delete("/{id}", status_code=204)
def delete_build_route(id: int, session: SessionDep):
    return service.delete_build_service(id, session)