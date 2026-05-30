// app/(dashboard)/dashboard/page.tsx
'use client'
import { ShoppingCart, Users, Star, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'

const stats = [
  { icon: ShoppingCart, label: 'Ventas', value: '$12,450', change: '+12%', color: 'from-emerald-500 to-teal-500' },
  { icon: Users, label: 'Clientes', value: '342', change: '+8%', color: 'from-rose-500 to-pink-500' },
  { icon: Star, label: 'Puntos', value: '1,234', change: '+5%', color: 'from-amber-500 to-orange-500' },
  { icon: TrendingUp, label: 'Crecimiento', value: '23%', change: '+3%', color: 'from-sky-500 to-blue-500' },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido a tu panel de control</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card bg-gradient-to-br ${stat.color}`}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-6 h-6 opacity-90" />
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1">{stat.change}<ArrowUpRight className="w-3 h-3" /></span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-90 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div><Sparkles className="w-8 h-8 mb-2" /><h2 className="text-xl font-bold">Panel de Control</h2><p className="text-sm opacity-90 mt-1">Gestiona tu negocio desde un solo lugar</p></div>
          <div className="flex gap-3"><button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm">Explorar</button><button className="bg-white text-emerald-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium">Ver Productos</button></div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-5 border border-white/50">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600 flex-1">Nueva actividad registrada</span>
              <span className="text-gray-400 text-xs">Hace {i} hora{i !== 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}