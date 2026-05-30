'use client'
import { ShoppingCart, Users, Star, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'

const stats = [
  { icon: ShoppingCart, label: 'Ventas', value: '$12,450', change: '+12%', gradient: 'from-indigo-500 to-purple-500', delay: 0 },
  { icon: Users, label: 'Clientes', value: '342', change: '+8%', gradient: 'from-emerald-500 to-teal-500', delay: 100 },
  { icon: Star, label: 'Puntos', value: '1,234', change: '+5%', gradient: 'from-yellow-500 to-orange-500', delay: 200 },
  { icon: TrendingUp, label: 'Crecimiento', value: '23%', change: '+3%', gradient: 'from-rose-500 to-pink-500', delay: 300 },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bienvenido a tu panel de control</p>
      </div>

      {/* Stats Grid con animaciones escalonadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`stat-card bg-gradient-to-r ${stat.gradient}`}
            style={{ animationDelay: `${stat.delay}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-6 h-6" />
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
            <div className="text-sm opacity-90 mt-1">{stat.label}</div>
            <div className="absolute bottom-3 right-3 text-6xl opacity-10 font-bold">✦</div>
          </div>
        ))}
      </div>

      {/* Banner animado */}
      <div className="relative overflow-hidden rounded-2xl mb-8 animate-fade-scale">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="animate-fade-up">
              <Sparkles className="w-8 h-8 mb-2 animate-pulse" />
              <h2 className="text-xl font-bold">✨ Experiencia Premium</h2>
              <p className="text-sm opacity-90 mt-1">Animaciones suaves que dan vida a tu plataforma</p>
            </div>
            <div className="flex gap-3 animate-fade-up delay-200">
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm transition-all hover:scale-105 backdrop-blur-sm">
                Explorar
              </button>
              <button className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105">
                Ver Productos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="glass-card p-5 animate-fade-up delay-300">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-lg">📋</span> Actividad Reciente
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:scale-[1.02] cursor-pointer"
              style={{ animationDelay: `${300 + i * 50}ms` }}
            >
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 dark:text-gray-400 flex-1">Nueva actividad registrada en el sistema</span>
              <span className="text-gray-400 text-xs">Hace {i} hora{i !== 1 ? 's' : ''}</span>
              <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
