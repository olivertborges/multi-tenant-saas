'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', duration: 60, price: 0, category: '' })
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')
  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}')

  const fetchServices = async () => {
    try {
      const token = getToken()
      const user = getUser()
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/services', {
        headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': user.tenantId }
      })
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!getToken()) router.push('/login')
    else fetchServices()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = getToken()
      const user = getUser()
      const url = editing ? `${process.env.NEXT_PUBLIC_API_URL}/api/services/${editing.id}` : '${process.env.NEXT_PUBLIC_API_URL}/api/services'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-tenant-id': user.tenantId
        },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setShowModal(false)
        setEditing(null)
        setForm({ name: '', description: '', duration: 60, price: 0, category: '' })
        fetchServices()
      } else {
        const error = await res.json()
        alert(error.message || 'Error al guardar')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este servicio?')) return
    try {
      const token = getToken()
      const user = getUser()
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': user.tenantId }
      })
      fetchServices()
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  if (loading) return <div className="p-8">Cargando servicios...</div>

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Servicios</h1>
            <p className="text-gray-500 mt-1">Gestiona los servicios que ofreces a tus clientes</p>
          </div>
          <button onClick={() => { setEditing(null); setForm({ name: '', description: '', duration: 60, price: 0, category: '' }); setShowModal(true) }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition">
            + Nuevo Servicio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-5xl">✂️</span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold">{s.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{s.description || 'Sin descripción'}</p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">${s.price}</span>
                    <span className="text-gray-400 ml-1">ARS</span>
                  </div>
                  <div className="text-gray-400 text-sm">⏱️ {s.duration} min</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description || '', duration: s.duration, price: s.price, category: s.category || '' }); setShowModal(true) }}
                    className="flex-1 bg-gray-100 py-2 rounded-lg hover:bg-gray-200">Editar</button>
                  <button onClick={() => handleDelete(s.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-400">No hay servicios. ¡Crea tu primer servicio!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Editar Servicio' : 'Nuevo Servicio'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nombre del servicio" className="w-full p-2 border rounded-lg" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              <textarea placeholder="Descripción" className="w-full p-2 border rounded-lg" rows="3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              <input type="number" placeholder="Duración (minutos)" className="w-full p-2 border rounded-lg" value={form.duration} onChange={(e) => setForm({...form, duration: parseInt(e.target.value)})} required />
              <input type="number" step="0.01" placeholder="Precio" className="w-full p-2 border rounded-lg" value={form.price} onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})} required />
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
