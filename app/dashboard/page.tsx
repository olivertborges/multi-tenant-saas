'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({ users: 124, revenue: 15420, growth: 23 })
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
      {/* Botón de menú para móvil */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar - responsive */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl z-40 transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                S
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
                SaaS Enterprise
              </span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              ✕
            </button>
          </div>
          
          <div className="flex-1 space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group">
              <span className="text-2xl group-hover:scale-110 transition">📊</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group">
              <span className="text-2xl group-hover:scale-110 transition">👥</span>
              <span className="font-medium">Usuarios</span>
            </Link>
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group">
              <span className="text-2xl group-hover:scale-110 transition">👑</span>
              <span className="font-medium">Panel Admin</span>
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <span>🚪</span> Cerrar Sesión
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''} lg:ml-0`}>
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1 md:mt-2">
              {user.tenantName || user.tenantSlug} · <span className="text-indigo-600 font-semibold">{user.role}</span>
            </p>
          </motion.div>

          {/* Stats Grid - responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
            {[
              { icon: "👥", label: "Usuarios", value: stats.users, change: "+12%", color: "from-indigo-500 to-purple-500" },
              { icon: "💰", label: "Ingresos", value: `$${stats.revenue.toLocaleString()}`, change: "+23%", color: "from-emerald-500 to-teal-500" },
              { icon: "📈", label: "Crecimiento", value: `${stats.growth}%`, change: "+5%", color: "from-orange-500 to-red-500" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg cursor-pointer`}
              >
                <div className="text-3xl sm:text-5xl mb-2 sm:mb-3">{stat.icon}</div>
                <div className="text-xl sm:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
                <div className="flex items-center gap-1 mt-2 sm:mt-3 text-xs sm:text-sm bg-white/20 inline-flex px-2 py-1 rounded-full">
                  <span>📈</span> {stat.change}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Segunda fila - responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Actividad Reciente */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-2xl">🕒</span> Actividad Reciente
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                      {i}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-800">Actividad #{i}</p>
                      <p className="text-xs text-gray-400">Hace {i} hora{i !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-gray-400 text-sm">→</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Métricas */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg text-white"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                <span>⭐</span> Tu rendimiento
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Objetivo</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                    <div className="bg-white rounded-full h-1.5 sm:h-2" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1">
                    <span>Satisfacción</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2">
                    <div className="bg-white rounded-full h-1.5 sm:h-2" style={{ width: '94%' }} />
                  </div>
                </div>
                <div className="pt-3 sm:pt-4 text-center border-t border-white/20">
                  <p className="text-xs sm:text-sm opacity-90">¡Vas excelente! 🎉</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center text-gray-400 text-xs sm:text-sm">
            <p>✨ SaaS Enterprise · Multi-Tenant Platform ✨</p>
          </div>
        </div>
      </main>
    </div>
  )
}
