import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
    User, Camera, Save, Lock, Mail, Phone, MapPin, 
    Bell, Globe, Shield, Upload, X, Check,
    Activity, Key, Eye, UserCheck, CreditCard,
    ArrowRight, Loader2, Trash2, Smartphone
} from 'lucide-react';
import { backendUrl } from '../App';

const UserProfile = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    
    // User data
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '',
        address: { street: '', city: '', state: '', country: '', zipCode: '' },
        preferences: { emailNotifications: true, smsNotifications: false, newsletter: true }
    });
    
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}api/user-profile/profile`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                setUser(response.data.user);
                setFormData({
                    name: response.data.user.name || '',
                    email: response.data.user.email || '',
                    phone: response.data.user.phone || '',
                    address: response.data.user.address || { street: '', city: '', state: '', country: '', zipCode: '' },
                    preferences: response.data.user.preferences || { emailNotifications: true, smsNotifications: false, newsletter: true }
                });
            }
        } catch (error) {
            toast.error('Failed to sync profile data');
        } finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchUserProfile(); }, [token]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
        } else if (name.startsWith('preferences.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, preferences: { ...prev.preferences, [field]: type === 'checkbox' ? checked : value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) { toast.error('Format unsupported'); return; }
            if (file.size > 5 * 1024 * 1024) { toast.error('Volume limit exceeded (5MB)'); return; }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadProfileImage = async () => {
        if (!selectedImage) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', selectedImage);
            const response = await axios.post(`${backendUrl}api/user-profile/profile/image`, fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                toast.success('Bio-metric identity updated');
                setSelectedImage(null);
                setImagePreview('');
                fetchUserProfile();
            }
        } catch (error) { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const deleteProfileImage = async () => {
        if (!window.confirm('Purge profile visualization?')) return;
        try {
            const response = await axios.delete(`${backendUrl}api/user-profile/profile/image`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) { toast.success('Identity visual reset'); fetchUserProfile(); }
        } catch (error) { toast.error('Reset failed'); }
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
            const response = await axios.put(`${backendUrl}api/user-profile/profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) { toast.success('Profile synced'); fetchUserProfile(); }
        } catch (error) { toast.error('Update rejected'); }
        finally { setSaving(false); }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Key mismatch'); return; }
        setChangingPassword(true);
        try {
            const response = await axios.post(`${backendUrl}api/user-profile/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.success) {
                toast.success('Auth credentials updated');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setActiveTab('profile');
            }
        } catch (error) { toast.error('Credential update failed'); }
        finally { setChangingPassword(false); }
    };

    if (loading) return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Minimalist Header */}
            <div className="mb-12">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                      <UserCheck className="text-white" size={24} />
                    </div>
                    Profile Settings
                </h1>
                <p className="text-[13px] text-slate-400 font-medium mt-1 tracking-wide">Manage your administrative identity and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Visual Identity Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-neutral-100 rounded-[40px] p-10 shadow-sm text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="relative inline-block mb-8">
                                <div className="w-32 h-32 rounded-[40px] overflow-hidden border border-neutral-100 shadow-2xl mx-auto bg-neutral-50 group-hover:scale-105 transition-transform duration-500">
                                    {(user?.profileImage || imagePreview) ? (
                                        <img src={imagePreview || user?.profileImage} alt="Identity" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-200">
                                            <User size={64} strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl cursor-pointer hover:bg-indigo-700 transition-all flex items-center justify-center shadow-xl shadow-indigo-600/20 border-2 border-white">
                                    <Camera size={18} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                </label>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-black tracking-tight">{user?.name}</h2>
                            <p className="text-[13px] text-neutral-400 font-light mt-1">{user?.email}</p>
                            
                            <div className="mt-8 flex flex-wrap justify-center gap-2">
                                {user?.isAdmin && (
                                    <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Administrator</span>
                                )}
                                <span className={`px-3 py-1 border text-[9px] font-bold uppercase tracking-widest rounded-full ${user?.active ? 'border-green-100 text-green-600 bg-green-50' : 'border-neutral-100 text-neutral-400 bg-neutral-50'}`}>
                                    {user?.active ? 'Level: Active' : 'Level: Restricted'}
                                </span>
                            </div>
                        </div>
                        
                        {/* Image Actions */}
                        {(selectedImage || user?.profileImage) && (
                            <div className="mt-10 pt-8 border-t border-slate-50 relative z-10 flex gap-3">
                                {selectedImage ? (
                                    <button onClick={uploadProfileImage} disabled={uploading} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
                                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        Update Photo
                                    </button>
                                ) : (
                                    <button onClick={deleteProfileImage} className="flex-1 py-3.5 bg-slate-50 text-slate-400 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 border border-slate-100">
                                        <Trash2 size={14} />
                                        Remove Photo
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Metrics */}
                    <div className="space-y-3">
                        {[
                            { id: 'profile', icon: User, label: 'Bio Data' },
                            { id: 'security', icon: Lock, label: 'Access Keys' },
                            { id: 'preferences', icon: Bell, label: 'Transmissions' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full p-6 rounded-[28px] border transition-all flex items-center justify-between group ${
                                    activeTab === tab.id 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100 hover:bg-indigo-50/30'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-slate-300 group-hover:text-indigo-500'} />
                                    <span className="text-[13px] font-black uppercase tracking-widest">{tab.label}</span>
                                </div>
                                <ArrowRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 text-indigo-500'} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Configuration Area */}
                <div className="lg:col-span-8 bg-white border border-neutral-100 rounded-[48px] shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 md:p-14 flex-1">
                        {/* Personal Information */}
                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Identity Parameters</h3>
                                        <p className="text-[13px] text-slate-400 font-medium">Modify core profile designations.</p>
                                    </div>
                                    <button onClick={saveProfile} disabled={saving} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95">
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Sync Profile
                                    </button>
                                </div>

                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Identity Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-indigo-500/20 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Communication Channel</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-200 group-focus-within:text-black transition-colors" size={16} />
                                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-1">Primary Terminal</label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-200 group-focus-within:text-black transition-colors" size={16} />
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <h4 className="flex items-center gap-3 text-[14px] font-bold text-black uppercase tracking-widest mb-8">
                                            <MapPin size={18} className="text-neutral-300" />
                                            Station Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            <div className="md:col-span-8 space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Street / Block</label>
                                                <input type="text" name="address.street" value={formData.address.street} onChange={handleInputChange} className="w-full px-5 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Postal Code</label>
                                                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleInputChange} className="w-full px-5 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Municipality</label>
                                                <input type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} className="w-full px-5 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Province / Region</label>
                                                <input type="text" name="address.state" value={formData.address.state} onChange={handleInputChange} className="w-full px-5 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Jurisdiction</label>
                                                <input type="text" name="address.country" value={formData.address.country} onChange={handleInputChange} className="w-full px-5 py-4 bg-neutral-50 border border-transparent rounded-2xl text-[13px] focus:outline-none focus:bg-white focus:border-black/5 transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                                <div className="mb-12">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Credentials</h3>
                                    <p className="text-[13px] text-slate-400 font-medium">Revise access keys and auth levels.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="p-8 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-200">
                                        <h4 className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest mb-6">
                                            <Key size={16} className="text-indigo-400" />
                                            Key Rotation
                                        </h4>
                                        <div className="space-y-4">
                                            <input type="password" placeholder="Current Access Key" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition-all placeholder:text-slate-500" />
                                            <input type="password" placeholder="New Master Key" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition-all placeholder:text-slate-500" />
                                            <input type="password" placeholder="Validate Key" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition-all placeholder:text-slate-500" />
                                            <button onClick={handleChangePassword} disabled={changingPassword} className="w-full py-4 mt-6 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20 active:scale-95">
                                                {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                                                Authorize Rotation
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 border border-neutral-100 rounded-[32px]">
                                        <h4 className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-widest text-neutral-300 mb-6 underline underline-offset-8 decoration-red-100">
                                            Critical Protocol
                                        </h4>
                                        <p className="text-[13px] text-neutral-400 leading-relaxed mb-6 font-light">Permanently purge all data and revoke access rights. This action is irreversible.</p>
                                        <button className="px-6 py-3 bg-neutral-50 text-red-400 border border-red-50 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            Request Purge
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center mb-12">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transmissions</h3>
                                        <p className="text-[13px] text-slate-400 font-medium">Configure system delta alerts.</p>
                                    </div>
                                    <button onClick={saveProfile} disabled={saving} className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                                        Save Config
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { field: 'emailNotifications', label: 'Cloud Mail', desc: 'Sync alert logs via secure email.' },
                                        { field: 'smsNotifications', label: 'Signal Link', desc: 'Direct terminal notifications via cellular.' },
                                        { field: 'newsletter', label: 'System Briefing', desc: 'Weekly protocol updates and market intel.' }
                                    ].map((pref) => (
                                        <div key={pref.field} className="p-8 border border-slate-100 rounded-[32px] bg-slate-50/50 flex items-start justify-between group hover:border-indigo-100 hover:bg-white transition-all">
                                            <div className="max-w-[80%]">
                                                <h4 className="text-[14px] font-black text-slate-800 tracking-tight mb-2 uppercase">{pref.label}</h4>
                                                <p className="text-[12px] text-slate-400 leading-relaxed font-medium">{pref.desc}</p>
                                            </div>
                                            <button 
                                                onClick={() => setFormData({ ...formData, preferences: { ...formData.preferences, [pref.field]: !formData.preferences[pref.field] } })}
                                                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.preferences[pref.field] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${formData.preferences[pref.field] ? 'left-7' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="px-10 py-6 bg-neutral-50/50 flex justify-between items-center text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
                        <span>Terminal Ver: 4.8.2-Stable</span>
                        <span>Member Since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '####'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;