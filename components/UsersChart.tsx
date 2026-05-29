'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Ene', usuarios: 24 },
  { name: 'Feb', usuarios: 32 },
  { name: 'Mar', usuarios: 38 },
  { name: 'Abr', usuarios: 45 },
  { name: 'May', usuarios: 52 },
  { name: 'Jun', usuarios: 58 },
  { name: 'Jul', usuarios: 67 },
  { name: 'Ago', usuarios: 74 },
  { name: 'Sep', usuarios: 82 },
  { name: 'Oct', usuarios: 91 },
  { name: 'Nov', usuarios: 98 },
  { name: 'Dic', usuarios: 112 },
]

export default function UsersChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">👥 Crecimiento de Usuarios</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`${value} usuarios`, 'Total']}
            />
            <Bar dataKey="usuarios" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
