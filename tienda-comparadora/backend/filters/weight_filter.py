"""filters/weight_filter.py — filtra por peso máximo del paquete (en kg)."""

from filters.base import BaseFilter
from models.product import Product


class WeightFilter(BaseFilter):
    name = "weight"
    display_name = "Peso máximo"

    def apply(self, products: list[Product], params: dict) -> list[Product]:
        max_kg = params.get("max_kg", float("inf"))

        def within_weight(p: Product) -> bool:
            if p.weight is None:
                return True  # sin datos = no filtrar
            weight_kg = p.weight.value if p.weight.unit == "kg" else p.weight.value / 1000
            return weight_kg <= max_kg

        return [p for p in products if within_weight(p)]
