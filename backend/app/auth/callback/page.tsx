'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [token, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CallbackContent />
    </Suspense>
  )
}
