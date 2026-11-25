from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.schemas.item import Item

class BuildCreate(BaseModel):
    name: str
    description: str | None = None
    hero_id: int
    items: list[int]

class BuildUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    items: list[int] = []

class BuildItemOut(BaseModel):
    position: int
    item: Item
    
    model_config = ConfigDict(from_attributes=True)

class BuildOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    hero_id: int
    created_at: datetime
    items: list[BuildItemOut]

    model_config = ConfigDict(from_attributes=True)