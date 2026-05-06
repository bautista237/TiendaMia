"""
models/product.py
-----------------
Modelos centrales de datos. Son el "contrato" entre todos los providers
y el resto del sistema. Si un provider devuelve algo que no encaja aquí,
FastAPI lo rechaza automáticamente (tipado fuerte como Java, sin boilerplate).
"""

from pydantic import BaseModel, Field
from typing import Optional


class Dimensions(BaseModel):
    width: float
    height: float
    depth: float
    unit: str = "cm"


class Weight(BaseModel):
    value: float
    unit: str = "kg"


class Product(BaseModel):
    """
    Representación unificada de un producto, independiente del provider.
    Todos los providers deben mapear su respuesta a este modelo.
    """
    id: str
    title: str
    price: float
    currency: str = "USD"
    image_url: str
    product_url: str
    provider: str                          # "amazon" | "ebay" | "walmart" | ...
    rating: Optional[float] = None         # 0.0 - 5.0
    review_count: Optional[int] = None
    dimensions: Optional[Dimensions] = None
    weight: Optional[Weight] = None
    category: Optional[str] = None
    in_stock: bool = True


class SearchRequest(BaseModel):
    """Parámetros de búsqueda que llegan desde el frontend."""
    query: str
    providers: list[str] = Field(default_factory=list)   # vacío = todos
    filters: dict = Field(default_factory=dict)


class SearchResponse(BaseModel):
    """Respuesta estructurada con resultados agrupados por provider."""
    query: str
    total: int
    results: list[Product]
    providers_used: list[str]
    errors: dict[str, str] = Field(default_factory=dict)  # provider -> mensaje de error
