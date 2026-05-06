"""
providers/amazon.py
-------------------
Provider de Amazon. Por ahora usa datos mock para desarrollar el frontend
sin depender de APIs externas. Cuando estés listo para conectar la API real,
solo reemplazás el contenido de search() y get_detail(). El resto del sistema
no cambia nada.

API real sugerida: RapidAPI "Real-Time Amazon Data"
  - https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
  - Free tier: 500 requests/mes
"""

import os
from providers.base import BaseProvider
from models.product import Product, Dimensions, Weight

# Datos mock realistas para desarrollo
MOCK_PRODUCTS = [
    Product(
        id="amz-001",
        title="Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        price=279.99,
        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        product_url="https://amazon.com/dp/B09XS7JWHH",
        provider="amazon",
        rating=4.7,
        review_count=12438,
        dimensions=Dimensions(width=19.3, height=25.0, depth=8.1, unit="cm"),
        weight=Weight(value=0.25, unit="kg"),
        category="Electrónica",
        in_stock=True,
    ),
    Product(
        id="amz-002",
        title="Apple AirPods Pro (2nd Generation)",
        price=189.00,
        image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        product_url="https://amazon.com/dp/B0BDHWDR12",
        provider="amazon",
        rating=4.6,
        review_count=8921,
        dimensions=Dimensions(width=6.0, height=4.5, depth=2.1, unit="cm"),
        weight=Weight(value=0.054, unit="kg"),
        category="Electrónica",
        in_stock=True,
    ),
    Product(
        id="amz-003",
        title="Kindle Paperwhite (16 GB) – Waterproof, 6.8\" Display",
        price=139.99,
        image_url="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
        product_url="https://amazon.com/dp/B09TMF6742",
        provider="amazon",
        rating=4.8,
        review_count=31205,
        dimensions=Dimensions(width=17.4, height=12.5, depth=0.81, unit="cm"),
        weight=Weight(value=0.205, unit="kg"),
        category="Tecnología",
        in_stock=True,
    ),
    Product(
        id="amz-004",
        title="Nike Air Max 270 Running Shoes",
        price=115.00,
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        product_url="https://amazon.com/dp/B07DFLXBKK",
        provider="amazon",
        rating=4.4,
        review_count=5672,
        dimensions=Dimensions(width=30.0, height=12.0, depth=20.0, unit="cm"),
        weight=Weight(value=0.8, unit="kg"),
        category="Calzado",
        in_stock=True,
    ),
    Product(
        id="amz-005",
        title="Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Qt",
        price=79.95,
        image_url="https://images.unsplash.com/photo-1585515320310-259814833e62?w=400",
        product_url="https://amazon.com/dp/B00FLYWNYQ",
        provider="amazon",
        rating=4.7,
        review_count=142891,
        dimensions=Dimensions(width=33.0, height=31.7, depth=33.0, unit="cm"),
        weight=Weight(value=5.44, unit="kg"),
        category="Hogar",
        in_stock=True,
    ),
]


class AmazonProvider(BaseProvider):
    name = "amazon"
    display_name = "Amazon"
    logo_url = "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"

    def is_available(self) -> bool:
        # Cuando integres la API real, validar la key acá:
        # return bool(os.getenv("AMAZON_RAPIDAPI_KEY"))
        return True  # Mock siempre disponible

    async def search(self, query: str, filters: dict) -> list[Product]:
        """
        TODO: Reemplazar con llamada real a RapidAPI cuando estés listo.

        Ejemplo de implementación real:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://real-time-amazon-data.p.rapidapi.com/search",
                    params={"query": query, "country": "US"},
                    headers={"X-RapidAPI-Key": os.getenv("AMAZON_RAPIDAPI_KEY")}
                )
                data = response.json()
                return [self._map_to_product(item) for item in data["products"]]
        """
        # Mock: filtrar por query en el título
        query_lower = query.lower()
        return [p for p in MOCK_PRODUCTS if query_lower in p.title.lower()]

    async def get_detail(self, product_id: str) -> Product | None:
        return next((p for p in MOCK_PRODUCTS if p.id == product_id), None)
