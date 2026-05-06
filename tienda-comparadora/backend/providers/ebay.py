"""
providers/ebay.py
-----------------
Provider de eBay con datos mock.

API real sugerida: RapidAPI "Ebay Search"
  - https://rapidapi.com/meljakjakjakjak/api/ebay32
  - O la API oficial de eBay (requiere registro como developer)
"""

from providers.base import BaseProvider
from models.product import Product, Dimensions, Weight

MOCK_PRODUCTS = [
    Product(
        id="ebay-001",
        title="Sony WH-1000XM5 Headphones - Like New - Open Box",
        price=211.50,
        image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        product_url="https://ebay.com/itm/sony-wh1000xm5",
        provider="ebay",
        rating=4.5,
        review_count=87,
        dimensions=Dimensions(width=19.3, height=25.0, depth=8.1, unit="cm"),
        weight=Weight(value=0.25, unit="kg"),
        category="Electrónica",
        in_stock=True,
    ),
    Product(
        id="ebay-002",
        title="Nike Air Max 270 - Size 10 - Barely Used",
        price=68.00,
        image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        product_url="https://ebay.com/itm/nike-air-max-270",
        provider="ebay",
        rating=4.2,
        review_count=34,
        dimensions=Dimensions(width=30.0, height=12.0, depth=20.0, unit="cm"),
        weight=Weight(value=0.9, unit="kg"),
        category="Calzado",
        in_stock=True,
    ),
    Product(
        id="ebay-003",
        title="Apple AirPods Pro 2nd Gen - Sealed Box",
        price=175.00,
        image_url="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        product_url="https://ebay.com/itm/airpods-pro-2",
        provider="ebay",
        rating=4.6,
        review_count=213,
        dimensions=Dimensions(width=6.0, height=4.5, depth=2.1, unit="cm"),
        weight=Weight(value=0.054, unit="kg"),
        category="Electrónica",
        in_stock=True,
    ),
]


class EbayProvider(BaseProvider):
    name = "ebay"
    display_name = "eBay"
    logo_url = "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg"

    async def search(self, query: str, filters: dict) -> list[Product]:
        query_lower = query.lower()
        return [p for p in MOCK_PRODUCTS if query_lower in p.title.lower()]

    async def get_detail(self, product_id: str) -> Product | None:
        return next((p for p in MOCK_PRODUCTS if p.id == product_id), None)
