'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
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

  if (!user) return <div className="flex items-center justify-center h-screen">Cargando...</div>

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white border-r p-5">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-8">
          SaaS Enterprise
        </h1>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block p-2 rounded text-gray-700 hover:bg-gray-100">📊 Dashboard</Link>
          <Link href="/users" className="block p-2 rounded text-gray-700 hover:bg-gray-100">👥 Usuarios</Link>
          <div className="block p-2 rounded text-gray-400">🏢 Empresa</div>
          <div className="block p-2 rounded text-gray-400">💰 Facturación</div>
        </nav>
        <button onClick={handleLogout} className="mt-8 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
          🚪 Cerrar Sesión
        </button>
      </div>

      <div className="flex-1 bg-gray-100">
        <div className="bg-white p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">{user.tenantName || user.tenantSlug} | {user.name} ({user.role})</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl mb-2">🏢</div>
              <div className="text-xl font-bold">{user.tenantName || user.tenantSlug}</div>
              <div className="text-gray-500 text-sm">Empresa</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl mb-2">👤</div>
              <div className="text-xl font-bold">{user.name}</div>
              <div className="text-gray-500 text-sm">Usuario</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl mb-2">👑</div>
              <div className="text-xl font-bold">{user.role}</div>
              <div className="text-gray-500 text-sm">Rol</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">✅ Sistema Multi-Tenant con Roles y Permisos</h3>
            <p>Gestiona usuarios desde el menú "Usuarios".</p>
            <p className="text-xs text-gray-400 mt-3">Tenant ID: {user.tenantId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
