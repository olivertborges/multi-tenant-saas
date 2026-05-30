'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Tag, Sparkles } from 'lucide-react'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: 0,
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validUntil: ''
  })
  const router = useRouter()
  const getToken = () => localStorage.getItem('token')

  const fetchCoupons = async () => {
    const token = getToken()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setCoupons(data)
    setLoading(false)
  }

  useEffect(() => {
    const token = getToken()
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (!token || user.role !== 'ADMIN') router.push('/login')
    else fetchCoupons()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = getToken()
    const url = editing ? `${process.env.NEXT_PUBLIC_API_URL}/coupons/${editing.id}` : `${process.env.NEXT_PUBLIC_API_URL}/coupons`
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setShowModal(false)
      setEditing(null)
      setForm({ code: '', description: '', discountType: 'PERCENTAGE', discountValue: 0, minPurchase: '', maxDiscount: '', usageLimit: '', validFrom: '', validUntil: '' })
      fetchCoupons()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cupón?')) return
    const token = getToken()
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchCoupons()
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div></div>

  return (
    <div>
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><div className="flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5" /><span className="text-sm font-medium">PROMOCIONES</span></div><h1 className="text-2xl md:text-3xl font-bold">Cupones de Descuento</h1><p className="text-white/80 mt-1">Crea y gestiona códigos promocionales</p></div>
          <button onClick={() => { setEditing(null); setForm({ code: '', description: '', discountType: 'PERCENTAGE', discountValue: 0, minPurchase: '', maxDiscount: '', usageLimit: '', validFrom: '', validUntil: '' }); setShowModal(true) }} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2"><Plus className="w-4 h-4" />Nuevo Cupón</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Código</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Descuento</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Usos</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Válido hasta</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Estado</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Acciones</th></tr></thead>
        <tbody className="divide-y divide-gray-100">{coupons.map((c: any) => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono font-bold text-emerald-600">{c.code}</td><td className="px-6 py-4">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `$${c.discountValue}`}</td><td className="px-6 py-4">{c.usedCount} / {c.usageLimit || '∞'}</td><td className="px-6 py-4">{new Date(c.validUntil).toLocaleDateString()}</td><td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.isActive ? 'Activo' : 'Inactivo'}</span></td><td className="px-6 py-4"><div className="flex gap-2"><button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit className="w-4 h-4 text-gray-500" /></button><button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button></div></td></tr>))}</tbody></table>
      </div>

      {showModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl p-6 max-w-md w-full"><h2 className="text-xl font-bold mb-4">{editing ? 'Editar Cupón' : 'Nuevo Cupón'}</h2><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="Código (ej: DESCUENTO10)" className="w-full p-2 border rounded-lg" value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} required /><textarea placeholder="Descripción" className="w-full p-2 border rounded-lg" rows={2} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} /><select className="w-full p-2 border rounded-lg" value={form.discountType} onChange={(e) => setForm({...form, discountType: e.target.value})}><option value="PERCENTAGE">Porcentaje (%)</option><option value="FIXED">Monto fijo ($)</option></select><input type="number" step="0.01" placeholder="Valor del descuento" className="w-full p-2 border rounded-lg" value={form.discountValue} onChange={(e) => setForm({...form, discountValue: parseFloat(e.target.value)})} required /><input type="number" step="0.01" placeholder="Compra mínima (opcional)" className="w-full p-2 border rounded-lg" value={form.minPurchase} onChange={(e) => setForm({...form, minPurchase: e.target.value ? parseFloat(e.target.value) : null})} /><input type="number" step="0.01" placeholder="Descuento máximo (opcional)" className="w-full p-2 border rounded-lg" value={form.maxDiscount} onChange={(e) => setForm({...form, maxDiscount: e.target.value ? parseFloat(e.target.value) : null})} /><input type="number" placeholder="Límite de usos (opcional)" className="w-full p-2 border rounded-lg" value={form.usageLimit} onChange={(e) => setForm({...form, usageLimit: e.target.value ? parseInt(e.target.value) : null})} /><div className="grid grid-cols-2 gap-3"><input type="date" placeholder="Válido desde" className="w-full p-2 border rounded-lg" value={form.validFrom} onChange={(e) => setForm({...form, validFrom: e.target.value})} required /><input type="date" placeholder="Válido hasta" className="w-full p-2 border rounded-lg" value={form.validUntil} onChange={(e) => setForm({...form, validUntil: e.target.value})} required /></div><div className="flex gap-3 pt-2"><button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-semibold">Guardar</button><button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold">Cancelar</button></div></form></div></div>)}
    </div>
  )
}
