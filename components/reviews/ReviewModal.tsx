'use client'
import { useState } from 'react'
import { X, Star } from 'lucide-react'
import StarRating from './StarRating'

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({ isOpen, onClose, productId, productName, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getToken = () => localStorage.getItem('token')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Selecciona una calificación')
      return
    }
    setLoading(true)
    setError('')

    try {
      const token = getToken()
      const res = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating, comment })
      })

      if (res.ok) {
        setRating(0)
        setComment('')
        onReviewSubmitted()
        onClose()
      } else {
        const data = await res.json()
        setError(data.message || 'Error al enviar reseña')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Calificar producto</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-gray-600 mb-4">{productName}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tu calificación</label>
            <StarRating rating={rating} onRatingChange={setRating} size={28} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tu reseña (opcional)</label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Cuéntanos tu experiencia con este producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </form>
      </div>
    </div>
  )
}
