import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import {
    User, Mail, Shield, Clock, Search, RefreshCw,
    UserCheck, UserX, Loader2
} from 'lucide-react';

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async (showLoader = false) => {
        if (!token) return;
        if (showLoader) setLoading(true);

        try {
            const response = await axios.get(`${backendUrl}api/user/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setUsers(response.data.users || []);
            }
        } catch (error) {
            toast.error('Failed to sync user database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(true);
        const interval = setInterval(() => fetchUsers(false), 30000);
        return () => clearInterval(interval);
    }, [token]);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const res = await axios.put(
                `${backendUrl}api/user/${userId}/status`,
                { active: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success('User status updated');
                fetchUsers();
            }
        } catch {
            toast.error('Status update failed');
        }
    };

    return (
        <div className="max-w-6xl px-4 py-8">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">
                        Community
                    </p>
                    <h1 className="text-2xl font-black tracking-tight text-neutral-900 flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#D4AF37]/40"
                            style={{ background: 'rgba(212,175,55,0.1)' }}
                        >
                            <UserCheck size={18} style={{ color: '#D4AF37' }} />
                        </div>
                        Users
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-[12px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/25 focus:border-[#D4AF37]/60 transition-all w-72"
                        />
                    </div>

                    <button
                        onClick={() => fetchUsers(true)}
                        className="p-2.5 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-xl border-2 border-[#D4AF37]/20"></div>
                        <div className="absolute inset-0 rounded-xl border-t-2 border-[#D4AF37] animate-spin"></div>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                        Loading Users...
                    </p>
                </div>

            ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-neutral-200">
                    <User size={28} className="text-neutral-400 mb-3" />
                    <p className="text-[13px] font-black text-neutral-900">No Users Found</p>
                </div>

            ) : (
                <div className="space-y-5">
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-7 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all"
                        >
                            <div className="flex flex-col md:flex-row gap-6">

                                {/* ── User Info ── */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-[#D4AF37] font-black">
                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>

                                    <div>
                                        <p className="text-[14px] font-black text-neutral-900">
                                            {user.name || 'Anonymous'}
                                        </p>
                                        <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                                            <Mail size={12} />
                                            {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1">
                                            <Clock size={11} />
                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {/* ── Role ── */}
                                <div className="flex flex-col justify-center">
                                    <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border
                    ${user.isAdmin
                                            ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30'
                                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'}
                  `}>
                                        <Shield size={11} />
                                        {user.isAdmin ? 'Admin' : 'User'}
                                    </span>
                                </div>

                                {/* ── Status + Action ── */}
                                <div className="flex items-center justify-between md:justify-end gap-4">

                                    <div className="text-[11px] font-bold">
                                        <span className={user.isActive !== false ? 'text-emerald-600' : 'text-red-500'}>
                                            {user.isActive !== false ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                                        className={`
                      px-3 py-2 rounded-xl text-[11px] font-bold border transition-all
                      ${user.isActive !== false
                                                ? 'bg-neutral-100 border-neutral-300 hover:bg-red-50 hover:border-red-200 text-neutral-700'
                                                : 'bg-[#D4AF37] text-white border-[#D4AF37]'}
                    `}
                                    >
                                        {user.isActive !== false ? 'Disable' : 'Enable'}
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;