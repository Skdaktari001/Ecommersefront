import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  MoreVertical, 
  Search, 
  RefreshCw,
  UserCheck,
  UserX,
  ExternalLink,
  ChevronRight,
  Loader2
} from 'lucide-react';

const Users = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async (showLoader = false) => {
        if (showLoader) setLoading(true);
        try {
            const response = await axios.get(
                `${backendUrl}api/user/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setUsers(response.data.users || []);
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error('Failed to sync user database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers(true);
            const intervalId = setInterval(() => fetchUsers(false), 30000);
            return () => clearInterval(intervalId);
        }
    }, [token]);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const response = await axios.put(
                `${backendUrl}api/user/${userId}/status`,
                { active: !currentStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('User status updated');
                fetchUsers();
            }
        } catch (error) {
            toast.error('Status sync failed');
        }
    };

    return (
        <div className="max-w-7xl px-4 py-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <UserCheck className="text-white" size={24} />
                    </div>
                    Community
                  </h1>
                  <p className="text-[13px] text-slate-400 font-medium tracking-wide">Manage platform members and access levels.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input
                            type="text"
                            placeholder="Find member..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm font-medium"
                        />
                    </div>
                    <button
                        onClick={() => fetchUsers(true)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-indigo-600 shadow-sm"
                    >
                        <RefreshCw size={18} className={loading && users.length > 0 ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Member Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Communication</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest sm:table-cell hidden">Node Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {loading && users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={24} className="animate-spin text-neutral-200" />
                                            <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-widest">Syncing Directory...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center opacity-20 filter grayscale">
                                            <User size={48} className="mb-4" />
                                            <p className="text-[13px] font-bold text-black uppercase tracking-widest">No Matches Found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 shrink-0 rounded-[18px] bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-500">
                                                    <span className="text-[16px] font-black text-indigo-400">
                                                        {user.name?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-[14px] font-black text-slate-900 truncate leading-none mb-1.5">
                                                        {user.name || 'Anonymous Member'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                                                        <Clock size={10} className="text-indigo-400" />
                                                        v {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden lg:table-cell">
                                            <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                                                <Mail size={14} className="text-indigo-300" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`
                                                inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                                                ${user.isAdmin ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20' : 'bg-slate-50 text-slate-400 border-slate-100'}
                                            `}>
                                                <Shield size={10} />
                                                {user.isAdmin ? 'Master Admin' : 'Client Node'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 sm:table-cell hidden">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${user.isActive !== false ? 'bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-slate-200'}`}></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.isActive !== false ? 'text-slate-900' : 'text-slate-300'}`}>
                                                    {user.isActive !== false ? 'Verified' : 'Banned'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleUserStatus(user.id, user.isActive !== false)}
                                                    className={`
                                                        w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-sm active:scale-90
                                                        ${user.isActive !== false 
                                                            ? 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100' 
                                                            : 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'}
                                                    `}
                                                    title={user.isActive !== false ? 'Revoke Access' : 'Restore Access'}
                                                >
                                                    {user.isActive !== false ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                                <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-100 text-slate-300 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Summary */}
            {!loading && filteredUsers.length > 0 && (
                <div className="mt-6 px-8 flex justify-between items-center text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                    <span>Total Community: {users.length}</span>
                    <span>Displaying {filteredUsers.length}</span>
                </div>
            )}
        </div>
    );
};

export default Users;