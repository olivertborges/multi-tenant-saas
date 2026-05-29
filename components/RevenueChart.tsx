'use client'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Ene', ingresos: 4000, usuarios: 24 },
  { name: 'Feb', ingresos: 5200, usuarios: 32 },
  { name: 'Mar', ingresos: 4800, usuarios: 38 },
  { name: 'Abr', ingresos: 6100, usuarios: 45 },
  { name: 'May', ingresos: 5800, usuarios: 52 },
  { name: 'Jun', ingresos: 7200, usuarios: 58 },
  { name: 'Jul', ingresos: 8500, usuarios: 67 },
  { name: 'Ago', ingresos: 7900, usuarios: 74 },
  { name: 'Sep', ingresos: 9400, usuarios: 82 },
  { name: 'Oct', ingresos: 10200, usuarios: 91 },
  { name: 'Nov', ingresos: 11500, usuarios: 98 },
  { name: 'Dic', ingresos: 12800, usuarios: 112 },
]

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Ingresos Mensuales</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ingresos']}
            />
            <Area type="monotone" dataKey="ingresos" stroke="#6366f1" fill="url(#colorIngresos)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
