import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    UserPlus, Shield, Edit, Trash2, Search, Filter,
    RefreshCw, Eye, Lock, Unlock, Mail, Phone, MapPin,
    X, Check, AlertCircle, ChevronRight, Activity, Calendar,
    Layout, ArrowRight, Loader2, User, Key, MailIcon
} from 'lucide-react';
import { backendUrl } from '../App';

const AdminManagement = ({ token }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // New admin form state
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

            if (response.data.success) {
                setAdmins(response.data.admins || []);
            }
        } catch (error) {
            toast.error('Failed to sync admin records');
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAdmins(true);
            const intervalId = setInterval(() => fetchAdmins(false), 30000);
            return () => clearInterval(intervalId);
        }
    }, [token]);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
            toast.error('Identity incomplete'); return;
        }
        if (newAdmin.password !== newAdmin.confirmPassword) {
            toast.error('Secret mismatch'); return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(
                `${backendUrl}api/user/create-admin`,
                { name: newAdmin.name, email: newAdmin.email, password: newAdmin.password },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Admin Protocol Initialized');
                setNewAdmin({ name: '', email: '', password: '', confirmPassword: '' });
                setShowCreateForm(false);
                fetchAdmins();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Access Denied');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAdmin = async (adminId, adminName) => {
        if (!window.confirm(`Revoke all privileges for "${adminName}"?`)) return;
        try {
            const response = await axios.delete(`${backendUrl}api/user/${adminId}`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                toast.success('Credentials Purged');
                fetchAdmins();
            }
        } catch (error) {
            toast.error('Purge Failed');
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
                toast.success(`User ${newStatus ? 'Authorized' : 'Restricted'}`);
                fetchAdmins();
            }
        } catch (error) {
            toast.error('Status override failed');
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Minimalist Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <Shield className="text-white" size={24} />
                    </div>
                    Authority
                  </h1>
                  <p className="text-[13px] text-slate-400 font-medium">Enterprise Identity Control</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <UserPlus size={16} />
                        New Admin
                    </button>
                    <button
                        onClick={() => fetchAdmins(true)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Premium Create Form Modal-style overlay */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white border border-slate-200 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10 md:p-14">
                            <div className="flex justify-between items-center mb-10">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Access Protocol</h2>
                                    <p className="text-[13px] text-slate-400 font-medium">Configure new administrative credentials.</p>
                                </div>
                                <button onClick={() => setShowCreateForm(false)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all border border-slate-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateAdmin} className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Identity Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            value={newAdmin.name}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold"
                                            placeholder="System Designation"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 group">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Communication Channel</label>
                                    <div className="relative">
                                        <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors" size={16} />
                                        <input
                                            type="email"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all"
                                            placeholder="email@system.auth"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Master Key</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors" size={16} />
                                            <input
                                                type="password"
                                                value={newAdmin.password}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Key Validation</label>
                                        <div className="relative">
                                            <Check className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-black transition-colors" size={16} />
                                            <input
                                                type="password"
                                                value={newAdmin.confirmPassword}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 py-4 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black border border-neutral-100 rounded-2xl transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] py-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                                        Initialize Authority
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Filter Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-10">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search Identity Database..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-[13px] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>
                <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        {filteredAdmins.length} Nodes Online
                    </span>
                </div>
            </div>

            {/* Admin Grid - High-density card design */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAdmins.map((admin) => (
                    <div 
                        key={admin.id} 
                        className="bg-white border border-slate-100 rounded-[36px] overflow-hidden hover:border-indigo-100 transition-all group shadow-sm hover:shadow-2xl hover:shadow-slate-200/50"
                    >
                        <div className="p-10">
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-slate-200">
                                        <Shield size={28} className="text-indigo-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-[17px] font-black text-slate-900 truncate leading-none mb-1.5">{admin.name}</h3>
                                        <p className="text-[12px] text-slate-400 font-medium truncate">{admin.email}</p>
                                        <div className="flex items-center gap-2 mt-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                                admin.active !== false 
                                                    ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                                                    : 'bg-slate-50 text-slate-300 border-slate-100'
                                            }`}>
                                                {admin.active !== false ? 'Authorized' : 'Restricted'}
                                            </span>
                                            {admin.lastLogin && (
                                                <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">v {new Date(admin.lastLogin).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 relative z-10">
                                    <button
                                        onClick={() => { setSelectedAdmin(admin); setShowDetails(true); }}
                                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 transition-all border border-slate-100 shadow-sm active:scale-90"
                                        title="System Logs"
                                    >
                                        <Activity size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(admin.id, admin.active !== false, admin.name)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-transparent shadow-sm active:scale-90 ${
                                            admin.active !== false 
                                                ? 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100' 
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                                        }`}
                                    >
                                        {admin.active !== false ? <Lock size={16} /> : <Unlock size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all border border-transparent active:scale-90 shadow-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                    <Calendar size={12} className="text-indigo-400" />
                                    <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button 
                                    onClick={() => { setSelectedAdmin(admin); setShowDetails(true); }}
                                    className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-indigo-100 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAdmins.length === 0 && (
                <div className="text-center py-32 border-2 border-dashed border-neutral-50 rounded-[40px]">
                    <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center mx-auto mb-6">
                        <Activity size={24} className="text-neutral-200" />
                    </div>
                    <p className="text-[13px] text-neutral-400 font-light tracking-widest uppercase">No Identity Matches Found</p>
                </div>
            )}

            {/* Admin Details Premium Drawer/Modal */}
            {showDetails && selectedAdmin && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex justify-end transition-all">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-500">
                        <div className="h-full flex flex-col p-8 md:p-12 overflow-y-auto">
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Node Configuration</span>
                                <button onClick={() => setShowDetails(false)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black">
                                    <X size={24} />
                                </button>
                            </div>

                             <div className="flex flex-col items-center mb-12">
                                <div className="w-24 h-24 rounded-[36px] bg-slate-900 flex items-center justify-center mb-6 shadow-2xl shadow-slate-200">
                                    <Shield size={40} className="text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedAdmin.name}</h2>
                                <p className="text-[13px] text-slate-400 font-medium">{selectedAdmin.email}</p>
                                <div className="mt-6 px-5 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                                    Access Key: {selectedAdmin.id.slice(0, 8)}...
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-2">Login Frequency</p>
                                        <p className="text-[15px] font-bold text-black">{selectedAdmin.loginCount || 0} Sessions</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-2">Protocol Status</p>
                                        <p className={`text-[15px] font-bold ${selectedAdmin.active !== false ? 'text-black' : 'text-neutral-300'}`}>
                                            {selectedAdmin.active !== false ? 'Active' : 'Locked'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-4">Core Metadata</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[12px] p-3 bg-neutral-50 rounded-xl">
                                            <span className="text-neutral-400">Creation Date</span>
                                            <span className="font-bold">{new Date(selectedAdmin.createdAt).toLocaleString()}</span>
                                        </div>
                                        {selectedAdmin.lastLogin && (
                                            <div className="flex justify-between items-center text-[12px] p-3 bg-neutral-50 rounded-xl">
                                                <span className="text-neutral-400">Terminal Access</span>
                                                <span className="font-bold">{new Date(selectedAdmin.lastLogin).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedAdmin.address && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-4">Location Services</p>
                                        <div className="p-5 border border-dashed border-neutral-100 rounded-2xl text-[13px] text-neutral-500 leading-relaxed font-light">
                                            {selectedAdmin.address.street}<br/>
                                            {selectedAdmin.address.city}, {selectedAdmin.address.state}<br/>
                                            {selectedAdmin.address.country} {selectedAdmin.address.zipCode}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-10 grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleToggleStatus(selectedAdmin.id, selectedAdmin.active !== false, selectedAdmin.name)}
                                    className={`py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                                        selectedAdmin.active !== false ? 'bg-neutral-50 text-red-500 border border-red-100' : 'bg-black text-white'
                                    }`}
                                >
                                    {selectedAdmin.active !== false ? 'Restrict Access' : 'Restore Access'}
                                </button>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="py-4 border border-neutral-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black hover:border-black transition-all"
                                >
                                    Exit Logs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;