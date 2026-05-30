'use client'
import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'

export default function PushNotifier() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      if (result === 'granted') {
        new Notification('¡Notificaciones activadas!', {
          body: 'Recibirás alertas de tus pedidos y promociones',
          icon: '/logo.png'
        })
      }
    }
  }

  const showNotification = (title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' })
    }
  }

  return { requestPermission, showNotification, permission }
}
