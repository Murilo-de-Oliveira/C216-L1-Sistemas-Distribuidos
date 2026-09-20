from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Olá, Sistemas Distribuídos"}


@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"Olá, {name}"}
