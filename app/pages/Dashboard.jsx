import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Bienvenido, {user?.name}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Cerrar Sesión
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👤</div>
          <div>
            <div style={styles.cardValue}>{user?.name}</div>
            <div style={styles.cardLabel}>Usuario</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>📧</div>
          <div>
            <div style={styles.cardValue}>{user?.email}</div>
            <div style={styles.cardLabel}>Email</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIcon}>🏢</div>
          <div>
            <div style={styles.cardValue}>Demo SaaS</div>
            <div style={styles.cardLabel}>Empresa</div>
          </div>
        </div>
      </div>

      <div style={styles.infoCard}>
        <h3>✅ ¡Tu SaaS está funcionando!</h3>
        <p>El frontend está conectado con el backend.</p>
        <p>Puedes registrar usuarios y hacer login.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f3f4f6',
  },
  header: {
    background: 'white',
    padding: '20px 30px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#1f2937',
  },
  subtitle: {
    margin: '5px 0 0',
    color: '#6b7280',
  },
  logoutButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
  cardIcon: {
    fontSize: '40px',
  },
  cardValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  infoCard: {
    background: 'white',
    borderRadius: '12px',
    margin: '0 30px 30px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default Dashboard;
