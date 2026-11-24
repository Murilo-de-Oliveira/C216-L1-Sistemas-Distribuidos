from app.database.base import Base
from sqlalchemy import JSON, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone

class Hero(Base):
    __tablename__ = "heroes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    hero_type: Mapped[str]
    complexity: Mapped[int]
    lore: Mapped[str]
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    icon_url: Mapped[str]
    color_ui: Mapped[str]
    color_style: Mapped[str]

    builds: Mapped[list["Build"]] = relationship(back_populates="hero")

class Item(Base):
    __tablename__ = "items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    shop_image: Mapped[str]
    item_slot_type: Mapped[str]
    item_tier: Mapped[int]
    cost: Mapped[int]

class Build(Base):
    __tablename__ = "builds"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str]
    description: Mapped[str | None]
    hero_id: Mapped[int] = mapped_column(ForeignKey("heroes.id"))
    created_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))

    hero: Mapped[Hero] = relationship(back_populates="builds")
    items: Mapped[list["BuildItem"]] = relationship(
        back_populates="build", cascade="all, delete-orphan", order_by="BuildItem.position"
    )

class BuildItem(Base):
    __tablename__ = "build_items"
    __table_args__ = (UniqueConstraint("build_id", "item_id"),)
 
    id: Mapped[int] = mapped_column(primary_key=True)
    build_id: Mapped[int] = mapped_column(ForeignKey("builds.id"))
    item_id: Mapped[int] = mapped_column(ForeignKey("items.id"))
    position: Mapped[int] = mapped_column(default=0)
    phase: Mapped[str | None]
 
    build: Mapped[Build] = relationship(back_populates="items")
    item: Mapped[Item] = relationship()
