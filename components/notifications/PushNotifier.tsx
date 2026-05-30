'use client'
import { useEffect, useState } from 'react'
import { Bell, BellOff, X } from 'lucide-react'

export default function PushNotifier() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Solo mostrar si está en el navegador y no en servidor
    if (typeof window === 'undefined') return
    if ('Notification' in window) {
      setPermission(Notification.permission)
      // Mostrar banner después de 3 segundos si no está denegado y no se ha descartado
      if (Notification.permission === 'default' && !dismissed) {
        const timer = setTimeout(() => setShowBanner(true), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [dismissed])

  const requestPermission = async () => {
    if (typeof window === 'undefined') return
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShowBanner(false)
      if (result === 'granted') {
        new Notification('¡Notificaciones activadas! 🎉', {
          body: 'Recibirás alertas de tus pedidos y promociones',
          icon: '/favicon.ico'
        })
      }
    }
  }

  const dismissBanner = () => {
    setShowBanner(false)
    setDismissed(true)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-up">
      <div className="bg-white rounded-2xl shadow-2xl p-4 w-80 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm">Recibe notificaciones</h4>
            <p className="text-xs text-gray-500 mt-0.5">Te avisaremos sobre tus pedidos</p>
            <div className="flex gap-2 mt-2">
              <button onClick={requestPermission} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition">
                Activar
              </button>
              <button onClick={dismissBanner} className="text-xs text-gray-500 hover:text-gray-700 transition">
                Ahora no
              </button>
            </div>
          </div>
          <button onClick={dismissBanner} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
