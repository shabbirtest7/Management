
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  FiHome, 
  FiFolder, 
  FiUsers, 
  FiActivity,
  FiLogOut,
  FiUser,
  FiBarChart2
} from 'react-icons/fi';

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Projects', href: '/projects', icon: FiFolder },
    ...(user?.role === 'ADMIN' ? [{ name: 'Users', href: '/users', icon: FiUsers }] : []),
    { name: 'Activity', href: '/activity', icon: FiActivity },
    { name: 'Profile', href: '/profile', icon: FiUser },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <FiBarChart2 className="h-8 w-8 text-black mr-2" />
            <h1 className="text-xl font-bold text-black">OpsPortal</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-gray-500 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href)
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button
            onClick={logout}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 w-full"
          >
            <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;