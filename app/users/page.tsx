'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiUser,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import LayoutWrapper from '../components/Layout/LayoutWrapper';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Select from '../components/UI/Select';
import Input from '../components/UI/Input';


interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: string;
  _count?: {
    createdProjects: number;
    assignedProjects: number;
  };
}

export default function UsersPage() {
  const { user: currentUser ,loading:authLoading } = useAuth();
  const router = useRouter();

  
   useEffect(() => {
      if (!authLoading && !currentUser) {
        router.push('/login');
      }
    }, [currentUser, authLoading, router]);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.push('/dashboard');
      toast.error('Access denied. Admin only.');
    }
  }, [currentUser, router]);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
    isActive: true
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users`, {
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 403) {
          router.push('/dashboard');
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = selectedUser 
        ? `${baseUrl}/api/users/${selectedUser.id}`
        : `${baseUrl}/api/users`;
      
      const method = selectedUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (res.ok) {
        toast.success(selectedUser ? 'User updated' : 'User created');
        setShowUserModal(false);
        setSelectedUser(null);
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'USER',
          isActive: true
        });
        fetchUsers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`${baseUrl}/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
        credentials: 'include'
      });

      if (res.ok) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchUsers();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null;
  }

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage users, roles, and permissions</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedUser(null);
              setFormData({
                name: '',
                email: '',
                password: '',
                role: 'USER',
                isActive: true
              });
              setShowUserModal(true);
            }}
            leftIcon={FiPlus}
          >
            Add New User
          </Button>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className={`bg-white rounded-lg shadow overflow-hidden ${
                  !user.isActive ? 'opacity-75 bg-gray-50' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-primary-100 text-primary-600'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          user.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.isActive ? <FiUserCheck className="h-5 w-5" /> : <FiUserX className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            name: user.name,
                            email: user.email,
                            password: '',
                            role: user.role,
                            isActive: user.isActive
                          });
                          setShowUserModal(true);
                        }}
                        className="p-1 text-blue-600 rounded hover:bg-blue-50"
                        title="Edit user"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-red-600 rounded hover:bg-red-50"
                          title="Delete user"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FiShield className="text-gray-400" />
                      <span className="text-gray-600">Role:</span>
                      <span className={`font-medium ${
                        user.role === 'ADMIN' ? 'text-purple-600' : 'text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiCalendar className="text-gray-400" />
                      <span className="text-gray-600">Joined:</span>
                      <span className="text-gray-700">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiMail className="text-gray-400" />
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {user._count && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-center text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">{user._count.createdProjects}</div>
                        <div className="text-gray-500">Created</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user._count.assignedProjects}</div>
                        <div className="text-gray-500">Assigned</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? 'Edit User' : 'Create New User'}
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e:any) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e:any) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
            icon={FiMail}
          />

          {!selectedUser && (
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e:any) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
              helperText="Minimum 6 characters"
            />
          )}

          <Select
            label="Role"
            options={[
              { value: 'USER', label: 'Operations User' },
              { value: 'ADMIN', label: 'Administrator' }
            ]}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'USER' })}
          />

          {selectedUser && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Account is active
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUserModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {selectedUser ? 'Update' : 'Create'} User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? 
            This action cannot be undone and will remove all associated data.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </LayoutWrapper>
  );
}