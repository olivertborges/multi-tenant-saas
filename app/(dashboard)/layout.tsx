'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calendar, 
  Users, 
  LogOut,
  Sparkles,
  TrendingUp,
  Star,
  FileText,
  Crown,
  UserCircle,
  Menu,
  X,
  Heart
} from 'lucide-react'
import AIAssistant from '@/components/ai/AIAssistant'
import PushNotifier from '@/components/notifications/PushNotifier'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData || '{}'))
    }
  }, [router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return <div className="flex justify-center items-center h-screen">Cargando...</div>

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-emerald-600' },
    { href: '/products', icon: Package, label: 'Productos', color: 'text-rose-500' },
    { href: '/cart', icon: ShoppingCart, label: 'Carrito', color: 'text-amber-500' },
    { href: '/wishlist', icon: Heart, label: 'Mi Lista', color: 'text-rose-500' },
    { href: '/agendas', icon: Calendar, label: 'Reservas', color: 'text-sky-500' },
    { href: '/purchases', icon: FileText, label: 'Mis Compras', color: 'text-emerald-600' },
    { href: '/points', icon: Star, label: 'Mis Puntos', color: 'text-amber-500' },
    { href: '/services', icon: Sparkles, label: 'Servicios', color: 'text-rose-500' },
    { href: '/users', icon: Users, label: 'Usuarios', color: 'text-sky-500' },
    { href: '/reports', icon: TrendingUp, label: 'Reportes', color: 'text-emerald-600' },
    { href: '/plans', icon: Crown, label: 'Planes', color: 'text-amber-500' },
  ]

  if (user.role === 'ADMIN') {
    menuItems.push({ href: '/admin', icon: Crown, label: 'Admin', color: 'text-rose-500' })
  }
  menuItems.push({ href: '/profile', icon: UserCircle, label: 'Mi Perfil', color: 'text-sky-500' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-emerald-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SaaS Enterprise</h1>
        <div className="w-10"></div>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">S</div>
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">SaaS Enterprise</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? `bg-white/50 ${item.color} font-medium shadow-sm` 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/30'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">{user.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-sm transition-all">
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="pt-16 lg:pt-0">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </div>
      </main>

      <PushNotifier />
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  )
}
