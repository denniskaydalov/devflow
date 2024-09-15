from typing import Union
import json

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/json/{relative_path}")
def read_json(relative_path : str):
    with open('src/data.json', 'r') as file:
        data = json.load(file)

        return {"data" : data}
