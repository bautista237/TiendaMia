"""filters/rating_filter.py — filtra por rating mínimo (0.0 - 5.0)."""

from filters.base import BaseFilter
from models.product import Product


class RatingFilter(BaseFilter):
    name = "rating"
    display_name = "Calificación"

    def apply(self, products: list[Product], params: dict) -> list[Product]:
        min_rating = params.get("min", 0)
        return [p for p in products if (p.rating or 0) >= min_rating]
