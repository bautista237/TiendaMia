"""
providers/registry.py
---------------------
Registro central de todos los providers.
Este es el ÚNICO lugar que conoce las clases concretas.
El resto del sistema trabaja con la abstracción BaseProvider.

Para agregar un provider nuevo:
  1. Crear su archivo (ej: walmart.py)
  2. Agregar una línea en PROVIDERS acá abajo
  Eso es todo.
"""

from providers.amazon import AmazonProvider
from providers.ebay import EbayProvider
# from providers.walmart import WalmartProvider   ← descomentar cuando esté listo
# from providers.china import ChinaProvider       ← idem

PROVIDERS: dict = {
    "amazon":  AmazonProvider(),
    "ebay":    EbayProvider(),
    # "walmart": WalmartProvider(),
    # "china":   ChinaProvider(),
}


def get_provider(name: str):
    """Devuelve un provider por nombre, o None si no existe."""
    return PROVIDERS.get(name)


def get_available_providers() -> list:
    """Devuelve solo los providers que están configurados y disponibles."""
    return [p for p in PROVIDERS.values() if p.is_available()]
