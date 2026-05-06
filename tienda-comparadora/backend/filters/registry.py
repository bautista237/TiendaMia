"""
filters/registry.py
-------------------
Registro central de todos los filtros. Mismo rol que providers/registry.py:
es el ÚNICO lugar que conoce las clases concretas. El resto del sistema trabaja
con la abstracción BaseFilter.

Para agregar un filtro nuevo:
  1. Crear su archivo (ej: brand_filter.py) heredando de BaseFilter
  2. Importarlo y agregarlo a ALL_FILTERS acá abajo
  Eso es todo.
"""

from filters.base import BaseFilter
from filters.price_filter import PriceFilter
from filters.rating_filter import RatingFilter
from filters.weight_filter import WeightFilter
from filters.category_filter import CategoryFilter
from filters.in_stock_filter import InStockFilter
from models.product import Product


ALL_FILTERS: dict[str, BaseFilter] = {
    f.name: f for f in [
        PriceFilter(),
        RatingFilter(),
        WeightFilter(),
        CategoryFilter(),
        InStockFilter(),
        # Agregar nuevos filtros acá ↑
    ]
}


def apply_all_filters(products: list[Product], filters: dict) -> list[Product]:
    """
    Aplica todos los filtros activos en secuencia.
    Solo aplica los filtros que están presentes en el dict recibido.
    """
    for filter_name, params in filters.items():
        if filter_name in ALL_FILTERS:
            products = ALL_FILTERS[filter_name].apply(products, params)
    return products
