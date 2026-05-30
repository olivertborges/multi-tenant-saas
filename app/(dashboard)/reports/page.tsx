'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const router = useRouter()

  const getToken = () => localStorage.getItem('token')

  const downloadPDF = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona un rango de fechas')
      return
    }
    const token = getToken()
    window.open(`http://localhost:3001/api/reports/sales/pdf?start=${startDate}&end=${endDate}&token=${token}`, '_blank')
  }

  const downloadExcel = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona un rango de fechas')
      return
    }
    const token = getToken()
    window.open(`http://localhost:3001/api/reports/sales/excel?start=${startDate}&end=${endDate}&token=${token}`, '_blank')
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Reportes de Ventas</h1>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
              <input type="date" className="w-full p-2 border rounded-lg" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
              <input type="date" className="w-full p-2 border rounded-lg" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={downloadPDF} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">📄 Descargar PDF</button>
              <button onClick={downloadExcel} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">📊 Descargar Excel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
