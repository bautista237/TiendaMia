// services/api.ts
// ---------------
// Capa de servicio: TODAS las llamadas al backend están acá.
// Los componentes nunca llaman fetch() directamente.
// Si el backend cambia una URL, solo se toca este archivo.

import type { SearchRequest, SearchResponse, Product, ProviderInfo } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }))
    throw new Error(error.detail || `HTTP ${response.status}`)
  }

  return response.json()
}

export const api = {
  /**
   * Busca productos en los providers seleccionados.
   * Si providers está vacío, busca en todos los disponibles.
   */
  search: (req: SearchRequest): Promise<SearchResponse> =>
    request('/search', {
      method: 'POST',
      body: JSON.stringify(req),
    }),

  /**
   * Lista los providers disponibles (para mostrar en los filtros).
   */
  getProviders: (): Promise<ProviderInfo[]> =>
    request('/search/providers'),

  /**
   * Detalle de un producto específico.
   */
  getProduct: (provider: string, productId: string): Promise<Product> =>
    request(`/search/product/${provider}/${productId}`),
}
