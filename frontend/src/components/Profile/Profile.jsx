import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile({ onBack }) {
  const { user, logout } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user?.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <span>←</span>
        <span>Back to Dashboard</span>
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Profile Content */}
        <div className="px-8 py-8">
          {/* Avatar */}
          <div className="flex items-end space-x-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold -mt-12 shadow-lg border-4 border-white">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.fullName}</h1>
              <p className="text-gray-500">@{user?.username}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <p className="text-lg text-gray-800">{user?.fullName}</p>
              </div>

              {/* Username */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Username
                </label>
                <p className="text-lg text-gray-800">@{user?.username}</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <div className="flex items-center justify-between">
                <p className="text-lg text-gray-800">{user?.email}</p>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Member Since */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Member Since
              </label>
              <p className="text-lg text-gray-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>

            {/* Account Settings */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <span className="text-gray-800">Change Password</span>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <span className="text-gray-800">Notification Settings</span>
                  <span className="text-gray-400">→</span>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <span className="text-gray-800">Privacy Settings</span>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <div className="border-t pt-6 mt-6">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center space-x-2"
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
