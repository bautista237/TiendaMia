"""filters/price_filter.py — filtra por rango de precio (min / max en USD)."""

from filters.base import BaseFilter
from models.product import Product


class PriceFilter(BaseFilter):
    name = "price"
    display_name = "Precio"

    def apply(self, products: list[Product], params: dict) -> list[Product]:
        min_price = params.get("min", 0)
        max_price = params.get("max", float("inf"))
        return [p for p in products if min_price <= p.price <= max_price]
