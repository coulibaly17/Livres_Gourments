# Point d'entrée FastAPI pour livresgourmands.net
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Bienvenue sur l'API FastAPI de livresgourmands.net !"}
