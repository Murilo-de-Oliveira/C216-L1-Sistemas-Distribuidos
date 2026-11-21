from fastapi import APIRouter, status
from app.schemas.item import Item
from app.services import item as service
from app.database.connection import SessionDep

router = APIRouter(tags=["Itens"], prefix="/items")


@router.get("/all_items", response_model=list[Item])
def get_all_item_route(session: SessionDep):
    return service.get_all_items(session)

@router.get("/{id}", response_model=Item)
def get_item_route(id: int, session: SessionDep):
    return service.get_item_by_id(id, session)