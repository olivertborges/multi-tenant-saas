'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      router.push('/login')
    } else {
      const parsed = JSON.parse(userData || '{}')
      setUser(parsed)
      setName(parsed.name || '')
      setEmail(parsed.email || '')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, password: password || undefined })
      })

      const data = await res.json()
      if (res.ok) {
        const updatedUser = { ...user, name: data.name, email: data.email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setMessage('Perfil actualizado correctamente')
        setPassword('')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(data.message || 'Error al actualizar')
      }
    } catch (error) {
      setMessage('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mi Perfil</h1>
          <p className="text-gray-500 mt-1">Actualiza tu información personal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {message && (
            <div className={`p-3 rounded-lg mb-4 text-center ${message.includes('correctamente') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña (opcional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar en blanco para no cambiar"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              <p><strong>Empresa:</strong> {user.tenantName || user.tenantSlug}</p>
              <p><strong>Rol:</strong> {user.role}</p>
              <p><strong>ID de usuario:</strong> {user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
