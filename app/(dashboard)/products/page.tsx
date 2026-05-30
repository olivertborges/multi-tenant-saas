'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Plus, Edit, Trash2, ShoppingCart, Heart, Sparkles } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, category: '' })
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchProducts = async () => {
    const token = getToken()
    const res = await fetch('http://localhost:3001/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  const fetchWishlist = async () => {
    const token = getToken()
    try {
      const res = await fetch('http://localhost:3001/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const wishlistSet = new Set(data.map((item: any) => item.productId))
        setWishlist(wishlistSet)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const toggleWishlist = async (productId: string) => {
    const token = getToken()
    const isInWishlist = wishlist.has(productId)
    
    if (isInWishlist) {
      await fetch(`http://localhost:3001/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setWishlist(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    } else {
      await fetch('http://localhost:3001/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })
      setWishlist(prev => new Set(prev).add(productId))
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) router.push('/login')
    else {
      fetchProducts()
      fetchWishlist()
    }
  }, [])

  const addToCart = async (productId: string) => {
    const token = getToken()
    await fetch('http://localhost:3001/api/cart/add', {
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
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold text-gray-800">Productos</h1><p className="text-gray-500 text-sm mt-1">Gestiona tu catálogo de productos</p></div>
        <button className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" />Nuevo Producto</button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-400">No hay productos. ¡Crea tu primer producto!</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p: any) => (
            <div key={p.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="relative h-32 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🛍️</span>
                <button 
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:scale-110 transition"
                >
                  <Heart className={`w-4 h-4 ${wishlist.has(p.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{p.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.description || 'Sin descripción'}</p>
                <div className="flex justify-between items-center mt-4">
                  <div><span className="text-2xl font-bold text-emerald-600">${p.price}</span><span className="text-gray-400 text-sm ml-1">ARS</span></div>
                  <div className="text-gray-500 text-sm">Stock: {p.stock}</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => addToCart(p.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700 transition flex items-center justify-center gap-1">
                    <ShoppingCart className="w-3 h-3" /> Agregar
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
                    <Edit className="w-3 h-3" />
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-red-500 rounded-lg text-sm hover:bg-red-50 transition">
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
