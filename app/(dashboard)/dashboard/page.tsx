'use client'
import { useEffect, useState } from 'react'
import { ShoppingCart, Users, Star, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, products: 0, sales: 0, revenue: 0, growth: 0 })
  const [loading, setLoading] = useState(true)

  const getToken = () => localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken()
      try {
        const [productsRes, purchasesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/my`, { headers: { 'Authorization': `Bearer ${token}` } })
        ])
        const products = await productsRes.json()
        const purchases = await purchasesRes.json()
        const totalRevenue = purchases.reduce((sum: number, p: any) => sum + p.total, 0)
        setStats({
          users: 124,
          products: products.length,
          sales: purchases.length,
          revenue: totalRevenue,
          growth: 23
        })
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { icon: ShoppingCart, label: 'Ventas', value: stats.sales, change: '+12%', color: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'Usuarios', value: stats.users, change: '+8%', color: 'from-rose-500 to-pink-500' },
    { icon: Star, label: 'Productos', value: stats.products, change: '+5%', color: 'from-amber-500 to-orange-500' },
    { icon: TrendingUp, label: 'Ingresos', value: `$${stats.revenue.toLocaleString()}`, change: '+23%', color: 'from-sky-500 to-blue-500' },
  ]

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Dashboard</h1><p className="text-gray-500 text-sm mt-1">Bienvenido a tu panel de control</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat, i) => (<div key={i} className={`stat-card bg-gradient-to-br ${stat.color}`}><div className="flex items-center justify-between mb-3"><stat.icon className="w-6 h-6 opacity-90" /><span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{stat.change}</span></div><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm opacity-90 mt-1">{stat.label}</div></div>))}
      </div>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white mb-8 shadow-lg"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><Sparkles className="w-8 h-8 mb-2" /><h2 className="text-xl font-bold">Panel de Control</h2><p className="text-sm opacity-90 mt-1">Gestiona tu negocio desde un solo lugar</p></div><div className="flex gap-3"><button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm">Explorar</button><button className="bg-white text-emerald-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium">Ver Productos</button></div></div></div>
      <div className="bg-white/80 rounded-xl shadow-md p-5"><h3 className="text-sm font-semibold text-gray-700 mb-4">Actividad Reciente</h3><div className="space-y-3">{['Nuevo usuario registrado', 'Se realizó una compra', 'Producto agregado al carrito', 'Nueva reseña publicada'].map((text, i) => (<div key={i} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-gray-50"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div><span className="text-gray-600 flex-1">{text}</span><span className="text-gray-400 text-xs">Hace {i + 1} hora</span></div>))}</div></div>
    </div>
  )
}
