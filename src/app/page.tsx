export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🚀 SaaS Multi-Tenant
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Plataforma funcionando correctamente
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#999' }}>
          Desplegado en Vercel desde mi teléfono 📱
        </p>
      </div>
    </div>
  )
}
