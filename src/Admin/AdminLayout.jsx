import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, FileText, BarChart3, ShieldAlert, LogOut, LayoutDashboard } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#050A15] text-white font-sans overflow-hidden">
      {/* Sidebar Admin */}
      <aside className="w-72 border-r border-white/5 bg-[#0F172A]/50 backdrop-blur-xl p-8 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.3)]">
        
        {/* Logo Section - Sử dụng navigate để về Dashboard */}
        <div 
          className="flex items-center gap-3 mb-12 group cursor-pointer" 
          onClick={() => navigate('/admin/dashboard')}
        >
          <div className="p-2.5 bg-[#BDE8F5] rounded-xl shadow-[0_0_20px_rgba(189,232,245,0.3)] group-hover:scale-110 transition-transform">
            <LayoutDashboard size={20} className="text-[#0F172A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-none">FOTOZ</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#BDE8F5] uppercase">Dashboard</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-3 flex-1">
          <AdminLink icon={<BarChart3 size={20}/>} label="Thống kê" path="/admin/dashboard" />
          <AdminLink icon={<Users size={20}/>} label="Người dùng" path="/admin/users" />
          <AdminLink icon={<FileText size={20}/>} label="Bài đăng" path="/admin/posts" />
          <AdminLink icon={<ShieldAlert size={20}/>} label="Báo cáo lỗi" path="/admin/reports" />
        </nav>

        {/* Nút Đăng xuất */}
        <button 
          onClick={() => { 
            localStorage.clear(); 
            navigate('/login'); // Sửa window.location.href thành navigate để mượt hơn
          }}
          className="group flex items-center gap-3 text-gray-500 font-bold text-sm p-4 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-all mt-auto border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Đăng xuất Admin
        </button>
      </aside>

      {/* Content Area */}
      <main className="relative flex-1 p-10 overflow-y-auto">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#BDE8F5]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

/* Component phụ cho các link trong Sidebar */
const AdminLink = ({ icon, label, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Kiểm tra đường dẫn hiện tại để kích hoạt trạng thái Active
  const isSelected = location.pathname === path;

  return (
    <button 
      onClick={() => navigate(path)} // Sử dụng navigate thay cho thẻ <a>
      className={`
        w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all duration-300
        ${isSelected 
          ? 'bg-[#BDE8F5] text-[#0F172A] shadow-[0_10px_25px_rgba(189,232,245,0.2)] scale-[1.02]' 
          : 'text-white/40 hover:text-white hover:bg-white/5 hover:translate-x-2'
        }
      `}
    >
      <span className={`${isSelected ? 'text-[#0F172A]' : 'text-[#BDE8F5]/60'}`}>
        {icon}
      </span>
      {label}
    </button>
  );
};

export default AdminLayout;