'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingCart, Trash2, Sparkles } from 'lucide-react'

export default function WishlistPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchWishlist = async () => {
    try {
      const token = getToken()
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
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
    else fetchWishlist()
  }, [])

  const removeFromWishlist = async (productId: string) => {
    const token = getToken()
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchWishlist()
  }

  const addToCart = async (productId: string) => {
    const token = getToken()
    await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    })
    alert('Producto agregado al carrito')
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-rose-500" />
          <h1 className="text-2xl font-bold text-gray-800">Mi Lista de Deseos</h1>
        </div>
        <p className="text-gray-500 text-sm">Productos que te gustaron. ¡Guárdalos para después!</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">Tu lista de deseos está vacía</p>
          <button onClick={() => router.push('/products')} className="mt-4 btn-primary">Explorar productos</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="relative h-40 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <span className="text-5xl">❤️</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-lg">{item.product.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.product.description || 'Sin descripción'}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xl font-bold text-emerald-600">${item.product.price}</div>
                  <div className="text-sm text-gray-400">Stock: {item.product.stock}</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => addToCart(item.product.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> Agregar
                  </button>
                  <button onClick={() => removeFromWishlist(item.product.id)} className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
