# Comparadora de Precios Internacional

Buscador y comparador de productos de múltiples providers (Amazon, eBay, Walmart, etc.)
con arquitectura extensible pensada para un solo desarrollador.

## Stack

| Capa       | Tecnología          |
|------------|---------------------|
| Frontend   | React + TypeScript  |
| Backend    | Python + FastAPI    |
| Base datos | PostgreSQL (futuro) |

---

## Estructura del proyecto

```
comparadora/
├── backend/
│   ├── providers/          ← Un archivo por fuente de datos
│   │   ├── base.py         ← Interfaz abstracta (no tocar)
│   │   ├── amazon.py       ← Provider Amazon (mock → API real)
│   │   ├── ebay.py         ← Provider eBay   (mock → API real)
│   │   └── registry.py     ← Registro central (agregar = 1 línea)
│   ├── filters/
│   │   └── filters.py      ← BaseFilter + todos los filtros concretos
│   ├── models/
│   │   └── product.py      ← Modelos Pydantic (contrato de datos)
│   ├── routers/
│   │   └── search.py       ← Endpoints /search
│   ├── main.py             ← Entry point FastAPI
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── types/index.ts  ← Tipos TypeScript (espejo de los modelos Python)
        ├── services/api.ts ← Todas las llamadas al backend
        └── App.tsx         ← UI principal
```

---

## Cómo correr en desarrollo

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Documentación automática disponible en: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev                     # corre en http://localhost:5173
```

---

## Cómo agregar un provider nuevo

1. Crear `backend/providers/walmart.py`:

```python
from providers.base import BaseProvider
from models.product import Product

class WalmartProvider(BaseProvider):
    name = "walmart"
    display_name = "Walmart"
    logo_url = "https://..."

    async def search(self, query: str, filters: dict) -> list[Product]:
        # Tu lógica acá (mock o API real)
        ...

    async def get_detail(self, product_id: str) -> Product | None:
        ...
```

2. Registrarlo en `backend/providers/registry.py`:

```python
from providers.walmart import WalmartProvider

PROVIDERS = {
    "amazon":  AmazonProvider(),
    "ebay":    EbayProvider(),
    "walmart": WalmartProvider(),  # ← esta línea
}
```

3. Agregarlo al frontend en `App.tsx`:

```typescript
const PROVIDERS = ['amazon', 'ebay', 'walmart', 'china']

const PROVIDER_META = {
  ...
  walmart: { label: 'Walmart', color: '#0071CE' },  // ← esta línea
}
```

**El resto del sistema no necesita ningún cambio.**

---

## Cómo agregar un filtro nuevo

En `backend/filters/filters.py`, crear la clase y registrarla:

```python
class BrandFilter(BaseFilter):
    name = "brand"
    display_name = "Marca"

    def apply(self, products: list[Product], params: dict) -> list[Product]:
        brand = params.get("value", "").lower()
        return [p for p in products if brand in p.title.lower()]

# Y al final del archivo, en ALL_FILTERS:
ALL_FILTERS = {
    f.name: f for f in [
        PriceFilter(),
        RatingFilter(),
        WeightFilter(),
        CategoryFilter(),
        InStockFilter(),
        BrandFilter(),   # ← agregar acá
    ]
}
```

---

## Variables de entorno

Crear un archivo `.env` en `/backend`:

```env
# APIs reales (agregar cuando estés listo)
AMAZON_RAPIDAPI_KEY=tu_key_acá
EBAY_API_KEY=tu_key_acá
WALMART_API_KEY=tu_key_acá
```

---

## Roadmap

- [x] Arquitectura base (providers + filtros extensibles)
- [x] Mock data de Amazon y eBay
- [x] Búsqueda paralela con asyncio
- [x] Comparador de precios lado a lado
- [x] UI con cards, filtros y ordenamiento
- [ ] Conectar APIs reales (RapidAPI)
- [ ] Guardar favoritos (PostgreSQL)
- [ ] Historial de búsquedas
- [ ] Alertas de precio
- [ ] Cálculo de costo total con impuestos AR
```
