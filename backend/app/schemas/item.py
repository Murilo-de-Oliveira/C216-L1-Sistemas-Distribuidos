from pathlib import Path
import json
from pydantic import BaseModel
from pprint import pprint

class Item(BaseModel):
    id: int
    name: str
    shop_image: str
    item_slot_type: str
    item_tier: int
    cost: int


def item_from_json():
    path = Path("C:/Users/thepl/Desktop/items.json")
    raw_list = json.loads(path.read_text(encoding="utf-8"))

    items = []

    for item in raw_list:
        if(item["shopable"]):
            pprint(item)
            print(
                Item(
                    id=item["id"],
                    name=item["name"],
                    shop_image=item["shop_image"],
                    item_slot_type=item["item_slot_type"],
                    item_tier=item["item_tier"],
                    cost=item["cost"]
                )
            )

if __name__ == "__main__":
    print(item_from_json())