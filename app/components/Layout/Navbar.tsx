'use client';

import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const Navbar = ({ setSidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user?.name) return 'User';
    return user.name;
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!user?.role) return 'User';
    return user.role === 'ADMIN' ? 'Administrator' : 'Operations User';
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Mock notifications (replace with real notifications later)
  const notifications = [
    { id: 1, message: 'New project assigned to you', time: '5 min ago', read: false },
    { id: 2, message: 'Project "Website Redesign" is due tomorrow', time: '1 hour ago', read: false },
    { id: 3, message: 'Your project was completed', time: '2 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Menu button for mobile */}
          <div className="flex items-center">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 hover:text-gray-900 md:hidden transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            {/* Page title or breadcrumbs can go here */}
            <div className="hidden md:block ml-4">
              <h2 className="text-lg font-semibold text-gray-800">Operations Portal</h2>
            </div>
          </div>

          {/* Right side - Actions and User menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notifications"
              >
                <FiBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                aria-label="User menu"
              >
                <div className="w-8 h-8 bg-gradient-to-br  from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium dark:text-gray-800 text-sm">
                    {getUserInitials()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{getUserDisplayName()}</p>
                  <p className="text-xs text-gray-500">{getRoleDisplay()}</p>
                </div>
                <FiChevronDown className={`hidden md:block h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  showUserMenu ? 'transform rotate-180' : ''
                }`} />
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 md:hidden">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{getRoleDisplay()}</p>
                  </div>
                  
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Your Profile
                  </a>
                  
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Settings
                  </a>
                  
                  <div className="border-t border-gray-200 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;