'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Plus, Edit, Trash2, ShoppingCart, Heart, Star, MessageCircle, X, Search, Filter } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', category: '', sortBy: 'newest' })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchProducts = async () => {
    const token = getToken()
    const res = await fetch(`${API_URL}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    setProducts(data)
    setFilteredProducts(data)
    setLoading(false)
  }

  const fetchWishlist = async () => {
    const token = getToken()
    try {
      const res = await fetch(`${API_URL}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setWishlist(new Set(data.map((item: any) => item.productId)))
      }
    } catch (error) {
      console.error('Error:', error)
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

  const applyFilters = () => {
    let result = [...products]
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice))
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice))
    if (filters.category) result = result.filter(p => p.category?.toLowerCase().includes(filters.category.toLowerCase()))
    if (filters.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (filters.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (filters.sortBy === 'newest') result.sort((a, b) => b.id.localeCompare(a.id))
    setFilteredProducts(result)
  }

  useEffect(() => { applyFilters() }, [searchQuery, filters, products])

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({ minPrice: '', maxPrice: '', category: '', sortBy: 'newest' })
    setShowFilters(false)
  }

  const addToCart = async (productId: string) => {
    const token = getToken()
    await fetch(`${API_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity: 1 })
    })
    alert('Producto agregado al carrito')
  }

  const toggleWishlist = async (productId: string) => {
    const token = getToken()
    if (wishlist.has(productId)) {
      await fetch(`${API_URL}/wishlist/remove/${productId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setWishlist(prev => { const newSet = new Set(prev); newSet.delete(productId); return newSet })
    } else {
      await fetch(`${API_URL}/wishlist/add`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId }) })
      setWishlist(prev => new Set(prev).add(productId))
    }
  }

  const openReviews = async (product: Product) => {
    setSelectedProduct(product)
    const token = getToken()
    const [reviewsRes, ratingRes] = await Promise.all([
      fetch(`${API_URL}/reviews/product/${product.id}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_URL}/reviews/product/${product.id}/rating`, { headers: { Authorization: `Bearer ${token}` } })
    ])
    if (reviewsRes.ok) setReviews(await reviewsRes.json())
    if (ratingRes.ok) { const data = await ratingRes.json(); setAverageRating(data.average || 0) }
    setShowReviewModal(true)
  }

  const submitReview = async () => {
    if (reviewRating === 0) { alert('Selecciona una calificación'); return }
    const token = getToken()
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId: selectedProduct?.id, rating: reviewRating, comment: reviewComment })
    })
    if (res.ok) {
      setReviewRating(0); setReviewComment('')
      if (selectedProduct) openReviews(selectedProduct)
      alert('Reseña enviada')
    } else alert('Error')
  }

  const StarRating = ({ rating, onRatingChange, readonly = false }: any) => (
    <div className="flex gap-1">{[...Array(5)].map((_, i) => (<button key={i} type="button" onClick={() => !readonly && onRatingChange?.(i + 1)} className={!readonly ? 'cursor-pointer' : 'cursor-default'}><Star size={20} className={`${i + 1 <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} /></button>))}</div>
  )

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4"><div><h1 className="text-2xl font-bold text-gray-800">Productos</h1><p className="text-gray-500 text-sm mt-1">Gestiona tu catálogo</p></div><button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" />Nuevo</button></div>

      {/* Búsqueda y filtros */}
      <div className="mb-6"><div className="flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Buscar productos..." className="w-full pl-9 pr-4 py-2 border rounded-lg" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"><Filter className="w-4 h-4" />Filtros</button>{(searchQuery || filters.minPrice || filters.maxPrice || filters.category) && <button onClick={clearFilters} className="px-4 py-2 bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>}</div>
      {showFilters && (<div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4"><input type="number" placeholder="Precio min" className="p-2 border rounded-lg" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} /><input type="number" placeholder="Precio max" className="p-2 border rounded-lg" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} /><input type="text" placeholder="Categoría" className="p-2 border rounded-lg" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} /><select className="p-2 border rounded-lg" value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}><option value="newest">Más nuevos</option><option value="price_asc">Precio menor</option><option value="price_desc">Precio mayor</option></select></div>)}</div>

      {filteredProducts.length === 0 ? (<div className="text-center py-16 bg-white rounded-xl"><Package className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-400">No hay productos</p></div>) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition hover:-translate-y-1 overflow-hidden border border-gray-100">
              <div className="relative h-32 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <span className="text-5xl">🛍️</span>
                <button onClick={() => toggleWishlist(p.id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80"><Heart className={`w-4 h-4 ${wishlist.has(p.id) ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} /></button>
                <button onClick={() => openReviews(p)} className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80"><MessageCircle className="w-4 h-4 text-gray-500" /></button>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{p.description || 'Sin descripción'}</p>
                <div className="flex justify-between items-center mt-4"><div><span className="text-2xl font-bold text-emerald-600">${p.price}</span><span className="text-gray-400 text-sm ml-1">ARS</span></div><div className="text-gray-500 text-sm">Stock: {p.stock}</div></div>
                <div className="flex gap-2 mt-4"><button onClick={() => addToCart(p.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm hover:bg-emerald-700">Agregar</button><button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">Editar</button><button className="px-3 py-2 bg-gray-100 text-red-500 rounded-lg text-sm">Eliminar</button></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal reseñas */}
      {showReviewModal && selectedProduct && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"><div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center"><h2 className="text-xl font-bold">{selectedProduct.name}</h2><button onClick={() => setShowReviewModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div><div className="p-6"><div className="text-center mb-6"><StarRating rating={Math.round(averageRating)} readonly /><p className="text-gray-500 mt-1">{reviews.length} reseñas</p></div><div className="mb-6 p-4 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-3">Escribe una reseña</h3><StarRating rating={reviewRating} onRatingChange={setReviewRating} /><textarea rows={3} className="w-full mt-3 p-2 border rounded-lg" placeholder="Tu experiencia..." value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} /><button onClick={submitReview} className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded-lg">Enviar</button></div><div className="space-y-4">{reviews.map((r) => (<div key={r.id} className="border-b pb-3"><div className="flex justify-between"><span className="font-medium">{r.user.name}</span><span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span></div><StarRating rating={r.rating} readonly /><p className="text-gray-600 text-sm mt-1">{r.comment}</p>{r.isVerified && <span className="text-xs text-emerald-600">✓ Compra verificada</span>}</div>))}</div></div></div></div>)}
    </div>
  )
}
