import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { 
  Pencil, 
  Trash2, 
  Search, 
  Plus, 
  Filter,
  Package
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
    const intervalId = setInterval(fetchList, 30000)
    return () => clearInterval(intervalId)
  }, [])

  const removeProduct = async (id) => {
    if (!window.confirm('Remove this product? This action cannot be undone.')) return;
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

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Catalog</p>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
              style={{ background: 'rgba(212,175,55,0.1)' }}
            >
              <Package size={18} style={{ color: '#D4AF37' }} />
            </div>
            Products
          </h1>
        </div>

        <Link
          to="/add"
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg"
          style={{ background: '#D4AF37', boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
        >
          <Plus size={15} />
          New Product
        </Link>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-neutral-300 pl-10 pr-4 py-2.5 rounded-xl text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-white border border-neutral-300 pl-4 pr-10 py-2.5 rounded-xl text-[13px] font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all cursor-pointer min-w-[160px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={13} />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest hidden md:table-cell">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-neutral-600 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {/* Loading */}
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-xl border-2 border-[#D4AF37]/20"></div>
                        <div className="absolute inset-0 rounded-xl border-t-2 border-[#D4AF37] animate-spin"></div>
                      </div>
                      <span className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">Loading Products...</span>
                    </div>
                  </td>
                </tr>

              /* Empty */
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                        <Package size={24} className="text-neutral-400" />
                      </div>
                      <p className="text-[13px] font-black text-neutral-700">No products found</p>
                      <p className="text-[11px] text-neutral-500">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>

              /* Rows */
              ) : (
                filteredList.map((item) => (
                  <tr key={item.id} className="group hover:bg-neutral-50 transition-colors">

                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          <img
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            src={item.images?.[0]?.imageUrl || '/placeholder-image.jpg'}
                            alt={item.name}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-black text-neutral-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-neutral-500 font-semibold mt-0.5 uppercase tracking-wider hidden md:block">
                            SKU: {item.id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-[10px] font-black uppercase tracking-widest border border-neutral-200">
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="text-[13px] font-black text-neutral-900">
                        {currency}{Number(item.price).toFixed(2)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {item.isBestseller ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/30"
                          style={{ background: 'rgba(212,175,55,0.08)', color: '#B8963E' }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                          Bestseller
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-500 border border-neutral-200">
                          <div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div>
                          Standard
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/edit/${item.id}`}
                          className="w-9 h-9 rounded-lg flex items-center justify-center bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => removeProduct(item.id)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Footer ── */}
        {!loading && filteredList.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
            <p className="text-[11px] font-semibold text-neutral-600 uppercase tracking-widest">
              Showing {filteredList.length} of {list.length} products
            </p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Live</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default List;