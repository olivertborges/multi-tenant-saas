'use client'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-2">Bienvenido a tu panel de control</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Usuarios</h3>
          <p className="text-2xl font-bold text-emerald-600">124</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Ventas</h3>
          <p className="text-2xl font-bold text-emerald-600">$12,450</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">Productos</h3>
          <p className="text-2xl font-bold text-emerald-600">342</p>
        </div>
      </div>
    </div>
  )
}