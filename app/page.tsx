export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#333' }}>
          🚀 SaaS Multi-Tenant
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Plataforma funcionando correctamente
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#999' }}>
          Desplegado en Vercel desde mi teléfono 📱
        </p>
        <p style={{ fontSize: '0.8rem', color: '#bbb', marginTop: '1rem' }}>
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}
