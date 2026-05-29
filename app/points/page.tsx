'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PointsPage() {
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const fetchData = async () => {
    try {
      const token = getToken()
      const [pointsRes, historyRes] = await Promise.all([
        fetch('http://localhost:3001/api/points', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('http://localhost:3001/api/points/history', { headers: { 'Authorization': `Bearer ${token}` } })
      ])
      if (pointsRes.ok) setPoints((await pointsRes.json()).points)
      if (historyRes.ok) setHistory(await historyRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = getToken()
    if (!token) router.push('/login')
    else fetchData()
  }, [])

  if (loading) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-8">
          <div className="text-5xl mb-2">⭐</div>
          <div className="text-4xl font-bold">{points}</div>
          <div className="text-white/80 mt-1">Puntos acumulados</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Historial de Puntos</h2>
          {history.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin movimiento de puntos</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="font-medium">{h.reason}</p>
                    <p className="text-sm text-gray-400">{new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`font-bold ${h.points > 0 ? 'text-green-600' : 'text-red-600'}`}>{h.points > 0 ? `+${h.points}` : h.points}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
