'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RevenueChart from '@/components/RevenueChart'
import UsersChart from '@/components/UsersChart'

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
            <Link href="/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">🛍️ Productos</Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">🛒 Carrito</Link>
            <Link href="/purchases" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">📦 Mis Compras</Link>
            <Link href="/points" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">⭐ Mis Puntos</Link>
            <Link href="/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">👥 Usuarios</Link>
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition">👑 Panel Admin</Link>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 mt-1">{user.tenantName || user.tenantSlug} · <span className="text-indigo-600 font-semibold">{user.role}</span></p>
          </div>

          {/* Tarjetas de stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-2xl font-bold">124</div>
              <div className="text-sm opacity-90">Usuarios Activos</div>
              <div className="text-xs mt-2 opacity-75">+12% vs mes anterior</div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
              <div className="text-4xl mb-2">💰</div>
              <div className="text-2xl font-bold">$15,420</div>
              <div className="text-sm opacity-90">Ingresos Mensuales</div>
              <div className="text-xs mt-2 opacity-75">+23% vs mes anterior</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="text-4xl mb-2">📈</div>
              <div className="text-2xl font-bold">23%</div>
              <div className="text-sm opacity-90">Tasa de Crecimiento</div>
              <div className="text-xs mt-2 opacity-75">+5% vs mes anterior</div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RevenueChart />
            <UsersChart />
          </div>

          {/* Actividad reciente */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🕒 Actividad Reciente</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">{i}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Nuevo usuario registrado</p>
                    <p className="text-xs text-gray-400">Hace {i} hora{i !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
