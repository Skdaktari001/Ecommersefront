import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';
import { 
  Save, 
  Upload, 
  X, 
  ChevronLeft, 
  Check, 
  Loader2,
  Image as ImageIcon,
  DollarSign,
  Type,
  Layout,
  RefreshCw
} from 'lucide-react';

const Edit = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Men")
    const [subCategory, setSubCategory] = useState("Topwear")
    const [bestseller, setBestseller] = useState(false)
    const [sizes, setSizes] = useState([])
    const [loading, setLoading] = useState(false)
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${backendUrl}api/product/${id}`);
                if (response.data.success) {
                    const product = response.data.product;
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price.toString());
                    setCategory(product.category);
                    setSubCategory(product.subCategory || "Topwear");
                    setBestseller(product.isBestseller || false);

                    if (product.sizes) {
                        setSizes(product.sizes);
                    }

                    if (product.images && product.images.length > 0) {
                        if (product.images[0]) setImage1(product.images[0].imageUrl);
                        if (product.images[1]) setImage2(product.images[1].imageUrl);
                        if (product.images[2]) setImage3(product.images[2].imageUrl);
                        if (product.images[3]) setImage4(product.images[3].imageUrl);
                    }
                } else {
                    toast.error(response.data.message || 'Product not found');
                    navigate('/list');
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load product details');
                navigate('/list');
            } finally {
                setInitializing(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

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

        try {
            const formData = new FormData();

            formData.append("name", name.trim())
            formData.append("description", description.trim())
            formData.append("price", parseFloat(price).toFixed(2))
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestseller", bestseller)
            formData.append("sizes", JSON.stringify(sizes))

            if (image1 instanceof File) formData.append("image1", image1)
            if (image2 instanceof File) formData.append("image2", image2)
            if (image3 instanceof File) formData.append("image3", image3)
            if (image4 instanceof File) formData.append("image4", image4)

            const response = await axios.put(
                `${backendUrl}api/product/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Product updated successfully!');
                navigate('/list');
            } else {
                toast.error(response.data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update product error:', error);
            toast.error(error.response?.data?.message || error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    const handleSizeClick = (size) => {
        setSizes(prev =>
            prev.includes(size)
                ? prev.filter(item => item !== size)
                : [...prev, size]
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

    if (initializing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 size={32} className="animate-spin text-black" />
                <p className="text-[13px] text-neutral-400 font-light tracking-[0.2em] uppercase animate-pulse">Retrieving Product</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl px-4 py-8">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <RefreshCw className="text-white" size={24} />
                    </div>
                    Refine Listing
                  </h1>
                  <p className="text-[13px] text-slate-400 font-medium">Updating metadata for <span className="font-bold text-slate-900 italic">"{name}"</span></p>
                </div>
                <button 
                  onClick={() => navigate('/list')}
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 transition-all text-[12px] font-black uppercase tracking-widest shadow-sm active:scale-95"
                >
                  <ChevronLeft size={16} />
                  Discard
                </button>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-8">
                {/* Step 1: Images */}
                <section className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-lg shadow-slate-100">
                      <ImageIcon size={20} className="text-indigo-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Visual Architecture</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((num) => {
                      const imageState = num === 1 ? image1 : num === 2 ? image2 : num === 3 ? image3 : image4;
                      const setImageFunction = num === 1 ? setImage1 : num === 2 ? setImage2 : num === 3 ? setImage3 : setImage4;

                      const isFile = imageState instanceof File;
                      const imageSrc = isFile ? URL.createObjectURL(imageState) : imageState;

                      return (
                        <div key={num} className="relative group">
                          <label
                            htmlFor={`image${num}`}
                            className={`
                              relative aspect-[4/5] rounded-24 px-4 py-8 border-2 border-dashed 
                              ${imageState 
                                ? 'border-slate-100 bg-white' 
                                : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-indigo-500/5'} 
                              transition-all duration-300 cursor-pointer flex flex-col items-center justify-center overflow-hidden group/label
                            `}
                          >
                            {imageState ? (
                              <img
                                src={imageSrc}
                                alt={`Preview ${num}`}
                                className="w-full h-full object-cover group-hover/label:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <Upload size={24} className="text-slate-200 group-hover/label:text-indigo-400 group-hover/label:scale-110 transition-all duration-300" />
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-tight group-hover/label:text-indigo-600">
                                  {num === 1 ? 'Primary' : `Slot ${num}`}
                                </span>
                              </div>
                            )}
                            
                            <input
                              onChange={(e) => handleImageUpload(e, setImageFunction)}
                              type="file"
                              id={`image${num}`}
                              className="hidden"
                              accept="image/*"
                            />
                          </label>
                          
                          {imageState && (
                            <button
                              type="button"
                              onClick={() => setImageFunction(false)}
                              className="absolute -top-3 -right-3 w-8 h-8 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-rose-500/20 hover:bg-rose-600 active:scale-90 transition-all z-10 border-2 border-white"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-neutral-400 font-light mt-6 italic">Support JPG, PNG, WebP. Replacing an image will take effect on save.</p>
                </section>

                {/* Step 2: Information */}
                <section className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-lg shadow-slate-100">
                      <Type size={20} className="text-indigo-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Core Descriptor</h3>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Title</label>
                      <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        className="w-full bg-slate-50/50 border border-slate-200 px-6 py-4 rounded-2xl text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                        type="text"
                        placeholder="Ex. Classic Silk Shirt"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Composition Narrative</label>
                      <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="w-full bg-slate-50/50 border border-slate-200 px-6 py-4 rounded-2xl text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all min-h-[160px] resize-none placeholder:text-slate-300"
                        placeholder="Detail the fabric, weave, and silhouettic intent..."
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Step 3: Categorization & Pricing */}
                <section className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-lg shadow-slate-100">
                      <Layout size={20} className="text-indigo-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Economic Matrix</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cleavage</label>
                      <select
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                        className="w-full appearance-none bg-slate-50/50 border border-slate-200 px-6 py-4 rounded-2xl text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                      >
                        <option value="Men">Force Men</option>
                        <option value="Women">Force Women</option>
                        <option value="Kids">Force Juniors</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Module</label>
                      <select
                        onChange={(e) => setSubCategory(e.target.value)}
                        value={subCategory}
                        className="w-full appearance-none bg-slate-50/50 border border-slate-200 px-6 py-4 rounded-2xl text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
                      >
                        <option value="Topwear">Top Modular</option>
                        <option value="Bottomwear">Base Modular</option>
                        <option value="Winterwear">Thermal Modular</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Market Value (USD)</label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400/50 pointer-events-none">
                          <DollarSign size={16} />
                        </div>
                        <input
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                          className="w-full bg-slate-50/50 border border-slate-200 pl-12 pr-6 py-4 rounded-2xl text-[14px] font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                          type="number"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Step 4: Attributes */}
                <section className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 shadow-lg shadow-slate-100">
                      <Check size={20} className="text-indigo-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Scale Definition</h3>
                  </div>

                  <div className="space-y-10">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-6 block text-center md:text-left">Dimension Mapping</label>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeClick(size)}
                            className={`
                              min-w-[70px] py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border-2 active:scale-90
                              ${sizes.includes(size)
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                                : 'bg-slate-50 text-slate-400 border-slate-50 hover:border-slate-200 hover:text-slate-600'
                              }
                            `}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-6 cursor-pointer group w-fit bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all">
                      <div className="relative">
                        <input
                          onChange={() => setBestseller(prev => !prev)}
                          checked={bestseller}
                          type="checkbox"
                          className="sr-only"
                        />
                        <div className={`
                          w-12 h-7 rounded-full transition-all duration-300 relative
                          ${bestseller ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-200'}
                        `}>
                          <div className={`
                            absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm
                            ${bestseller ? 'left-6' : 'left-1'}
                          `}></div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Bestseller Status</span>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">Feature this product in premium collection hubs.</p>
                      </div>
                    </label>
                  </div>
                </section>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-5 pt-10 border-t border-slate-50">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-indigo-600 text-white px-10 py-5 rounded-[24px] text-[13px] font-black uppercase tracking-[0.25em] shadow-xl shadow-indigo-600/25 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Syncing Matrix
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Commit Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/list')}
                    className="flex-1 px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-[24px] text-[12px] font-black uppercase tracking-[0.25em] hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all active:scale-95"
                  >
                    Discard Edits
                  </button>
                </div>
            </form>
        </div>
    )
}

export default Edit;
