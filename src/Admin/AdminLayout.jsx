import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, FileText, BarChart3, ShieldAlert, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] p-6 flex flex-col justify-between">
        
        <div>
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-photo-gold rounded-lg shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-white">FOTOZ <span className="text-photo-gold">ADMIN</span></span>
          </div>

          <nav className="space-y-2">
            <AdminLink 
              icon={<BarChart3 size={20}/>} 
              label="Thống kê" 
              path="/admin/dashboard" 
              currentPath={location.pathname} 
              navigate={navigate} 
            />
            <AdminLink 
              icon={<Users size={20}/>} 
              label="Người dùng" 
              path="/admin/users" 
              currentPath={location.pathname} 
              navigate={navigate} 
            />
            <AdminLink 
              icon={<FileText size={20}/>} 
              label="Bài đăng" 
              path="/admin/posts" 
              currentPath={location.pathname} 
              navigate={navigate} 
            />
            <AdminLink 
              icon={<ShieldAlert size={20}/>} 
              label="Báo cáo lỗi" 
              path="/admin/reports" 
              currentPath={location.pathname} 
              navigate={navigate} 
            />
          </nav>
        </div>

        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex items-center gap-3 text-red-500 font-bold text-sm hover:bg-red-500/10 w-full p-4 rounded-2xl transition-all"
        >
          <LogOut size={20}/> Đăng xuất Admin
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-10 h-screen overflow-y-auto custom-scrollbar">
        {/* Nơi hiển thị ManageUsers, ManagePosts, Dashboard... */}
        <Outlet />
      </main>
    </div>
  );
};

// Đã cập nhật: Thay thẻ <a> bằng thẻ <button> để dùng navigate (chuyển trang mượt không cần reload)
const AdminLink = ({ icon, label, path, currentPath, navigate }) => {
  const isSelected = currentPath === path;
  
  return (
    <button 
      onClick={() => navigate(path)} 
      className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${
        isSelected 
          ? 'bg-photo-gold text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]' 
          : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );
};

export default AdminLayout;