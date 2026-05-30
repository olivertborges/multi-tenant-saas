'use client'
import { useEffect, useState } from 'react'
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
  ChevronLeft
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-indigo-500 to-purple-500' },
    { href: '/products', icon: Package, label: 'Productos', color: 'from-emerald-500 to-teal-500' },
    { href: '/cart', icon: ShoppingCart, label: 'Carrito', color: 'from-blue-500 to-cyan-500' },
    { href: '/agendas', icon: Calendar, label: 'Reservas', color: 'from-orange-500 to-red-500' },
    { href: '/purchases', icon: FileText, label: 'Mis Compras', color: 'from-green-500 to-emerald-500' },
    { href: '/points', icon: Star, label: 'Mis Puntos', color: 'from-yellow-500 to-amber-500' },
    { href: '/services', icon: Sparkles, label: 'Servicios', color: 'from-purple-500 to-pink-500' },
    { href: '/users', icon: Users, label: 'Usuarios', color: 'from-cyan-500 to-blue-500' },
    { href: '/reports', icon: TrendingUp, label: 'Reportes', color: 'from-rose-500 to-pink-500' },
  ]

  if (user.role === 'ADMIN') {
    menuItems.push({ href: '/admin', icon: Crown, label: 'Admin', color: 'from-red-500 to-rose-500' })
  }
  menuItems.push({ href: '/profile', icon: UserCircle, label: 'Mi Perfil', color: 'from-gray-500 to-gray-600' })

  return (
    <div className="relative min-h-screen">
      {/* Fondo animado */}
      <div className="animated-bg"></div>
      
      {/* Partículas decorativas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between animate-slide-left">
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SaaS Enterprise</h1>
        <div className="w-8"></div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50
        transition-all duration-500 ease-out
        lg:translate-x-0 lg:static lg:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between animate-fade-scale">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold animate-pulse-glow">S</div>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">SaaS Enterprise</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-[1.02]` 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-800 hover:scale-[1.02]'
                    }
                  `}
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse-glow' : ''}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-white/50 rounded-full animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 animate-fade-up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold animate-pulse-glow">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl text-sm transition-all duration-300 hover:scale-[1.02]"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72">
        <div className="pt-14 lg:pt-0">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
