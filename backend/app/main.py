from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ORIGINS
from app.routers import game


def create_app() -> FastAPI:
    app = FastAPI(
        title="Chess Games API",
        description="Registro de partidas de xadrez com tags de erro.",
        version="1.0.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type"],
    )
    app.include_router(game.router)
    return app


app = create_app()
