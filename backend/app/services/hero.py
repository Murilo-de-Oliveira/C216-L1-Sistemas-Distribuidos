from fastapi import HTTPException
from app.repositories import repository
from app.database.connection import Session


def get_hero_by_id(id: int, session: Session):
    try:
        return repository.get_hero_by_id(id, session)
    except:
        print("Não foi possível encontrar o herói")

def get_all_heroes(session: Session):
    try:
        return repository.get_all_heroes(session)
    except:
        print("Não foi possível buscar os heróis")