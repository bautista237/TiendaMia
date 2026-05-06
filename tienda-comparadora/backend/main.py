"""
main.py
-------
Entry point de la aplicación FastAPI.
Para correr en desarrollo: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.search import router as search_router

app = FastAPI(
    title="Comparadora de Precios API",
    description="API para buscar y comparar productos de múltiples providers internacionales.",
    version="0.1.0",
)

# CORS: permite que el frontend (React en localhost:5173) llame al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(search_router)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Comparadora API corriendo"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
