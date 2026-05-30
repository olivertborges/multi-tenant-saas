'use client'
import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'

interface ProductSearchProps {
  onSearch: (filters: any) => void
}

export default function ProductSearch({ onSearch }: ProductSearchProps) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', category: '', sortBy: 'newest' })

  const handleSearch = () => {
    onSearch({ query, ...filters })
  }

  const clearFilters = () => {
    setFilters({ minPrice: '', maxPrice: '', category: '', sortBy: 'newest' })
    setQuery('')
    onSearch({ query: '', minPrice: '', maxPrice: '', category: '', sortBy: 'newest' })
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Buscar productos..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} /></div>
        <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2"><Filter className="w-4 h-4" />Filtros</button>
        {(query || filters.minPrice || filters.maxPrice || filters.category) && <button onClick={clearFilters} className="px-4 py-2 bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>}
      </div>
      {showFilters && (<div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4"><input type="number" placeholder="Precio min" className="p-2 border rounded-lg" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} /><input type="number" placeholder="Precio max" className="p-2 border rounded-lg" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} /><input type="text" placeholder="Categoría" className="p-2 border rounded-lg" value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} /><select className="p-2 border rounded-lg" value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})}><option value="newest">Más nuevos</option><option value="price_asc">Precio menor</option><option value="price_desc">Precio mayor</option><option value="popular">Más populares</option></select><button onClick={handleSearch} className="col-span-full bg-emerald-600 text-white py-2 rounded-lg">Aplicar filtros</button></div>)}
    </div>
  )
}
