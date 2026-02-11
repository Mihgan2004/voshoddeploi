
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { catalogApi } from '../data/catalogApi';
import { useToast } from './ui/Toast';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSignOut = async () => {
    await catalogApi.signOut();
    addToast('Signed out', 'info');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0D10] flex text-[#9FA3B0]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col fixed h-full bg-[#0B0D10] z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-white font-bold tracking-widest uppercase">Admin Panel</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          <NavItem to="/admin" end>Dashboard</NavItem>
          <NavItem to="/admin/products">Products</NavItem>
          <NavItem to="/admin/collections">Collections</NavItem>
        </nav>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <a href="/" target="_blank" className="text-xs uppercase hover:text-white px-3 py-2 transition-colors">
            View Storefront &rarr;
          </a>
          <button onClick={handleSignOut} className="text-left text-xs uppercase hover:text-red-400 px-3 py-2 transition-colors text-red-500/70">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ to: string; end?: boolean; children: React.ReactNode }> = ({ to, end, children }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `
      px-3 py-2 text-sm font-medium transition-colors border-l-2
      ${isActive ? 'bg-white/5 text-white border-[#C6902E]' : 'border-transparent hover:bg-white/5 hover:text-white'}
    `}
  >
    {children}
  </NavLink>
);
