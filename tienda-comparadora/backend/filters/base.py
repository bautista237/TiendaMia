"""
filters/base.py
---------------
Contrato que TODOS los filtros deben cumplir. Mismo patrón que providers/base.py:
cada filtro es una clase intercambiable, y el registro central los orquesta.

Para agregar un filtro nuevo:
  1. Crear un archivo en esta carpeta (ej: brand_filter.py)
  2. Heredar de BaseFilter e implementar apply()
  3. Registrarlo en registry.py
  Eso es todo.
"""

from abc import ABC, abstractmethod
from models.product import Product


class BaseFilter(ABC):
    """Contrato que todos los filtros deben cumplir."""

    name: str           # clave usada en el JSON de filters (ej: "price")
    display_name: str   # nombre para mostrar en la UI

    @abstractmethod
    def apply(self, products: list[Product], params: dict) -> list[Product]:
        """
        Filtra la lista de productos según los parámetros dados.

        Args:
            products: Lista de productos a filtrar.
            params:   Parámetros específicos de este filtro (vienen del frontend).

        Returns:
            Lista filtrada.
        """
        ...
