"""filters/in_stock_filter.py — muestra solo productos en stock."""

from filters.base import BaseFilter
from models.product import Product


class InStockFilter(BaseFilter):
    name = "in_stock"
    display_name = "En stock"

    def apply(self, products: list[Product], params: dict) -> list[Product]:
        if not params.get("only", False):
            return products
        return [p for p in products if p.in_stock]
