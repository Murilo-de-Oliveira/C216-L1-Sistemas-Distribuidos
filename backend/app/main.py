from fastapi import FastAPI

from app.routers import game


def create_app() -> FastAPI:
    app = FastAPI(
        title="Chess Games API",
        description="Registro de partidas de xadrez com tags de erro.",
        version="1.0.0",
    )
    app.include_router(game.router)
    return app


app = create_app()
