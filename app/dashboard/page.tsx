'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

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

  if (!user) return <div>Cargando...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>
            {user.tenantName || user.tenantSlug} | Bienvenido, {user.name}
          </p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>
      
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🏢</div>
          <div>
            <div style={styles.cardValue}>{user.tenantName || user.tenantSlug}</div>
            <div style={styles.cardLabel}>Empresa</div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👤</div>
          <div>
            <div style={styles.cardValue}>{user.name}</div>
            <div style={styles.cardLabel}>Usuario</div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📧</div>
          <div>
            <div style={styles.cardValue}>{user.email}</div>
            <div style={styles.cardLabel}>Email</div>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👑</div>
          <div>
            <div style={styles.cardValue}>{user.role}</div>
            <div style={styles.cardLabel}>Rol</div>
          </div>
        </div>
      </div>

      <div style={styles.infoCard}>
        <h3>✅ Sistema Multi-Tenant Funcionando</h3>
        <p>Cada empresa tiene sus propios usuarios y datos aislados.</p>
        <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
          Tenant ID: {user.tenantId}
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f3f4f6' },
  header: {
    background: 'white',
    padding: '20px 30px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { margin: 0, fontSize: '24px', color: '#1f2937' },
  subtitle: { margin: '5px 0 0', color: '#6b7280' },
  logoutButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '30px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardIcon: { fontSize: '40px' },
  cardValue: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937' },
  cardLabel: { fontSize: '14px', color: '#6b7280' },
  infoCard: {
    background: 'white',
    borderRadius: '12px',
    margin: '0 30px 30px',
    padding: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
}
