from pathlib import Path
import json
from pydantic import BaseModel, ConfigDict
from pprint import pprint

class Hero(BaseModel):
    id: int
    name: str
    hero_type: str
    complexity: int
    lore: str
    tags: list[str]
    icon_url: str
    color_ui: str
    color_style: str

    model_config = ConfigDict(from_attributes=True)


def hero_from_json():
    path = Path("C:/Users/thepl/Desktop/heroes.json")
    raw = json.loads(path.read_text(encoding="utf-8"))

    for i in raw:
        if (i["disabled"] == False and i["player_selectable"]):
            pprint(i["name"])
            hero = Hero(
                id=i["id"],
                name=i["name"],
                lore=i["description"]["lore"],
                hero_type=i["hero_type"],
                complexity=i["complexity"],
                icon_url=i["images"]["icon_hero_card_webp"],
                tags=i["tags"],
                color_ui='#%02x%02x%02x' % tuple(i["colors"]["ui"]),
                color_style='#%02x%02x%02x' % tuple(i["colors"]["style"])
            )
            pprint(hero)


if __name__ == "__main__":
    hero_from_json()