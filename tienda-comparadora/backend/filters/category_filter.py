"""filters/category_filter.py — filtra por categoría de producto."""

from filters.base import BaseFilter
from models.product import Product


class CategoryFilter(BaseFilter):
    name = "category"
    display_name = "Categoría"

    def apply(self, products: list[Product], params: dict) -> list[Product]:
        category = params.get("value", "").lower()
        if not category:
            return products
        return [p for p in products if (p.category or "").lower() == category]
