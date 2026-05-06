// App.tsx — Comparadora de Precios Internacional
// Estética: dark editorial, tipografía fuerte, grilla densa

import { useState, useCallback } from 'react'
import type { Product, ActiveFilters, SearchResponse } from './types'

// ─── Datos mock locales (mientras el backend no esté corriendo) ────────────
const MOCK_RESULTS: Product[] = [
  {
    id: 'amz-001', title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 279.99, currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    product_url: '#', provider: 'amazon', rating: 4.7, review_count: 12438,
    dimensions: { width: 19.3, height: 25.0, depth: 8.1, unit: 'cm' },
    weight: { value: 0.25, unit: 'kg' }, category: 'Electrónica', in_stock: true,
  },
  {
    id: 'ebay-001', title: 'Sony WH-1000XM5 — Open Box Like New',
    price: 211.50, currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    product_url: '#', provider: 'ebay', rating: 4.5, review_count: 87,
    dimensions: { width: 19.3, height: 25.0, depth: 8.1, unit: 'cm' },
    weight: { value: 0.25, unit: 'kg' }, category: 'Electrónica', in_stock: true,
  },
  {
    id: 'amz-002', title: 'Apple AirPods Pro (2nd Generation)',
    price: 189.00, currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    product_url: '#', provider: 'amazon', rating: 4.6, review_count: 8921,
    dimensions: { width: 6.0, height: 4.5, depth: 2.1, unit: 'cm' },
    weight: { value: 0.054, unit: 'kg' }, category: 'Electrónica', in_stock: true,
  },
  {
    id: 'ebay-003', title: 'Apple AirPods Pro 2nd Gen — Sealed',
    price: 175.00, currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    product_url: '#', provider: 'ebay', rating: 4.6, review_count: 213,
    dimensions: { width: 6.0, height: 4.5, depth: 2.1, unit: 'cm' },
    weight: { value: 0.054, unit: 'kg' }, category: 'Electrónica', in_stock: true,
  },
  {
    id: 'amz-003', title: 'Kindle Paperwhite 16GB — 6.8" Waterproof',
    price: 139.99, currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    product_url: '#', provider: 'amazon', rating: 4.8, review_count: 31205,
    dimensions: { width: 17.4, height: 12.5, depth: 0.81, unit: 'cm' },
    weight: { value: 0.205, unit: 'kg' }, category: 'Tecnología', in_stock: true,
  },
  {
    id: 'amz-004', title: 'Nike Air Max 270 Running Shoes',
    price: 115.00, currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    product_url: '#', provider: 'amazon', rating: 4.4, review_count: 5672,
    dimensions: { width: 30.0, height: 12.0, depth: 20.0, unit: 'cm' },
    weight: { value: 0.8, unit: 'kg' }, category: 'Calzado', in_stock: true,
  },
]

