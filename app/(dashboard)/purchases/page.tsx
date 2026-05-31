'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchPurchases = async () => {
    try {
      const token = getToken()
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/purchases/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) router.push('/login')
    else fetchPurchases()
  }, [])

  const getStatusColor = (status) => {
    const colors = { PENDING: 'bg-yellow-100 text-yellow-800', PAID: 'bg-green-100 text-green-800', SHIPPED: 'bg-blue-100 text-blue-800', DELIVERED: 'bg-purple-100 text-purple-800', CANCELLED: 'bg-red-100 text-red-800' }
    return colors[status] || 'bg-gray-100'
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mis Compras</h1>

        {purchases.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-400">No has realizado compras aún</p>
            <button onClick={() => router.push('/products')} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg">Ver productos</button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Orden #{p.id.slice(0,8)}</p>
                    <p className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>{p.status}</div>
                </div>

                <div className="space-y-3">
                  {p.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">🛍️</div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="font-bold">${item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t mt-4 pt-4 text-right">
                  <p className="text-lg font-bold">Total: ${p.total}</p>
                  {p.pointsEarned > 0 && <p className="text-sm text-green-600">Ganaste {p.pointsEarned} puntos</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
