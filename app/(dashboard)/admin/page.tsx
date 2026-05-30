'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: string
  _count: { users: number }
}

export default function AdminPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    // Solo SUPER_ADMIN puede acceder
    if (!token || user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    
    fetchTenants()
  }, [router])

  const fetchTenants = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('http://localhost:3001/api/admin/tenants', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setTenants(data)
    setLoading(false)
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona todas las empresas del sistema</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuarios</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{tenant.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{tenant.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{tenant._count.users}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ver</button>
                    <button className="text-red-600 hover:text-red-900">Suspender</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
