// app/(dashboard)/agendas/page.tsx
'use client'
import React from 'react'
// o
import { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, User, Scissors, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react'

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
      if (userData) setUser(JSON.parse(userData))
      fetchAgendas()
      fetchServices()
      setLoading(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mis Reservas</h1>
            <p className="text-gray-500 mt-1">Gestiona tus citas y servicios</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
            + Nueva Reserva
          </button>
        </div>

        <div className="space-y-4">
          {agendas.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">📅</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{a.service?.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2"><User className="w-3 h-3" />{a.user?.name}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(a.status)}`}>
                  {getStatusText(a.status)}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar className="w-4 h-4 text-indigo-500" />{new Date(a.date).toLocaleDateString()}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4 text-indigo-500" />{a.time}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Scissors className="w-4 h-4 text-indigo-500" />${a.service?.price}</div>
              </div>
              {a.status === 'PENDING' && (
                <div className="flex gap-2 mt-3 pt-2">
                  <button onClick={() => updateStatus(a.id, 'CONFIRMED')} className="text-green-600 text-sm hover:text-green-700">Confirmar</button>
                  <button onClick={() => updateStatus(a.id, 'CANCELLED')} className="text-red-500 text-sm hover:text-red-600">Cancelar</button>
                </div>
              )}
              {a.status === 'CONFIRMED' && (
                <button onClick={() => updateStatus(a.id, 'COMPLETED')} className="text-blue-600 text-sm mt-2">Marcar como completada</button>
              )}
            </div>
          ))}
        </div>

        {agendas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No hay reservas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nueva Reserva</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select className="w-full p-2 border border-gray-200 rounded-lg" value={form.serviceId} onChange={(e) => setForm({...form, serviceId: e.target.value})} required>
                <option value="">Seleccionar servicio</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
              </select>
              <input type="date" className="w-full p-2 border border-gray-200 rounded-lg" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required />
              <input type="time" className="w-full p-2 border border-gray-200 rounded-lg" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} required />
              <textarea placeholder="Notas (opcional)" className="w-full p-2 border border-gray-200 rounded-lg" rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold">Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}