"""
providers/base.py
-----------------
Contrato que TODOS los providers deben cumplir.
Mismo patrón que la interfaz Command del CLI: el sistema no sabe
cuántos providers hay, simplemente itera y llama search().

Para agregar un provider nuevo:
  1. Crear un archivo nuevo en esta carpeta (ej: walmart.py)
  2. Heredar de BaseProvider
  3. Implementar los métodos abstractos
  4. Registrarlo en registry.py
  Eso es todo. El resto del sistema no se toca.
"""

from abc import ABC, abstractmethod
from models.product import Product


class BaseProvider(ABC):
    """Interfaz base para todos los proveedores de productos."""

    # Nombre único del provider (debe ser snake_case)
    name: str

    # Nombre para mostrar en la UI
    display_name: str

    # URL del logo (puede ser una URL pública o un path local)
    logo_url: str

    @abstractmethod
    async def search(self, query: str, filters: dict) -> list[Product]:
        """
        Busca productos según el query y los filtros aplicados.

        Args:
            query:   Texto de búsqueda ingresado por el usuario.
            filters: Diccionario de filtros activos (precio, peso, etc.)

        Returns:
            Lista de productos en el formato unificado Product.
        """
        ...

    @abstractmethod
    async def get_detail(self, product_id: str) -> Product | None:
        """
        Obtiene el detalle completo de un producto por su ID.

        Args:
            product_id: ID interno del producto en este provider.

        Returns:
            Producto completo, o None si no se encuentra.
        """
        ...

    def is_available(self) -> bool:
        """
        Indica si el provider está configurado y disponible.
        Sobreescribir si el provider requiere una API key.
        """
        return True
