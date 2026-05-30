'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData || '{}'))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Botón menú móvil */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-40 transition-all duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SaaS Enterprise</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">✕</button>
          </div>
          
          <div className="flex-1 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">📊 Dashboard</Link>
            <Link href="/services" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">🛠️ Servicios</Link>
            <Link href="/agendas" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">📅 Agendas</Link>
            <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">🛍️ Tienda</Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">🛒 Carrito</Link>
            <Link href="/purchases" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">📦 Mis Compras</Link>
            <Link href="/points" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">⭐ Mis Puntos</Link>
            <Link href="/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">👥 Usuarios</Link>
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">👑 Panel Admin</Link>
            <Link href="/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">📊 Reportes</Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">👤 Mi Perfil</Link>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">{user.tenantName || user.tenantSlug} · <span className="text-indigo-600 font-semibold">{user.role}</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/products" className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition">
              <div className="text-4xl mb-3">🛍️</div>
              <div className="text-xl font-bold">Tienda</div>
              <div className="text-sm opacity-90 mt-1">Ver productos</div>
            </Link>
            <Link href="/cart" className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-xl transition">
              <div className="text-4xl mb-3">🛒</div>
              <div className="text-xl font-bold">Carrito</div>
              <div className="text-sm opacity-90 mt-1">Ver mi carrito</div>
            </Link>
            <Link href="/agendas" className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white hover:shadow-xl transition">
              <div className="text-4xl mb-3">📅</div>
              <div className="text-xl font-bold">Reservas</div>
              <div className="text-sm opacity-90 mt-1">Agendar servicio</div>
            </Link>
            <Link href="/points" className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-6 text-white hover:shadow-xl transition">
              <div className="text-4xl mb-3">⭐</div>
              <div className="text-xl font-bold">{user.points || 0} Puntos</div>
              <div className="text-sm opacity-90 mt-1">Mis puntos</div>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">✅ SaaS Enterprise funcionando</h2>
            <p className="text-gray-500">Todos los módulos están activos</p>
          </div>
        </div>
      </main>
    </div>
  )
}
