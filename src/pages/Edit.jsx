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
  }, [id])

  const handleImageUpload = (e, setter) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
      toast.error('Invalid format')
      return
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
      fd.append("name", name)
      fd.append("description", description)
      fd.append("price", price)
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
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data.success) {
        toast.success('Updated')
        navigate('/list')
      }
    } catch {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl px-4 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">
            Catalog
          </p>
          <h1 className="text-2xl font-black text-neutral-900">
            Edit Product
          </h1>
        </div>

        <button
          onClick={() => navigate('/list')}
          className="px-4 py-2 border border-neutral-300 rounded-xl text-[12px] font-semibold hover:bg-neutral-50 flex items-center gap-2"
        >
          <ChevronLeft size={14} />
          Back
        </button>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-8">

        {/* IMAGES */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <h3 className="text-[12px] font-bold mb-4">Images</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[image1, image2, image3, image4].map((img, i) => {
              const setter = [setImage1, setImage2, setImage3, setImage4][i]
              const src = img instanceof File ? URL.createObjectURL(img) : img

              return (
                <div key={i} className="relative border rounded-xl overflow-hidden">
                  {img ? (
                    <img src={src} className="w-full h-40 object-cover" />
                  ) : (
                    <label className="flex items-center justify-center h-40 cursor-pointer bg-neutral-100">
                      <Upload size={18} />
                      <input type="file" hidden onChange={(e)=>handleImageUpload(e,setter)} />
                    </label>
                  )}

                  {img && (
                    <button
                      type="button"
                      onClick={() => setter(false)}
                      className="absolute top-2 right-2 bg-white p-1 rounded"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4">

          <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Product name"
            className="w-full px-4 py-3 border rounded-xl"
          />

          <textarea
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            placeholder="Description"
            className="w-full px-4 py-3 border rounded-xl"
          />

          <input
            type="number"
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            placeholder="Price"
            className="w-full px-4 py-3 border rounded-xl"
          />

        </div>

        {/* CATEGORY */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 grid md:grid-cols-2 gap-4">

          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="px-4 py-3 border rounded-xl">
            <option>Men</option>
            <option>Women</option>
            <option>Kids</option>
          </select>

          <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className="px-4 py-3 border rounded-xl">
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>

        </div>

        {/* SIZES */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <h3 className="text-[12px] font-bold mb-4">Sizes</h3>

          <div className="flex gap-2 flex-wrap">
            {['S','M','L','XL','XXL'].map(size => (
              <button
                key={size}
                type="button"
                onClick={()=>handleSizeClick(size)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold border ${
                  sizes.includes(size)
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37]'
                    : 'border-neutral-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ACTION */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold flex justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
          Save Changes
        </button>

      </form>
    </div>
  )
}

export default Edit