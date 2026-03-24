import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Users, FileText, BarChart3, ShieldAlert, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] p-6 space-y-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-photo-gold rounded-lg"></div>
          <span className="text-xl font-black tracking-tighter uppercase italic">FOTOZ ADMIN</span>
        </div>

        <nav className="space-y-2">
          <AdminLink icon={<BarChart3 size={20}/>} label="Thống kê" path="/admin/dashboard" />
          <AdminLink icon={<Users size={20}/>} label="Người dùng" path="/admin/users" />
          <AdminLink icon={<FileText size={20}/>} label="Bài đăng" path="/admin/posts" />
          <AdminLink icon={<ShieldAlert size={20}/>} label="Báo cáo lỗi" path="/admin/reports" />
        </nav>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex items-center gap-3 text-red-500 font-bold text-sm mt-20 hover:bg-red-500/10 w-full p-3 rounded-xl transition-all"
        >
          <LogOut size={20}/> Đăng xuất Admin
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const AdminLink = ({ icon, label, path }) => {
  const isSelected = window.location.pathname === path;
  return (
    <a href={path} className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${isSelected ? 'bg-photo-gold text-black shadow-lg shadow-photo-gold/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon} {label}
    </a>
  );
};

export default AdminLayout;