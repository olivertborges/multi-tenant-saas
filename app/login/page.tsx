'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantSlug, setTenantSlug] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, tenantSlug }),
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        setError(data.message || 'Error al iniciar sesión')
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
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">Iniciar Sesión</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Empresa (ej: miempresa)"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Ingresar'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          ¿No tienes cuenta? <Link href="/register" className="text-indigo-500">Regístrate</Link>
        </p>
        <p className="text-center text-gray-400 text-xs mt-3">
          Demo: empresa "miempresa" | admin@miempresa.com | 123456
        </p>
      </div>
    </div>
  )
}
