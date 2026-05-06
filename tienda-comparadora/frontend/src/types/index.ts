// types/index.ts
// --------------
// Tipos TypeScript que espejo exacto de los modelos Pydantic del backend.
// Si cambiás un modelo en Python, actualizás acá también.

export interface Dimensions {
  width: number
  height: number
  depth: number
  unit: string
}

export interface Weight {
  value: number
  unit: string
}

export interface Product {
  id: string
  title: string
  price: number
  currency: string
  image_url: string
  product_url: string
  provider: string
  rating: number | null
  review_count: number | null
  dimensions: Dimensions | null
  weight: Weight | null
  category: string | null
  in_stock: boolean
}

export interface SearchRequest {
  query: string
  providers: string[]
  filters: Record<string, unknown>
}

export interface SearchResponse {
  query: string
  total: number
  results: Product[]
  providers_used: string[]
  errors: Record<string, string>
}

export interface ProviderInfo {
  name: string
  display_name: string
  logo_url: string
  available: boolean
}

// Filtros activos en la UI
export interface ActiveFilters {
  price?: { min: number; max: number }
  rating?: { min: number }
  weight?: { max_kg: number }
  category?: { value: string }
  in_stock?: { only: boolean }
}
