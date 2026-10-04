from typing import Annotated

from fastapi import APIRouter, Depends, Path, Query, status

from app.schemas.game import (
    Color,
    ErrorTag,
    GameCreate,
    GameOut,
    GamePatch,
    GameStats,
    Result,
    TimeControl,
)
from app.services.game import GameService, game_service

router = APIRouter(prefix="/games", tags=["games"])


def get_service() -> GameService:
    return game_service


ServiceDep = Annotated[GameService, Depends(get_service)]
GameId = Annotated[int, Path(ge=1, description="Identificador da partida")]
NOT_FOUND = {404: {"description": "Partida não encontrada"}}


@router.get("", response_model=list[GameOut], summary="Lista partidas com filtros")
def list_games(
    service: ServiceDep,
    result: Annotated[Result | None, Query(description="Filtra pelo resultado")] = None,
    color: Annotated[Color | None, Query(description="Filtra pela cor das peças")] = None,
    time_control: Annotated[TimeControl | None, Query(description="Filtra pelo ritmo")] = None,
    error_tag: Annotated[ErrorTag | None, Query(description="Filtra por tag de erro")] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    return service.list_games(
        result=result, color=color, time_control=time_control,
        error_tag=error_tag, limit=limit, offset=offset,
    )


@router.get("/stats", response_model=GameStats, summary="Estatísticas gerais")
def get_stats(service: ServiceDep):
    return service.stats()


@router.get("/{game_id}", response_model=GameOut, responses=NOT_FOUND, summary="Busca uma partida")
def get_game(game_id: GameId, service: ServiceDep):
    return service.get_game(game_id)


@router.post("", response_model=GameOut, status_code=status.HTTP_201_CREATED, summary="Registra uma partida")
def create_game(data: GameCreate, service: ServiceDep):
    return service.create_game(data)


@router.put("/{game_id}", response_model=GameOut, responses=NOT_FOUND, summary="Substitui a partida inteira")
def replace_game(game_id: GameId, data: GameCreate, service: ServiceDep):
    return service.replace_game(game_id, data)


@router.patch("/{game_id}", response_model=GameOut, responses=NOT_FOUND, summary="Atualiza campos da partida")
def patch_game(game_id: GameId, data: GamePatch, service: ServiceDep):
    return service.patch_game(game_id, data)


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT, responses=NOT_FOUND, summary="Remove a partida")
def delete_game(game_id: GameId, service: ServiceDep) -> None:
    service.delete_game(game_id)
