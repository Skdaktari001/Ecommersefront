import React, { useState } from 'react'
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';
import { 
  Plus, 
  Upload, 
  X, 
  ChevronLeft, 
  Check, 
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Type,
  Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Add = ({ token }) => {
  const navigate = useNavigate();
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('Men');
    setSubCategory('Topwear');
    setBestseller(false);
    setSizes([]);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || name.trim().length < 2) {
      toast.error('Product name must be at least 2 characters');
      setLoading(false);
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      toast.error('Product description must be at least 10 characters');
      setLoading(false);
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      toast.error('Please enter a valid price');
      setLoading(false);
      return;
    }
    if (sizes.length === 0) {
      toast.error('Please select at least one size');
      setLoading(false);
      return;
    }
    if (!image1) {
      toast.error('Please upload at least one product image');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", parseFloat(price).toFixed(2));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}api/product/add`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Product added successfully!');
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleSizeClick = (size) => {
    setSizes(prev =>
      prev.includes(size) ? prev.filter(item => item !== size) : [...prev, size]
    );
  }

  const handleImageUpload = (e, setImageFunction) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only JPG, PNG, or WebP images');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImageFunction(file);
    }
  }

  return (
    <div className="max-w-4xl px-4 py-8">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Catalog</p>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
              style={{ background: 'rgba(212,175,55,0.1)' }}
            >
              <Plus size={18} style={{ color: '#D4AF37' }} />
            </div>
            Add New Product
          </h1>
        </div>
        <button
          onClick={() => navigate('/list')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all text-[11px] font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={14} />
          Back to Products
        </button>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-6">

        {/* ── Section 1: Images ── */}
        <Section icon={<ImageIcon size={16} style={{ color: '#D4AF37' }} />} label="Product Images">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => {
              const imageState = num === 1 ? image1 : num === 2 ? image2 : num === 3 ? image3 : image4;
              const setFn = num === 1 ? setImage1 : num === 2 ? setImage2 : num === 3 ? setImage3 : setImage4;

              return (
                <div key={num} className="relative group">
                  <label
                    htmlFor={`image${num}`}
                    className={`
                      relative aspect-[4/5] rounded-xl border-2 border-dashed flex flex-col items-center 
                      justify-center overflow-hidden cursor-pointer transition-all duration-300
                      ${imageState
                        ? 'border-[#D4AF37]/50 bg-white'
                        : 'border-neutral-300 bg-neutral-100 hover:border-[#D4AF37]/60 hover:bg-white'}
                    `}
                  >
                    {imageState ? (
                      <img
                        src={URL.createObjectURL(imageState)}
                        alt={`Preview ${num}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <Upload size={20} className="text-neutral-400 group-hover:text-[#D4AF37] transition-colors duration-300" />
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
                          {num === 1 ? 'Primary' : `Image ${num}`}
                        </span>
                      </div>
                    )}
                    <input
                      onChange={(e) => handleImageUpload(e, setFn)}
                      type="file"
                      id={`image${num}`}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>

                  {imageState && (
                    <button
                      type="button"
                      onClick={() => setFn(false)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-red-600 transition-all z-10 border-2 border-white"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-neutral-500 font-medium mt-4">JPG, PNG or WebP · Recommended 4:5 ratio · Max 5MB each</p>
        </Section>

        {/* ── Section 2: Product Info ── */}
        <Section icon={<Type size={16} style={{ color: '#D4AF37' }} />} label="Product Information">
          <div className="space-y-6">
            <Field label="Product Name">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full bg-neutral-100 border border-neutral-300 px-4 py-3 rounded-xl text-[13px] font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all placeholder:text-neutral-400"
                type="text"
                placeholder="e.g. Classic Oversized Tee"
                required
              />
            </Field>

            <Field label="Description">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                className="w-full bg-neutral-100 border border-neutral-300 px-4 py-3 rounded-xl text-[13px] font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all min-h-[140px] resize-none placeholder:text-neutral-400"
                placeholder="Describe the fabric, fit, and design details..."
                required
              />
            </Field>
          </div>
        </Section>

        {/* ── Section 3: Category & Pricing ── */}
        <Section icon={<Layout size={16} style={{ color: '#D4AF37' }} />} label="Category & Pricing">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Category">
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                className="w-full appearance-none bg-neutral-100 border border-neutral-300 px-4 py-3 rounded-xl text-[13px] font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all cursor-pointer"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </Field>

            <Field label="Sub Category">
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                className="w-full appearance-none bg-neutral-100 border border-neutral-300 px-4 py-3 rounded-xl text-[13px] font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all cursor-pointer"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </Field>

            <Field label="Price (USD)">
              <div className="relative">
                <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                <input
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className="w-full bg-neutral-100 border border-neutral-300 pl-10 pr-4 py-3 rounded-xl text-[13px] font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all placeholder:text-neutral-400"
                  type="number"
                  placeholder="0.00"
                  required
                />
              </div>
            </Field>
          </div>
        </Section>

        {/* ── Section 4: Sizes & Bestseller ── */}
        <Section icon={<Check size={16} style={{ color: '#D4AF37' }} />} label="Sizes & Status">
          <div className="space-y-8">
            <Field label="Available Sizes">
              <div className="flex flex-wrap gap-3 mt-1">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeClick(size)}
                    className={`
                      min-w-[60px] py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest 
                      transition-all duration-200 border active:scale-95
                      ${sizes.includes(size)
                        ? 'text-white border-[#D4AF37]'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-neutral-400 hover:text-neutral-900'}
                    `}
                    style={sizes.includes(size) ? { background: '#D4AF37' } : {}}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </Field>

            <label className="flex items-center gap-4 cursor-pointer group w-fit p-4 rounded-xl border border-neutral-300 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-all">
              <div className="relative">
                <input
                  onChange={() => setBestseller(prev => !prev)}
                  checked={bestseller}
                  type="checkbox"
                  className="sr-only"
                />
                <div
                  className="w-11 h-6 rounded-full transition-all duration-300 relative"
                  style={{ background: bestseller ? '#D4AF37' : '#d1d5db' }}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${bestseller ? 'left-5' : 'left-0.5'}`}></div>
                </div>
              </div>
              <div>
                <p className="text-[12px] font-black text-neutral-800 uppercase tracking-widest">Mark as Bestseller</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">Feature this product in the top collection.</p>
              </div>
            </label>
          </div>
        </Section>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-300">
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] text-white px-8 py-4 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            style={{ background: '#D4AF37', boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Check size={16} />
                Publish Product
              </>
            )}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 px-8 py-4 bg-white border border-neutral-300 text-neutral-700 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            Reset
          </button>
        </div>

      </form>
    </div>
  );
}

/* ── Reusable Layout Components ── */

const Section = ({ icon, label, children }) => (
  <div className="bg-white rounded-2xl border border-neutral-200 p-7">
    <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-neutral-200">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#D4AF37]/30"
        style={{ background: 'rgba(212,175,55,0.08)' }}
      >
        {icon}
      </div>
      <p className="text-[11px] font-black tracking-[0.25em] text-neutral-700 uppercase">{label}</p>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] block">{label}</label>
    {children}
  </div>
);

export default Add;