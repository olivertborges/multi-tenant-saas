'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, Tag, CreditCard, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountMessage, setDiscountMessage] = useState('')
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchCart = async () => {
    try {
      const token = getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
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

  useEffect(() => {
    const token = getToken()
    if (!token) router.push('/login')
    else fetchCart()
  }, [])

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    const token = getToken()
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    })
    fetchCart()
  }

  const removeItem = async (itemId: string) => {
    const token = getToken()
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/item/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchCart()
  }

  const applyCoupon = async () => {
    if (!couponCode) return
    const token = getToken()
    const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) || 0
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate?code=${couponCode}&amount=${subtotal}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const data = await res.json()
    if (data.valid) {
      setDiscount(data.discount)
      setDiscountMessage(`¡Cupón aplicado! Descuento: $${data.discount}`)
      setTimeout(() => setDiscountMessage(''), 3000)
    } else {
      alert(data.message || 'Cupón inválido')
    }
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>

  const subtotal = cart?.items?.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0) || 0
  const total = subtotal - discount

  if (cart?.items?.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400">Tu carrito está vacío</p>
        <button onClick={() => router.push('/products')} className="mt-4 btn-primary">Explorar productos</button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-800">Mi Carrito</h1><p className="text-gray-500 text-sm mt-1">Revisa tus productos antes de comprar</p></div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart?.items?.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🛍️</div>
                <div className="flex-1"><h3 className="font-semibold">{item.product.name}</h3><p className="text-emerald-600 font-bold">${item.product.price}</p>
                  <div className="flex items-center gap-2 mt-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-100 rounded-full"><Minus className="w-3 h-3" /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 bg-gray-100 rounded-full"><Plus className="w-3 h-3" /></button></div>
                </div>
                <div className="text-right"><p className="font-bold">${item.product.price * item.quantity}</p><button onClick={() => removeItem(item.id)} className="text-red-500 text-sm mt-2"><Trash2 className="w-3 h-3" /></button></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold mb-4">Resumen</h2>
          <div className="space-y-2 pb-4 border-b"><div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>{discount > 0 && <div className="flex justify-between text-emerald-600"><span>Descuento</span><span>-${discount}</span></div>}</div>
          <div className="flex justify-between py-4 font-bold"><span>Total</span><span className="text-emerald-600">${total}</span></div>
          <div className="mt-4"><div className="flex gap-2 mb-4"><input type="text" placeholder="Código de cupón" className="flex-1 p-2 border rounded-lg" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} /><button onClick={applyCoupon} className="px-4 py-2 bg-gray-100 rounded-lg"><Tag className="w-4 h-4" /></button></div>{discountMessage && <div className="text-emerald-600 text-sm mb-4">{discountMessage}</div>}</div>
          <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"><CreditCard className="w-4 h-4" />Proceder al pago<ArrowRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  )
}
