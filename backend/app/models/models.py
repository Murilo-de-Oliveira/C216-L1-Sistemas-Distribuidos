from app.database.base import Base
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

class Hero(Base):
    __tablename__ = "heroes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    hero_type: Mapped[str]
    complexity: Mapped[int]
    lore: Mapped[str]
    tags:  Mapped[list[str]] = mapped_column(JSON, default=list)
    icon_url: Mapped[str]
    color_ui: Mapped[str]
    color_style: Mapped[str]

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    shop_image: Mapped[str]
    item_slot_type: Mapped[str]
    item_tier: Mapped[int]
    cost: Mapped[int]