import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, User, LogOut, PlusSquare, 
  LayoutDashboard, ChevronDown, Clock, 
  Calendar, List, ShieldAlert 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role')?.toLowerCase();
  
  // ✅ Xử lý tên siêu chặt chẽ
  let rawName = localStorage.getItem('fullName');
  const fullName = (rawName && rawName !== 'undefined' && rawName !== 'null' && rawName.trim() !== '') 
                    ? rawName 
                    : "Người dùng";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  const navTo = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 w-full z-[999] glass px-6 py-3 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-8">
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navTo('/')}>
          <Camera className="text-photo-gold" size={32} />
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">FOTOZ</span>
        </div>

        {/* MENU TRÁI (Ẩn khi là Admin để tránh nhầm lẫn) */}
        {userRole !== 'admin' && (
          <div className="hidden lg:flex items-center gap-6 font-bold text-gray-400">
            <div onClick={() => navTo('/booking-list')} className="hover:text-photo-gold cursor-pointer text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
              <List size={14} /> {userRole === 'photographer' ? 'Danh Sách Buổi Chụp' : 'Tìm Thợ Ảnh'}
            </div>
            <div onClick={() => navTo('/book-now')} className="text-photo-gold hover:text-yellow-400 cursor-pointer text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
              <Calendar size={14} /> Đặt Lịch Ngay
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {token ? (
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            
            {/* NÚT TÁC VỤ NHANH CHO PHOTOGRAPHER */}
            {userRole === 'photographer' && (
              <button onClick={() => navTo('/create-post')} className="flex items-center gap-2 bg-photo-gold text-black px-4 py-2.5 rounded-2xl font-black text-[10px] uppercase hover:bg-yellow-400 transition-all cursor-pointer shadow-lg active:scale-95 group">
                <PlusSquare size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline font-black">Đăng bài</span>
              </button>
            )}

            {/* AVATAR & DROPDOWN CONTROL */}
            <div className="flex items-center gap-2 cursor-pointer group p-1" onClick={() => setShowDropdown(!showDropdown)}>
              <div className={`w-10 h-10 rounded-full p-[2px] transition-transform group-hover:scale-105 shadow-lg ${userRole === 'admin' ? 'bg-gradient-to-tr from-red-500 to-orange-500' : 'bg-gradient-to-tr from-photo-gold to-orange-500'}`}>
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white border-2 border-black overflow-hidden">
                  <User size={20} className={userRole === 'admin' ? 'text-red-500' : 'text-photo-gold'} />
                </div>
              </div>
              <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* DROPDOWN MENU */}
            {showDropdown && (
              <div className="absolute top-14 right-0 w-64 bg-[#141414] border border-white/10 rounded-3xl shadow-2xl p-2 z-[1000] animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-4 border-b border-white/5 mb-1">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tài khoản</p>
                  <p className={`text-xs font-black truncate uppercase italic ${userRole === 'admin' ? 'text-red-500' : 'text-photo-gold'}`}>
                    {fullName} {userRole === 'admin' && '(ADMIN)'}
                  </p>
                </div>

                <div className="space-y-1">
                  {/* DÀNH CHO ADMIN */}
                  {userRole === 'admin' && (
                    <div onClick={() => navTo('/admin/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-xs cursor-pointer border border-red-500/20">
                      <ShieldAlert size={16} /> QUẢN TRỊ HỆ THỐNG
                    </div>
                  )}

                  {/* DÀNH CHO PHOTOGRAPHER */}
                  {userRole === 'photographer' && (
                    <>
                      <div onClick={() => navTo('/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold text-xs cursor-pointer">
                        <LayoutDashboard size={16} /> Bảng điều khiển
                      </div>
                      <div onClick={() => navTo('/booking-manager')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold text-xs cursor-pointer">
                        <Clock size={16} /> Lịch đã nhận
                      </div>
                    </>
                  )}

                  {/* DÀNH CHO CUSTOMER */}
                  {userRole === 'customer' && (
                    <div onClick={() => navTo('/my-history')} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold text-xs cursor-pointer">
                      <Clock size={16} /> Lịch sử buổi chụp
                    </div>
                  )}

                  {/* CHUNG: ĐĂNG XUẤT */}
                  <div onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs mt-2 cursor-pointer border border-red-500/10">
                    <LogOut size={16} /> Đăng xuất
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => navTo('/login')} className="text-gray-400 hover:text-white transition-all font-black text-[10px] uppercase px-4">Đăng nhập</button>
            <button onClick={() => navTo('/register')} className="bg-photo-gold text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-yellow-400 transition-all shadow-lg active:scale-95">Đăng ký</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;