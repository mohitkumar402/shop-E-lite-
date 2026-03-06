import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Avatar Section */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-violet-200">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${
                  isEditing
                    ? 'bg-white border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                    : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-xl border transition-all ${
                  isEditing
                    ? 'bg-white border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                    : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}
              />
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Account ID</span>
                <p className="font-medium text-slate-800">{user?.id || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-500">Member Since</span>
                <p className="font-medium text-slate-800">March 2026</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-800">Password</p>
                <p className="text-sm text-slate-500">Last changed: Never</p>
              </div>
            </div>
            <button className="px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-slate-800">Two-Factor Authentication</p>
                <p className="text-sm text-slate-500">Not enabled</p>
              </div>
            </div>
            <button className="px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg font-medium transition-colors">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
