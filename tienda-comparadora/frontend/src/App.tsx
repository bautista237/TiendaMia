// App.tsx — Shell de la aplicación con React Router
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'

function Header() {
  const navigate = useNavigate()
  return (
    <header style={{
      borderBottom: '1px solid #1a1a1a',
      padding: '0 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: 60,
      background: '#0a0a0f',
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      >
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-1px' }}>
          <span style={{ color: '#00ff94' }}>precio</span>
          <span style={{ color: '#fff' }}>global</span>
        </span>
        <span style={{
          background: '#1a1a2e', color: '#6666ff',
          fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
        }}>BETA</span>
      </div>
      <nav style={{ display: 'flex', gap: 24, fontSize: 13, color: '#555' }}>
        <Link to="/" style={{ color: '#555', textDecoration: 'none' }}>Búsqueda</Link>
        <span style={{ cursor: 'pointer' }}>Favoritos</span>
        <span style={{ cursor: 'pointer' }}>Historial</span>
      </nav>
    </header>
  )
}

function AppShell() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: '#fff',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
