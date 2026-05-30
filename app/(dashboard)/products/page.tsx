'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    images: []
  })
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchProducts = async () => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
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
    else fetchProducts()
  }, [])

  const addToCart = async (productId) => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      })

      if (res.ok) {
        alert('Producto agregado al carrito')
      } else {
        alert('Error al agregar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = getToken()
      const url = editing ? `http://localhost:3001/api/products/${editing.id}` : 'http://localhost:3001/api/products'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setShowModal(false)
        setEditing(null)
        setForm({ name: '', description: '', price: 0, stock: 0, category: '', images: [] })
        fetchProducts()
      } else {
        alert('Error al guardar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      const token = getToken()
      await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchProducts()
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const handleEdit = (product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      images: product.images || []
    })
    setShowModal(true)
  }

  if (loading) return <div className="p-8">Cargando productos...</div>

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Productos</h1>
            <p className="text-gray-500 mt-1">Gestiona tu tienda</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: 0, stock: 0, category: '', images: [] }); setShowModal(true) }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
            + Nuevo Producto
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-5xl">🛍️</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{p.description || 'Sin descripción'}</p>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-xl font-bold text-indigo-600">${p.price}</span>
                    <span className="text-gray-400 text-sm ml-1">ARS</span>
                  </div>
                  <div className={`text-sm ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stock: {p.stock}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => addToCart(p.id)} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700">
                    🛒 Agregar
                  </button>
                  <button onClick={() => handleEdit(p)} className="flex-1 bg-gray-100 py-2 rounded-lg text-sm hover:bg-gray-200">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-400">No hay productos. ¡Crea tu primer producto!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nombre" className="w-full p-2 border rounded-lg" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <textarea placeholder="Descripción" className="w-full p-2 border rounded-lg" rows="3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              <input type="number" step="0.01" placeholder="Precio" className="w-full p-2 border rounded-lg" value={form.price} onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})} required />
              <input type="number" placeholder="Stock" className="w-full p-2 border rounded-lg" value={form.stock} onChange={(e) => setForm({...form, stock: parseInt(e.target.value)})} required />
              <input type="text" placeholder="Categoría" className="w-full p-2 border rounded-lg" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold">Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
