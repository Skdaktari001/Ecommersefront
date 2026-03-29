import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  User, Mail, Phone, MapPin, Save,
  Loader2, Lock, Camera
} from 'lucide-react';
import { backendUrl } from '../App';

const UserProfile = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    address: { street: '', city: '', state: '', country: '', zipCode: '' },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}api/user-profile/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || '',
          email: res.data.user.email || '',
          phone: res.data.user.phone || '',
          address: res.data.user.address || {
            street: '', city: '', state: '', country: '', zipCode: ''
          }
        });
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUserProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${backendUrl}api/user-profile/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Profile updated');
        fetchUserProfile();
      }
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await axios.post(
        `${backendUrl}api/user-profile/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Password updated');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      toast.error('Password update failed');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;
    const fd = new FormData();
    fd.append('image', selectedImage);

    try {
      const res = await axios.post(`${backendUrl}api/user-profile/profile/image`, fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success('Image updated');
        setSelectedImage(null);
        setImagePreview('');
        fetchUserProfile();
      }
    } catch {
      toast.error('Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl px-4 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-1">
            Account
          </p>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-3">
            <User size={20} />
            Profile
          </h1>
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="px-5 py-2.5 bg-white border border-neutral-300 rounded-xl text-[12px] font-semibold hover:bg-neutral-50 flex items-center gap-2"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-8 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
            {(user?.profileImage || imagePreview) ? (
              <img src={imagePreview || user?.profileImage} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-400">
                <User size={30} />
              </div>
            )}
          </div>

          <label className="absolute -bottom-2 -right-2 bg-white border p-1.5 rounded-lg cursor-pointer">
            <Camera size={14} />
            <input type="file" className="hidden" onChange={handleImageSelect} />
          </label>
        </div>

        <div>
          <p className="text-[14px] font-black text-neutral-900">{user?.name}</p>
          <p className="text-[12px] text-neutral-500">{user?.email}</p>

          {selectedImage && (
            <button
              onClick={uploadImage}
              className="mt-3 text-[11px] text-[#D4AF37] font-bold"
            >
              Upload Image
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-8">
        {['profile', 'security'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase border ${
              activeTab === tab
                ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]'
                : 'bg-white border-neutral-300 text-neutral-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PROFILE FORM */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6">

          <div>
            <label className="text-xs text-neutral-500">Full Name</label>
            <input name="name" value={formData.name} onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl" />
          </div>

          <div>
            <label className="text-xs text-neutral-500">Email</label>
            <input name="email" value={formData.email} onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl" />
          </div>

          <div>
            <label className="text-xs text-neutral-500">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl" />
          </div>

          <div>
            <label className="text-xs text-neutral-500">Address</label>
            <input name="address.street" value={formData.address.street} onChange={handleInputChange}
              className="w-full mt-2 px-4 py-3 border rounded-xl" />
          </div>
        </div>
      )}

      {/* SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 max-w-md">
          <input
            type="password"
            placeholder="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 border rounded-xl"
          />

          <button
            onClick={handleChangePassword}
            className="w-full py-3 bg-black text-white rounded-xl text-sm"
          >
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      )}

    </div>
  );
};

export default UserProfile;