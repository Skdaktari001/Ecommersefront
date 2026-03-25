import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { 
  Star, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XSquare, 
  AlertOctagon,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  Package,
  User,
  Calendar,
  Layers,
  CheckSquare,
  Square,
  Loader2
} from 'lucide-react';

const AdminReviews = ({ token }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReviews, setSelectedReviews] = useState([]);

    const fetchReviews = async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}api/review/admin/all`, {
                params: { status: statusFilter !== 'all' ? statusFilter : undefined },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setReviews(response.data.reviews || []);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to sync reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchReviews(true);
        }
    }, [token, statusFilter]);

    const updateReviewStatus = async (reviewId, status) => {
        try {
            const response = await axios.put(`${backendUrl}api/review/admin/${reviewId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                fetchReviews();
                toast.success(`Review ${status}`);
            }
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const deleteReview = async (reviewId) => {
        if (!window.confirm('Permanent delete? This cannot be undone.')) return;

        try {
            const response = await axios.delete(`${backendUrl}api/review/admin/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                fetchReviews();
                toast.success('Review purged');
            }
        } catch (error) {
            toast.error('Purge failed');
        }
    };

    const handleSelectAll = () => {
        if (selectedReviews.length === filteredReviews.length) {
            setSelectedReviews([]);
        } else {
            setSelectedReviews(filteredReviews.map(r => r.id));
        }
    };

    const handleSelectReview = (reviewId) => {
        setSelectedReviews(prev => 
            prev.includes(reviewId) ? prev.filter(id => id !== reviewId) : [...prev, reviewId]
        );
    };

    const bulkUpdateStatus = async (status) => {
        if (!status || selectedReviews.length === 0) return;
        try {
            await Promise.all(selectedReviews.map(id => 
                axios.put(`${backendUrl}api/review/admin/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } })
            ));
            toast.success(`Updated ${selectedReviews.length} reviews`);
            setSelectedReviews([]);
            fetchReviews();
        } catch (error) {
            toast.error('Bulk update failed partially');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'approved': return 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20';
            case 'pending': return 'bg-slate-50 text-slate-400 border-slate-100';
            case 'rejected': return 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20';
            case 'spam': return 'bg-slate-900 text-indigo-400 border-slate-800';
            default: return 'bg-slate-50 text-slate-500';
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.productId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl px-4 py-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <Layers className="text-white" size={24} />
                    </div>
                    Feedback Stream
                  </h1>
                  <p className="text-[13px] text-slate-400 font-medium">Moderate and analyze customer evaluation logs.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="text"
                            placeholder="Find feedback..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium"
                        />
                    </div>
                    <button
                        onClick={() => fetchReviews(true)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
                    >
                        <RefreshCw size={18} className={loading && reviews.length > 0 ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <div className={`
                flex flex-col md:flex-row items-center justify-between gap-4 p-5 mb-10 rounded-[24px] border transition-all duration-500
                ${selectedReviews.length > 0 ? 'bg-slate-900 border-slate-800 shadow-xl shadow-slate-900/20 scale-[1.01]' : 'bg-white border-slate-100 shadow-sm'}
            `}>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSelectAll}
                        className={`p-2.5 rounded-xl transition-all ${selectedReviews.length > 0 ? 'text-indigo-400 hover:bg-white/10' : 'text-slate-300 hover:bg-slate-50'}`}
                    >
                        {selectedReviews.length === filteredReviews.length && filteredReviews.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedReviews.length > 0 ? 'text-white' : 'text-slate-400'}`}>
                        {selectedReviews.length} Selection{selectedReviews.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {selectedReviews.length > 0 && (
                        <>
                            <select
                                onChange={(e) => bulkUpdateStatus(e.target.value)}
                                value=""
                                className="bg-white/10 text-white border-0 rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer hover:bg-white/20 transition-all shadow-inner"
                            >
                                <option value="" disabled className="text-slate-900">Execute Workflow</option>
                                <option value="approved" className="text-slate-900">Mass Approve</option>
                                <option value="pending" className="text-slate-900">Mass Pending</option>
                                <option value="rejected" className="text-slate-900">Mass Reject</option>
                                <option value="spam" className="text-slate-900">Mark as Spam</option>
                            </select>
                            <button
                                onClick={() => setSelectedReviews([])}
                                className="px-5 py-2.5 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`
                                appearance-none pl-5 pr-11 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none transition-all cursor-pointer min-w-[160px] border shadow-sm
                                ${selectedReviews.length > 0 ? 'bg-white/10 text-white border-white/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-white hover:border-indigo-100'}
                            `}
                        >
                            <option value="all">Global Matrix</option>
                            <option value="pending">Pending Buff</option>
                            <option value="approved">White-Listed</option>
                            <option value="rejected">Black-Listed</option>
                            <option value="spam">Spam Buffer</option>
                        </select>
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${selectedReviews.length > 0 ? 'text-indigo-400' : 'text-slate-400'}`} size={14} />
                    </div>
                </div>
            </div>

            {/* Content Display */}
            <div className="space-y-6">
                {loading && reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-50">
                        <Loader2 className="animate-spin text-neutral-300" size={32} />
                        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Syncing Intelligence...</p>
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-neutral-50 shadow-sm border-dashed">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-6">
                            <Layers size={32} className="text-neutral-200" />
                        </div>
                        <h3 className="text-[15px] font-bold text-black mb-1">No Mentions Found</h3>
                        <p className="text-[13px] text-neutral-400 font-light">Your feedback stream is currently clear.</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div 
                            key={review.id}
                            className={`
                                bg-white rounded-[32px] border transition-all duration-500 group overflow-hidden
                                ${selectedReviews.includes(review.id) ? 'border-indigo-600 ring-4 ring-indigo-500/5 shadow-2xl shadow-indigo-600/10' : 'border-slate-100 shadow-xl shadow-slate-200/40 hover:border-indigo-200 hover:shadow-indigo-600/5'}
                            `}
                        >
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Product Visual */}
                                    <div className="lg:w-1/4 shrink-0 flex items-start gap-5">
                                        <button 
                                            onClick={() => handleSelectReview(review.id)}
                                            className={`mt-1.5 p-2.5 rounded-xl transition-all active:scale-90 ${selectedReviews.includes(review.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300 hover:text-indigo-600'}`}
                                        >
                                            {selectedReviews.includes(review.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                        </button>
                                        <div className="w-24 h-28 rounded-24 overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-inner group/img">
                                            <img 
                                                src={review.productId?.images?.[0] || '/placeholder.jpg'} 
                                                alt="" 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Module Node</p>
                                            <p className="text-[14px] font-black text-slate-900 truncate leading-tight mb-2">{review.productId?.name || 'Vogue Essential'}</p>
                                            <div className="inline-block px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black text-indigo-400 uppercase tracking-widest shadow-lg shadow-slate-200">
                                                ID: {review.id.slice(-8).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1 min-w-0 md:pl-4">
                                        <div className="flex items-center gap-2 mb-5">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={16} 
                                                        className={i < review.rating ? 'text-indigo-500 fill-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]' : 'text-slate-100 fill-slate-100'} 
                                                    />
                                                ))}
                                            </div>
                                            <div className="h-4 w-px bg-slate-100 mx-2"></div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Index: {review.rating}.0</span>
                                        </div>
                                        
                                        <h4 className="text-[18px] font-black text-slate-900 mb-3 tracking-tight group-hover:text-indigo-600 transition-colors">{review.title}</h4>
                                        <div className="relative">
                                            <p className="text-[14px] text-slate-500 font-medium leading-[1.6] line-clamp-3 group-hover:line-clamp-none transition-all duration-700 italic bg-slate-50/50 p-4 rounded-24 border border-slate-50 border-dashed">
                                                "{review.description}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Meta & Actions */}
                                    <div className="lg:w-1/4 pt-8 lg:pt-0 lg:border-l lg:pl-10 border-slate-100 flex flex-col justify-between h-auto min-h-[160px]">
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shadow-lg shadow-slate-200">
                                                    <User size={18} className="text-indigo-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-black text-slate-900 truncate leading-tight uppercase tracking-tight">{review.userId?.name || 'Guest Node'}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 font-bold truncate tracking-widest">{review.userId?.email || 'verified_proxy'}</p>
                                                </div>
                                            </div>
                                            <div className="h-px bg-slate-50 w-full"></div>
                                            <div className={`
                                                inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all shadow-sm
                                                ${review.status === 'approved' 
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20' 
                                                    : review.status === 'rejected'
                                                        ? 'bg-rose-500 text-white border-rose-400 shadow-rose-500/20'
                                                        : 'bg-slate-50 text-slate-400 border-slate-100'}
                                            `}>
                                                {review.status === 'approved' ? <CheckCircle2 size={12} /> : review.status === 'rejected' ? <XSquare size={12} /> : <Clock size={12} />}
                                                {review.status}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-slate-50 mt-auto">
                                            <div className="relative flex-1 group/select">
                                                <select
                                                    value={review.status}
                                                    onChange={(e) => updateReviewStatus(review.id, e.target.value)}
                                                    className="w-full appearance-none bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-white focus:border-indigo-500 cursor-pointer transition-all pr-9 shadow-inner"
                                                >
                                                    <option value="pending">Status: Pending</option>
                                                    <option value="approved">Status: Approved</option>
                                                    <option value="rejected">Status: Rejected</option>
                                                    <option value="spam">Status: Spam Junk</option>
                                                </select>
                                                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover/select:text-indigo-400 transition-colors" size={14} />
                                            </div>
                                            <button 
                                                onClick={() => deleteReview(review.id)}
                                                className="w-11 h-11 rounded-xl flex items-center justify-center bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all shadow-sm active:scale-90"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Summary */}
            {!loading && filteredReviews.length > 0 && (
                <div className="mt-10 px-8 flex justify-between items-center text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-t border-neutral-50 pt-8">
                    <div className="flex items-center gap-4">
                        <span>Total Records: {reviews.length}</span>
                        <div className="w-1 h-1 rounded-full bg-neutral-200"></div>
                        <span>Filtered: {filteredReviews.length}</span>
                    </div>
                    <p className="font-medium text-neutral-300">Sync Frequency: 60s</p>
                </div>
            )}
        </div>
    );
};

export default AdminReviews;