'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiUser, 
  FiMail, 
  FiShield, 
  FiCalendar,
  FiKey,
  FiSave
} from 'react-icons/fi';
import LayoutWrapper from '../components/Layout/LayoutWrapper';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

export default function ProfilePage() {
  const { user, refreshUser , loading: authLoading} = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

 
   useEffect(() => {
      if (!authLoading && !user) {
        router.push('/login');
      }
    }, [user, authLoading, router]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('Profile updated successfully');
        await refreshUser();
        setIsEditing(false);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user?.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <LayoutWrapper>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          </div>
          
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e:any) => setFormData({ ...formData, name: e.target.value })}
                  icon={FiUser}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e:any) => setFormData({ ...formData, email: e.target.value })}
                  icon={FiMail}
                  required
                />
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={loading}
                    leftIcon={FiSave}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name,
                        email: user.email
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-semibold text-primary-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <FiShield className="h-4 w-4" />
                      <span>Role</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {user.role === 'ADMIN' ? 'Administrator' : 'Operations User'}
                    </p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <FiCalendar className="h-4 w-4" />
                      <span>Member Since</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {new Date().toLocaleDateString()} 
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Change Password</h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                isPassword
                value={passwordData.currentPassword}
                onChange={(e:any) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                icon={FiKey}
                required
              />
              <Input
                label="New Password"
                type="password"
                isPassword
                value={passwordData.newPassword}
                onChange={(e:any) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                icon={FiKey}
                required
                helperText="Minimum 6 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                isPassword
                value={passwordData.confirmPassword}
                onChange={(e:any) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                icon={FiKey}
                required
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}