// src/components/Layout.tsx
import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, Users, Clock, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { staffApi } from '../lib/api';
import { useFCM } from '../hooks/useFCM';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => staffApi.getProfile(),
  });

  const { notificationCount, clearNotifications } = useFCM();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    {
      id: 'employees',
      label: 'Kelola Karyawan',
      icon: Users,
      path: '/employees',
    },
    {
      id: 'attendance',
      label: 'Monitoring Absensi',
      icon: Clock,
      path: '/attendance',
    },
  ];

  const activeMenu = menuItems.find((item) => item.path === location.pathname)?.id || 'dashboard';

  const MenuItem = ({ item }: { item: (typeof menuItems)[0] }) => (
    <button
      onClick={() => {
        navigate(item.path);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeMenu === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WFH</span>
              </div>
              <span className="text-white font-semibold">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {profile?.data.name?.charAt(0) || 'HR'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {profile?.data.name || 'Admin HRD'}
                </p>
                <p className="text-gray-400 text-xs">
                  {profile?.data.email || 'admin@company.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            {menuItems.find((item) => item.id === activeMenu)?.label || 'Dashboard'}
          </h1>

          <button
            onClick={clearNotifications}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
