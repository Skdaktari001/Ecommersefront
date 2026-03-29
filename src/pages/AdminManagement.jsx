import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    UserPlus, Shield, Trash2, Search,
    RefreshCw, Lock, Unlock, X, Check,
    Activity, Calendar, ArrowRight, Loader2,
    User, Key, MailIcon
} from 'lucide-react';
import { backendUrl } from '../App';

const AdminManagement = ({ token }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const fetchAdmins = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}api/user/admins`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) setAdmins(response.data.admins || []);
        } catch {
            toast.error('Failed to sync admin records');
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAdmins(true);
            const id = setInterval(() => fetchAdmins(false), 30000);
            return () => clearInterval(id);
        }
    }, [token]);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
            toast.error('All fields are required'); return;
        }
        if (newAdmin.password !== newAdmin.confirmPassword) {
            toast.error('Passwords do not match'); return;
        }
        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}api/user/create-admin`,
                { name: newAdmin.name, email: newAdmin.email, password: newAdmin.password },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success('Admin created successfully');
                setNewAdmin({ name: '', email: '', password: '', confirmPassword: '' });
                setShowCreateForm(false);
                fetchAdmins();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (!window.confirm(`Remove admin "${adminName}"?`)) return;
        try {
            const response = await axios.delete(
                `${backendUrl}api/user/${adminId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success('Admin removed');
                fetchAdmins();
            }
        } catch {
            toast.error('Failed to remove admin');
        }
    };

    const handleToggleStatus = async (adminId, currentStatus, adminName) => {
        const newStatus = !currentStatus;
        try {
            const response = await axios.put(
                `${backendUrl}api/user/${adminId}/status`,
                { active: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success(`Admin ${newStatus ? 'activated' : 'deactivated'}`);
                fetchAdmins();
            }
        } catch {
            toast.error('Status update failed');
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">Management</p>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
                            style={{ background: 'rgba(212,175,55,0.1)' }}
                        >
                            <Shield size={18} style={{ color: '#D4AF37' }} />
                        </div>
                        Admin Management
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 shadow-lg"
                        style={{ background: '#D4AF37', boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
                    >
                        <UserPlus size={14} />
                        New Admin
                    </button>
                    <button
                        onClick={() => fetchAdmins(true)}
                        className="p-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all text-neutral-600"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Search Bar ── */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search admins by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all"
                    />
                </div>
                <div className="px-5 py-3 bg-white rounded-xl border border-neutral-300 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-neutral-700">
                        {filteredAdmins.length} Admin{filteredAdmins.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* ── Admin Cards Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredAdmins.map((admin) => (
                    <div
                        key={admin.id}
                        className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-lg transition-all group"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border border-[#D4AF37]/30 group-hover:scale-105 transition-transform duration-300"
                                        style={{ background: 'rgba(212,175,55,0.08)' }}
                                    >
                                        <Shield size={22} style={{ color: '#D4AF37' }} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-[15px] font-black text-neutral-900 truncate">{admin.name}</h3>
                                        <p className="text-[12px] text-neutral-600 font-medium truncate">{admin.email}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                admin.isActive !== false
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                                            }`}>
                                                {admin.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                            {admin.lastLogin && (
                                                <span className="text-[10px] text-neutral-500 font-semibold">
                                                    Last login {new Date(admin.lastLogin).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => { setSelectedAdmin(admin); setShowDetails(true); }}
                                        className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all active:scale-90"
                                        title="View Details"
                                    >
                                        <Activity size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(admin.id, admin.isActive !== false, admin.name)}
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border active:scale-90 ${
                                            admin.isActive !== false
                                                ? 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500'
                                                : 'text-white border-transparent'
                                        }`}
                                        style={admin.isActive === false ? { background: '#D4AF37' } : {}}
                                    >
                                        {admin.isActive !== false ? <Lock size={14} /> : <Unlock size={14} />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                        className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all active:scale-90"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
                                    <Calendar size={12} style={{ color: '#D4AF37' }} />
                                    Joined {new Date(admin.createdAt).toLocaleDateString()}
                                </div>
                                <button
                                    onClick={() => { setSelectedAdmin(admin); setShowDetails(true); }}
                                    className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-lg hover:border-[#D4AF37]/40 hover:text-[#D4AF37] text-[10px] font-black text-neutral-700 uppercase tracking-widest transition-all"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Empty State ── */}
            {filteredAdmins.length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-neutral-200 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4">
                        <Activity size={20} className="text-neutral-400" />
                    </div>
                    <p className="text-[12px] text-neutral-600 font-bold uppercase tracking-widest">No admins found</p>
                    <p className="text-[11px] text-neutral-400 mt-1">Try adjusting your search</p>
                </div>
            )}

            {/* ── Create Admin Modal ── */}
            {showCreateForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white w-full max-w-lg rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden">
                        <div className="p-7">

                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-7 pb-5 border-b border-neutral-200">
                                <div>
                                    <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">New Entry</p>
                                    <h2 className="text-xl font-black text-neutral-900 tracking-tight">Create Admin</h2>
                                </div>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAdmin} className="space-y-5">
                                <FormField label="Full Name" icon={<User size={14} className="text-neutral-500" />}>
                                    <input
                                        type="text"
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all"
                                        placeholder="John Smith"
                                        required
                                    />
                                </FormField>

                                <FormField label="Email Address" icon={<MailIcon size={14} className="text-neutral-500" />}>
                                    <input
                                        type="email"
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all"
                                        placeholder="admin@example.com"
                                        required
                                    />
                                </FormField>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Password" icon={<Key size={14} className="text-neutral-500" />}>
                                        <input
                                            type="password"
                                            value={newAdmin.password}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </FormField>
                                    <FormField label="Confirm Password" icon={<Check size={14} className="text-neutral-500" />}>
                                        <input
                                            type="password"
                                            value={newAdmin.confirmPassword}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </FormField>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest text-neutral-700 border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-3 text-white text-[11px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                        style={{ background: '#D4AF37', boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
                                    >
                                        {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                                        Create Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Admin Detail Drawer ── */}
            {showDetails && selectedAdmin && (
                <div className="fixed inset-0 z-[200] flex justify-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-neutral-200 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-7">

                            {/* Drawer Header */}
                            <div className="flex justify-between items-center mb-8 pb-5 border-b border-neutral-200">
                                <div>
                                    <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-0.5">Profile</p>
                                    <p className="text-[13px] font-black text-neutral-900">Admin Details</p>
                                </div>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-8">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border border-[#D4AF37]/30"
                                    style={{ background: 'rgba(212,175,55,0.08)' }}
                                >
                                    <Shield size={32} style={{ color: '#D4AF37' }} />
                                </div>
                                <h2 className="text-xl font-black text-neutral-900">{selectedAdmin.name}</h2>
                                <p className="text-[12px] text-neutral-600 font-medium">{selectedAdmin.email}</p>
                                <div
                                    className="mt-4 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[#D4AF37]/30"
                                    style={{ background: 'rgba(212,175,55,0.08)', color: '#B8963E' }}
                                >
                                    ID: {selectedAdmin.id?.slice(0, 8)}...
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Sessions</p>
                                    <p className="text-[17px] font-black text-neutral-900">{selectedAdmin.loginCount || 0}</p>
                                </div>
                                <div className="p-4 bg-neutral-100 border border-neutral-200 rounded-xl">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">Status</p>
                                    <p className={`text-[15px] font-black ${selectedAdmin.isActive !== false ? 'text-emerald-600' : 'text-neutral-400'}`}>
                                        {selectedAdmin.isActive !== false ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-3">Account Info</p>
                                <div className="flex justify-between items-center p-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-[12px]">
                                    <span className="text-neutral-600 font-semibold">Joined</span>
                                    <span className="font-black text-neutral-900">{new Date(selectedAdmin.createdAt).toLocaleDateString()}</span>
                                </div>
                                {selectedAdmin.lastLogin && (
                                    <div className="flex justify-between items-center p-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-[12px]">
                                        <span className="text-neutral-600 font-semibold">Last Login</span>
                                        <span className="font-black text-neutral-900">{new Date(selectedAdmin.lastLogin).toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedAdmin.address && (
                                    <div className="p-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-[12px] text-neutral-700 leading-relaxed">
                                        {selectedAdmin.address.street}<br />
                                        {selectedAdmin.address.city}, {selectedAdmin.address.state}<br />
                                        {selectedAdmin.address.country} {selectedAdmin.address.zipCode}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-7 border-t border-neutral-200 grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleToggleStatus(selectedAdmin.id, selectedAdmin.isActive !== false, selectedAdmin.name)}
                                className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                                    selectedAdmin.isActive !== false
                                        ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                                        : 'text-white border-transparent hover:-translate-y-0.5'
                                }`}
                                style={selectedAdmin.isActive === false ? { background: '#D4AF37' } : {}}
                            >
                                {selectedAdmin.isActive !== false ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="py-3 border border-neutral-300 rounded-xl text-[11px] font-black uppercase tracking-widest text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Reusable Form Field ── */
const FormField = ({ label, icon, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] block">{label}</label>
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>
            {children}
        </div>
    </div>
);

export default AdminManagement;