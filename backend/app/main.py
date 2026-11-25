from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.hero import router as hero_router
from app.routes.item import router as item_router
from app.routes.build import router as build_router

def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(hero_router)
    app.include_router(item_router)
    app.include_router(build_router)
    return app


app = create_app()