'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgendasPage() {
  const [agendas, setAgendas] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ serviceId: '', date: '', time: '', notes: '' })
  const [user, setUser] = useState(null)
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchAgendas = async () => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/agendas', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAgendas(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  useEffect(() => {
    const token = getToken()
    const userData = localStorage.getItem('user')
    if (!token) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
      fetchAgendas()
      fetchServices()
      setLoading(false)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/agendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        setShowModal(false)
        setForm({ serviceId: '', date: '', time: '', notes: '' })
        fetchAgendas()
      } else {
        alert('Error al crear reserva')
      }
    } catch (error) {
      alert('Error de conexión')
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const token = getToken()
      await fetch(`http://localhost:3001/api/agendas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      fetchAgendas()
    } catch (error) {
      alert('Error al actualizar')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Pendiente',
      CONFIRMED: 'Confirmada',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada'
    }
    return texts[status] || status
  }

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Agendas</h1>
            <p className="text-gray-500 mt-1">Gestiona las reservas de servicios</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
            + Nueva Reserva
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agendas.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{a.user?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{a.service?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{a.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(a.status)}`}>
                      {getStatusText(a.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {a.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateStatus(a.id, 'CONFIRMED')} className="text-green-600 hover:text-green-800">Confirmar</button>
                        <button onClick={() => updateStatus(a.id, 'CANCELLED')} className="text-red-600 hover:text-red-800">Cancelar</button>
                      </>
                    )}
                    {a.status === 'CONFIRMED' && (
                      <button onClick={() => updateStatus(a.id, 'COMPLETED')} className="text-blue-600 hover:text-blue-800">Completar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {agendas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl mt-4">
            <p className="text-gray-400">No hay reservas. ¡Crea tu primera reserva!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full p-2 border rounded-lg" value={form.serviceId} onChange={(e) => setForm({...form, serviceId: e.target.value})} required>
                <option value="">Seleccionar servicio</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
              </select>
              <input type="date" className="w-full p-2 border rounded-lg" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
              <input type="time" className="w-full p-2 border rounded-lg" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} required />
              <textarea placeholder="Notas (opcional)" className="w-full p-2 border rounded-lg" rows="2" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
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
