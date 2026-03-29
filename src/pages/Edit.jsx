import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import {
  Save, Upload, X, ChevronLeft,
  Loader2, Image as ImageIcon
} from 'lucide-react'

const Edit = ({ token }) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}api/product/${id}`)
        if (res.data.success) {
          const p = res.data.product
          setName(p.name)
          setDescription(p.description)
          setPrice(p.price.toString())
          setCategory(p.category)
          setSubCategory(p.subCategory || "Topwear")
          setBestseller(p.isBestseller || false)
          setSizes(p.sizes || [])

          if (p.images) {
            if (p.images[0]) setImage1(p.images[0].imageUrl)
            if (p.images[1]) setImage2(p.images[1].imageUrl)
            if (p.images[2]) setImage3(p.images[2].imageUrl)
            if (p.images[3]) setImage4(p.images[3].imageUrl)
          }
        } else navigate('/list')
      } catch {
        toast.error('Failed to load product')
        navigate('/list')
      } finally {
        setInitializing(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload only JPG, PNG, or WebP images')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return;
    }

    setter(file)
  }

  const handleSizeClick = (size) => {
    setSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("name", name.trim())
      fd.append("description", description.trim())
      fd.append("price", parseFloat(price).toFixed(2))
      fd.append("category", category)
      fd.append("subCategory", subCategory)
      fd.append("bestseller", bestseller)
      fd.append("sizes", JSON.stringify(sizes))

      if (image1 instanceof File) fd.append("image1", image1)
      if (image2 instanceof File) fd.append("image2", image2)
      if (image3 instanceof File) fd.append("image3", image3)
      if (image4 instanceof File) fd.append("image4", image4)

      const res = await axios.put(
        `${backendUrl}api/product/${id}`,
        fd,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      )

      if (res.data.success) {
        toast.success(res.data.message || 'Product updated successfully')
        navigate('/list')
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Loading Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl px-4 sm:px-6 md:px-8 py-8 mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Catalog</p>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
              <ImageIcon className="text-white" size={22} />
            </div>
            Refine Product
          </h1>
        </div>

        <button
          onClick={() => navigate('/list')}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-[#D4AF37] transition-all text-[11px] font-black uppercase tracking-widest shadow-sm"
        >
          <ChevronLeft size={14} />
          Back to Inventory
        </button>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-8">

        {/* Images Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <div className="w-7 h-7 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
              <Upload size={16} className="text-[#D4AF37]" />
            </div>
            <p className="text-[11px] font-black tracking-[0.2em] text-slate-700 uppercase">Product Visuals</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[image1, image2, image3, image4].map((img, i) => {
              const setter = [setImage1, setImage2, setImage3, setImage4][i]
              const src = img instanceof File ? URL.createObjectURL(img) : img

              return (
                <div key={i} className="relative group">
                  <div className={`
                    relative aspect-[4/5] rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-500
                    ${img ? 'border-[#D4AF37]/20 bg-white' : 'border-slate-200 bg-slate-50 hover:border-[#D4AF37]/40 hover:bg-white'}
                  `}>
                    {img ? (
                      <div className="w-full h-full relative group/img">
                        <img src={src} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-[#D4AF37]/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                           <label className="cursor-pointer bg-white text-[#D4AF37] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                             Replace
                             <input type="file" hidden onChange={(e)=>handleImageUpload(e, setter)} accept="image/*" />
                           </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-full cursor-pointer group/label p-3 text-center">
                        <Upload size={22} className="text-slate-300 group-hover/label:text-[#D4AF37] transition-colors mb-1" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/label:text-[#D4AF37] transition-colors">
                          Slot {i + 1}
                        </span>
                        <input type="file" hidden onChange={(e)=>handleImageUpload(e,setter)} accept="image/*" />
                      </label>
                    )}
                  </div>

                  {img && (
                    <button
                      type="button"
                      onClick={() => setter(false)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all border-2 border-white z-10"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-4 italic">Replacing an existing slot will overwrite the current image data.</p>
        </div>

        {/* Grid Section: Info + Classification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6">
            <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-700 uppercase mb-2">Core Identification</h3>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Node</label>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="e.g. Urban Commuter Jacket"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Intelligence Summary</label>
              <textarea
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                placeholder="Describe the aesthetic and technical specs..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Market Value (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all"
              />
            </div>
          </div>

          {/* Classification + Matrix */}
          <div className="space-y-6">
            {/* Classification */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
              <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-700 uppercase mb-4">Classification</h3>
              <div className="grid grid-cols-2 gap-3">
                <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:outline-none cursor-pointer">
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                </select>
                <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:outline-none cursor-pointer">
                  <option>Topwear</option>
                  <option>Bottomwear</option>
                  <option>Winterwear</option>
                </select>
              </div>
            </div>

            {/* Matrix Config */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 sm:p-8">
              <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-700 uppercase mb-4">Matrix Config</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['S','M','L','XL','XXL'].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={()=>handleSizeClick(size)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-black border transition-all active:scale-95 ${
                      sizes.includes(size)
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-md'
                        : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3 cursor-pointer w-fit p-3 rounded-2xl border border-slate-100 hover:bg-[#D4AF37]/10 transition-all">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={bestseller}
                    onChange={() => setBestseller(!bestseller)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-all duration-300 ${bestseller ? 'bg-[#D4AF37]' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${bestseller ? 'left-7' : 'left-1'}`}></div>
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">Deploy as Bestseller</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 sm:py-5 bg-[#D4AF37] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
            Sync Protocol Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/list')}
            className="px-10 py-4 sm:py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all"
          >
            Abort
          </button>
        </div>

      </form>
    </div>
  )
}

export default Edit