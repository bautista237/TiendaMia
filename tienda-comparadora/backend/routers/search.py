"""
routers/search.py
-----------------
Endpoints de búsqueda y comparación.
La lógica central: buscar en todos los providers EN PARALELO (asyncio.gather)
y unificar los resultados.
"""

import asyncio
from fastapi import APIRouter, HTTPException
from models.product import SearchRequest, SearchResponse, Product
from providers.registry import get_available_providers, get_provider
from filters.registry import apply_all_filters

router = APIRouter(prefix="/search", tags=["search"])


@router.post("", response_model=SearchResponse)
async def search_products(request: SearchRequest) -> SearchResponse:
    """
    Busca productos en todos los providers seleccionados en paralelo.
    Si un provider falla, el error se registra pero no cancela la búsqueda.
    """
    # Determinar qué providers usar
    if request.providers:
        providers = [get_provider(name) for name in request.providers if get_provider(name)]
    else:
        providers = get_available_providers()

    if not providers:
        raise HTTPException(status_code=503, detail="No hay providers disponibles")

    # Buscar en todos los providers EN PARALELO
    tasks = [provider.search(request.query, request.filters) for provider in providers]
    results_per_provider = await asyncio.gather(*tasks, return_exceptions=True)

    # Unificar resultados y registrar errores
    all_products: list[Product] = []
    providers_used: list[str] = []
    errors: dict[str, str] = {}

    for provider, result in zip(providers, results_per_provider):
        if isinstance(result, Exception):
            errors[provider.name] = str(result)
        else:
            all_products.extend(result)
            providers_used.append(provider.name)

    # Aplicar filtros sobre el resultado unificado
    filtered = apply_all_filters(all_products, request.filters)

    return SearchResponse(
        query=request.query,
        total=len(filtered),
        results=filtered,
        providers_used=providers_used,
        errors=errors,
    )


@router.get("/providers")
async def list_providers():
    """Lista los providers disponibles con su metadata (para el frontend)."""
    providers = get_available_providers()
    return [
        {
            "name": p.name,
            "display_name": p.display_name,
            "logo_url": p.logo_url,
            "available": p.is_available(),
        }
        for p in providers
    ]


@router.get("/product/{provider}/{product_id}", response_model=Product)
async def get_product_detail(provider: str, product_id: str) -> Product:
    """Obtiene el detalle completo de un producto específico."""
    p = get_provider(provider)
    if not p:
        raise HTTPException(status_code=404, detail=f"Provider '{provider}' no encontrado")

    product = await p.get_detail(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    return product
