'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tenantSlug: '',
    tenantName: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.message || 'Error al registrarse')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Registrar Empresa</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            name="tenantSlug"
            placeholder="URL de tu empresa (ej: miempresa)"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            value={formData.tenantSlug}
            onChange={handleChange}
            required
          />
          <input
            name="tenantName"
            placeholder="Nombre de tu empresa"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            value={formData.tenantName}
            onChange={handleChange}
          />
          <input
            name="name"
            placeholder="Tu nombre completo"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Registrar Empresa'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes cuenta? <Link href="/login" className="text-indigo-500">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  )
}
