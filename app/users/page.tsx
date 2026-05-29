'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: { name: string }
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    isActive: true,
  })
  const router = useRouter()

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('http://localhost:3001/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  const fetchRoles = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('http://localhost:3001/api/users/roles', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setRoles(data)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchUsers()
    fetchRoles()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const url = editingUser 
      ? `http://localhost:3001/api/users/${editingUser.id}`
      : 'http://localhost:3001/api/users'
    
    const res = await fetch(url, {
      method: editingUser ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setShowModal(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', roleId: '', isActive: true })
      fetchUsers()
    } else {
      const error = await res.json()
      alert(error.message || 'Error al guardar usuario')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    const token = localStorage.getItem('token')
    await fetch(`http://localhost:3001/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchUsers()
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      roleId: user.role?.name || '',
      isActive: user.isActive,
    })
    setShowModal(true)
  }

  if (loading) return <div style={styles.container}>Cargando...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Usuarios</h1>
          <p style={styles.subtitle}>Administra los usuarios de tu empresa</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setFormData({ name: '', email: '', password: '', roleId: '', isActive: true }); setShowModal(true) }}
          style={styles.addButton}
        >
          + Nuevo Usuario
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role?.name}</td>
                <td>
                  <span style={user.isActive ? styles.activeBadge : styles.inactiveBadge}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(user)} style={styles.editButton}>Editar</button>
                  <button onClick={() => handleDelete(user.id)} style={styles.deleteButton}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                style={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                style={styles.input}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {!editingUser && (
                <input
                  type="password"
                  placeholder="Contraseña"
                  style={styles.input}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              )}
              <select
                style={styles.input}
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                required
              >
                <option value="">Seleccionar rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Usuario activo
              </label>
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.saveButton}>Guardar</button>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelButton}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  addButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  tableContainer: {
    padding: '30px',
  },
  table: {
    width: '100%',
    background: 'white',
    borderRadius: '12px',
    borderCollapse: 'collapse' as const,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  activeBadge: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  inactiveBadge: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  editButton: {
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
  saveButton: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  cancelButton: {
    background: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
}
