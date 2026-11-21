import json
from typing import Annotated
from pathlib import Path
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.schemas.hero import Hero
from app.schemas.item import Item
from app.models.models import Hero


def item_from_json():
    path = Path("C:/Users/thepl/Desktop/items.json")
    raw_list = json.loads(path.read_text(encoding="utf-8"))

    items = []

    for item in raw_list:
        if (item["type"] == "upgrade"):
            items.append(item)

    raw = items[0]

    return Item(
        id=raw["id"],
        name=raw["name"],
        shop_image=raw["shop_image"],
        item_slot_type=raw["item_slot_type"],
        item_tier=raw["item_tier"],
        cost=raw["cost"]
    )

def hero_from_json(raw: dict):
    return Hero(
        id=raw["id"],
        name=raw["name"],
        lore=raw["description"]["lore"],
        hero_type=raw["hero_type"],
        complexity=raw["complexity"],
        icon_url=raw["images"]["icon_hero_card_webp"],
        tags=raw["tags"],
        color_ui='#%02x%02x%02x' % tuple(raw["colors"]["ui"]),
        color_style='#%02x%02x%02x' % tuple(raw["colors"]["style"])
    )

def main():
    engine = create_engine("postgresql+psycopg://app:app@localhost:5432/app", echo=True)
    Session = sessionmaker(engine)

    with Session() as session:
        path = Path("C:/Users/thepl/Desktop/heroes.json")
        raw_heroes = json.loads(path.read_text(encoding="utf-8"))
        # só heróis jogáveis: o arquivo traz também heróis desativados/em teste
        playable = [h for h in raw_heroes if h.get("player_selectable") and not h.get("disabled")]
        for raw in playable:
            session.merge(hero_from_json(raw))  # merge = insere ou atualiza (re-importar a cada patch)
        session.commit()
        print(len(playable))

if __name__ == "__main__":
    main()