'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgendasPage() {
  const [agendas, setAgendas] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchAgendas = async () => {
    const token = getToken()
    const res = await fetch('http://localhost:3001/api/agendas', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setAgendas(data)
    setLoading(false)
  }

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push('/login')
    } else {
      fetchAgendas()
    }
  }, [])

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Mis Reservas</h1>
      <p className="text-gray-500 mt-1">Gestiona tus citas y servicios</p>
      
      {agendas.length === 0 ? (
        <p className="text-gray-400 mt-6">No hay reservas</p>
      ) : (
        <div className="mt-6 space-y-4">
          {agendas.map((a: any) => (
            <div key={a.id} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Servicio:</strong> {a.service?.name}</p>
              <p><strong>Fecha:</strong> {new Date(a.date).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> {a.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}