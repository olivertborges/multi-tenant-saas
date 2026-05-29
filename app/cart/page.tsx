'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkout, setCheckout] = useState(false)
  const [pointsToUse, setPointsToUse] = useState(0)
  const [userPoints, setUserPoints] = useState(0)
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchCart = async () => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setCart(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPoints = async () => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/points', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUserPoints(data.points)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) router.push('/login')
    else {
      fetchCart()
      fetchPoints()
    }
  }, [])

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    const token = getToken()
    await fetch(`http://localhost:3001/api/cart/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    })
    fetchCart()
  }

  const removeItem = async (itemId) => {
    const token = getToken()
    await fetch(`http://localhost:3001/api/cart/item/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchCart()
  }

  const handleCheckout = async () => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pointsUsed: pointsToUse })
      })

      if (res.ok) {
        router.push('/purchases')
      } else {
        alert('Error al procesar la compra')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  if (loading) return <div className="p-8">Cargando...</div>

  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0
  const discount = Math.min(pointsToUse, userPoints, subtotal)
  const total = subtotal - discount

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mi Carrito</h1>

        {cart?.items?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-400">Tu carrito está vacío</p>
            <button onClick={() => router.push('/products')} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg">Ver productos</button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart?.items?.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-lg flex gap-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">🛍️</div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p className="text-gray-500 text-sm">${item.product.price} ARS</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-100 rounded-full">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-100 rounded-full">+</button>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm ml-4">Eliminar</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg h-fit">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>
              <div className="space-y-2">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
                {pointsToUse > 0 && <div className="flex justify-between text-green-600"><span>Descuento puntos</span><span>-${discount}</span></div>}
                <div className="border-t pt-2 mt-2"><div className="flex justify-between font-bold"><span>Total</span><span>${total}</span></div></div>
              </div>

              {userPoints > 0 && (
                <div className="mt-4">
                  <label className="text-sm text-gray-600">Tienes {userPoints} puntos (${userPoints} de descuento)</label>
                  <input type="number" className="w-full p-2 border rounded-lg mt-1" placeholder="Puntos a usar" max={userPoints} value={pointsToUse} onChange={(e) => setPointsToUse(parseInt(e.target.value) || 0)} />
                </div>
              )}

              <button onClick={handleCheckout} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-indigo-700">
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
