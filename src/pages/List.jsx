import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Search, 
  Plus, 
  Filter,
  MoreVertical,
  Loader2,
  Package,
  ArrowUpDown
} from 'lucide-react'

const List = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + 'api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
    const intervalId = setInterval(fetchList, 30000) // Refresh every 30s
    return () => clearInterval(intervalId)
  }, [])

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${backendUrl}api/product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(list.map(item => item.category))];

  return (
    <div className="max-w-7xl px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Inventory</h1>
          <p className="text-[13px] text-slate-400 font-medium">Product catalog and stock management</p>
        </div>
        </div>
        
        <Link 
          to="/add"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all text-[13px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={18} />
          New Product
        </Link>
      </div>

      {/* Utilities */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl text-[13px] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-3.5 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all cursor-pointer shadow-sm min-w-[160px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            <Filter size={14} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:table-cell">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-neutral-300" size={24} />
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Syncing Feed...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Package size={48} />
                      <span className="text-[13px] font-medium text-black">No items found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="group hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 shrink-0">
                          <img 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            src={item.images?.[0]?.imageUrl || '/placeholder-image.jpg'} 
                            alt={item.name} 
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-black truncate leading-none">{item.name}</p>
                          <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider hidden md:block">SKU: {item.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13px] font-bold text-black">{currency}{Number(item.price).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell">
                      {item.isBestseller ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-black uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/edit/${item.id}`} 
                          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button 
                          onClick={() => removeProduct(item.id)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-neutral-100 text-neutral-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        {!loading && filteredList.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-50 bg-neutral-50/20 flex justify-between items-center">
            <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-widest">
              Showing {filteredList.length} of {list.length} units
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default List;
