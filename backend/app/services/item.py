from fastapi import HTTPException
from app.repositories import repository
from app.database.connection import Session


def get_item_by_id(id: int, session: Session):
    try:
        return repository.get_item_by_id(id, session)
    except:
        raise HTTPException(status_code=404, detail="Não foi possível encontrar o item")

def get_all_items(session: Session):
    try:
        return repository.get_all_items(session)
    except:
        raise HTTPException(status_code=500, detail="Não foi possível buscar os itens")