const PROVIDER_META: Record<string, { label: string; color: string }> = {
  amazon:  { label: 'Amazon',  color: '#FF9900' },
  ebay:    { label: 'eBay',    color: '#0064D2' },
  walmart: { label: 'Walmart', color: '#0071CE' },
  china:   { label: 'China',   color: '#DE2910' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function stars(rating: number | null) {
  if (!rating) return '—'
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}

function fmtDims(d: Product['dimensions']) {
  if (!d) return null
  return `${d.width} × ${d.height} × ${d.depth} ${d.unit}`
}

function fmtWeight(w: Product['weight']) {
  if (!w) return null
  return `${w.value} ${w.unit}`
}

// ─── Componente ProductCard ───────────────────────────────────────────────
function ProductCard({
  product, selected, onSelect,
}: {
  product: Product
  selected: boolean
  onSelect: (p: Product) => void
}) {
  const meta = PROVIDER_META[product.provider] ?? { label: product.provider, color: '#888' }
  const dims = fmtDims(product.dimensions)
  const weight = fmtWeight(product.weight)

  return (
    <div
      onClick={() => onSelect(product)}
      style={{
        background: selected ? '#1a1a2e' : '#111118',
        border: `1px solid ${selected ? meta.color : '#222'}`,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color .2s, transform .15s',
        transform: selected ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* imagen */}
      <div style={{ position: 'relative', paddingTop: '66%', background: '#1a1a1a' }}>
        <img
          src={product.image_url}
          alt={product.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* badge provider */}
        <span style={{
          position: 'absolute', top: 8, left: 8,
          background: meta.color, color: '#fff',
          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
          letterSpacing: '.5px',
        }}>
          {meta.label.toUpperCase()}
        </span>
        {/* badge compare */}
        {selected && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#00ff94', color: '#000',
            fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 20,
          }}>✓ COMPARANDO</span>
        )}
      </div>

      {/* info */}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4, color: '#ddd', fontFamily: 'inherit' }}>
          {product.title}
        </p>

        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
          US$ {product.price.toFixed(2)}
        </p>

        {product.rating && (
          <p style={{ margin: 0, fontSize: 12, color: '#FF9900' }}>
            {stars(product.rating)}{' '}
            <span style={{ color: '#666' }}>({product.review_count?.toLocaleString()})</span>
          </p>
        )}

        {/* dimensiones y peso */}
        {(dims || weight) && (
          <div style={{
            marginTop: 4, padding: '8px 10px',
            background: '#1a1a1a', borderRadius: 8,
            fontSize: 11, color: '#888', lineHeight: 1.8,
          }}>
            {dims && <div>📦 <strong style={{ color: '#aaa' }}>Dimensiones:</strong> {dims}</div>}
            {weight && <div>⚖️ <strong style={{ color: '#aaa' }}>Peso:</strong> {weight}</div>}
          </div>
        )}

        {product.category && (
          <span style={{
            alignSelf: 'flex-start', marginTop: 'auto',
            background: '#222', color: '#666',
            fontSize: 10, padding: '2px 8px', borderRadius: 20, letterSpacing: '.5px',
          }}>
            {product.category.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Componente CompareTable ──────────────────────────────────────────────
function CompareTable({ products, onClose }: { products: Product[]; onClose: () => void }) {
  if (products.length < 2) return null

  const fields = [
    { label: 'Precio', render: (p: Product) => `US$ ${p.price.toFixed(2)}` },
    { label: 'Provider', render: (p: Product) => PROVIDER_META[p.provider]?.label ?? p.provider },
    { label: 'Rating', render: (p: Product) => p.rating ? `${p.rating} / 5` : '—' },
    { label: 'Dimensiones', render: (p: Product) => fmtDims(p.dimensions) ?? '—' },
    { label: 'Peso', render: (p: Product) => fmtWeight(p.weight) ?? '—' },
    { label: 'Stock', render: (p: Product) => p.in_stock ? '✅ Disponible' : '❌ Sin stock' },
    { label: 'Categoría', render: (p: Product) => p.category ?? '—' },
  ]

  const cheapest = products.reduce((a, b) => a.price < b.price ? a : b)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24,
    }}>
      <div style={{
        background: '#111118', border: '1px solid #333', borderRadius: 16,
        padding: 32, maxWidth: 900, width: '100%', maxHeight: '80vh', overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 20 }}>Comparación de productos</h2>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid #333', color: '#888',
            padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
          }}>Cerrar</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: '#555', fontWeight: 600 }}></th>
              {products.map(p => {
                const meta = PROVIDER_META[p.provider]
                const isCheapest = p.id === cheapest.id
                return (
                  <th key={p.id} style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: meta?.color ?? '#888', fontWeight: 700, marginBottom: 4 }}>
                      {meta?.label.toUpperCase()}
                    </div>
                    <div style={{ color: '#ccc', fontSize: 12, fontWeight: 400, lineHeight: 1.3 }}>
                      {p.title.substring(0, 50)}{p.title.length > 50 ? '…' : ''}
                    </div>
                    {isCheapest && (
                      <div style={{ marginTop: 4, fontSize: 10, color: '#00ff94', fontWeight: 700 }}>
                        🏆 MÁS BARATO
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.label} style={{ borderTop: '1px solid #1e1e1e' }}>
                <td style={{ padding: '10px 12px', color: '#555', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {field.label}
                </td>
                {products.map(p => (
                  <td key={p.id} style={{
                    padding: '10px 12px', textAlign: 'center', color: '#ccc',
                    background: field.label === 'Precio' && p.id === cheapest.id ? '#0f2a1a' : 'transparent',
                    fontWeight: field.label === 'Precio' ? 700 : 400,
                    color: field.label === 'Precio' && p.id === cheapest.id ? '#00ff94' : '#ccc',
                  }}>
                    {field.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── App Principal ────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [compareList, setCompareList] = useState<Product[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc')
  const [filters, setFilters] = useState<ActiveFilters>({})

  const PROVIDERS = ['amazon', 'ebay', 'walmart', 'china']

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)

    // Simular delay de red + usar mock data
    await new Promise(r => setTimeout(r, 700))
    const q = query.toLowerCase()
    const filtered = MOCK_RESULTS.filter(p =>
      p.title.toLowerCase().includes(q) &&
      (selectedProviders.length === 0 || selectedProviders.includes(p.provider))
    )
    setResults(filtered)
    setLoading(false)
  }, [query, selectedProviders])

  const toggleProvider = (name: string) => {
    setSelectedProviders(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    )
  }

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id)
      if (prev.length >= 4) return prev  // máximo 4 para comparar
      return [...prev, product]
    })
  }

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    return (b.rating ?? 0) - (a.rating ?? 0)
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#fff',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      {/* ── HEADER ── */}
      <header style={{
        borderBottom: '1px solid #1a1a1a',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-1px' }}>
            <span style={{ color: '#00ff94' }}>precio</span>
            <span style={{ color: '#fff' }}>global</span>
          </span>
          <span style={{
            background: '#1a1a2e', color: '#6666ff',
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, letterSpacing: 1,
          }}>BETA</span>
        </div>
        <nav style={{ display: 'flex', gap: 24, fontSize: 13, color: '#555' }}>
          <span style={{ cursor: 'pointer' }}>Búsqueda</span>
          <span style={{ cursor: 'pointer' }}>Favoritos</span>
          <span style={{ cursor: 'pointer' }}>Historial</span>
        </nav>
      </header>

      {/* ── HERO / SEARCH ── */}
      <div style={{
        padding: searched ? '32px 32px 0' : '80px 32px 60px',
        transition: 'padding .4s ease',
        maxWidth: 900, margin: '0 auto',
      }}>
        {!searched && (
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h1 style={{
              fontSize: 52, fontWeight: 900, letterSpacing: '-2px', margin: '0 0 12px',
              lineHeight: 1.05,
            }}>
              Compará precios<br />
              <span style={{ color: '#00ff94' }}>de todo el mundo.</span>
            </h1>
            <p style={{ color: '#555', fontSize: 16, margin: 0 }}>
              Amazon · eBay · Walmart · China — en una sola búsqueda
            </p>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Buscá cualquier producto..."
            style={{
              flex: 1, padding: '14px 20px', fontSize: 15,
              background: '#111118', border: '1px solid #222', borderRadius: 10, color: '#fff',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '14px 28px', background: '#00ff94', color: '#000',
              border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '.5px',
              opacity: loading ? .6 : 1,
            }}
          >
            {loading ? '...' : 'BUSCAR'}
          </button>
        </div>

        {/* Selector de providers */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {PROVIDERS.map(name => {
            const meta = PROVIDER_META[name]
            const active = selectedProviders.includes(name)
            return (
              <button key={name} onClick={() => toggleProvider(name)} style={{
                padding: '5px 14px', fontSize: 12, fontWeight: 700,
                background: active ? meta.color : '#111118',
                color: active ? '#fff' : '#555',
                border: `1px solid ${active ? meta.color : '#222'}`,
                borderRadius: 20, cursor: 'pointer', letterSpacing: '.5px',
              }}>
                {meta.label.toUpperCase()}
              </button>
            )
          })}
          {selectedProviders.length > 0 && (
            <button onClick={() => setSelectedProviders([])} style={{
              padding: '5px 14px', fontSize: 11, background: 'none',
              color: '#444', border: '1px solid #222', borderRadius: 20, cursor: 'pointer',
            }}>
              limpiar
            </button>
          )}
        </div>
      </div>

      {/* ── RESULTADOS ── */}
      {searched && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 60px' }}>

          {/* barra de resultados */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ color: '#555', fontSize: 13 }}>
              {loading ? 'Buscando...' : `${sorted.length} resultado${sorted.length !== 1 ? 's' : ''}`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* comparar */}
              {compareList.length >= 2 && (
                <button onClick={() => setShowCompare(true)} style={{
                  padding: '7px 16px', background: '#00ff94', color: '#000',
                  border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: 'pointer',
                }}>
                  COMPARAR ({compareList.length})
                </button>
              )}
              {compareList.length === 1 && (
                <span style={{ fontSize: 12, color: '#555' }}>Seleccioná otro para comparar</span>
              )}
              {/* sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                style={{
                  background: '#111118', border: '1px solid #222', color: '#888',
                  padding: '7px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                }}
              >
                <option value="price_asc">Precio: menor primero</option>
                <option value="price_desc">Precio: mayor primero</option>
                <option value="rating">Mejor calificados</option>
              </select>
            </div>
          </div>

          {/* grilla */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#333', fontSize: 14 }}>
              Buscando en todos los providers...
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#333', fontSize: 14 }}>
              Sin resultados para "{query}". Probá con otra búsqueda.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}>
              {sorted.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={!!compareList.find(p => p.id === product.id)}
                  onSelect={toggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL COMPARACIÓN ── */}
      {showCompare && (
        <CompareTable
          products={compareList}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  )
}
