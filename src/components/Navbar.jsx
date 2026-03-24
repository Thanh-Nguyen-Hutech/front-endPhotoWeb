import React, { useState, useRef, useEffect } from 'react';
import { Camera, Search, User, LogOut, PlusSquare, LayoutDashboard, ChevronDown, Clock, Calendar, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const fullName = localStorage.getItem('fullName') || "Người dùng";

  // Xử lý đóng dropdown khi bấm ra ngoài
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
          <span className="text-2xl font-black tracking-tighter text-white uppercase">PHOTONOW</span>
        </div>

        {/* MENU ĐIỀU HƯỚNG */}
        <div className="hidden lg:flex items-center gap-6 font-bold text-gray-400">
          <div onClick={() => navTo('/')} className="hover:text-photo-gold cursor-pointer text-[10px] uppercase tracking-widest transition-all">Nhiếp Ảnh Gia</div>
          
          <div onClick={() => navTo('/booking-list')} className="hover:text-photo-gold cursor-pointer text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
            <List size={14} /> Danh Sách Buổi Chụp
          </div>

          <div onClick={() => navTo('/book-now')} className="text-photo-gold hover:text-yellow-400 cursor-pointer text-[10px] uppercase tracking-widest transition-all flex items-center gap-2">
            <Calendar size={14} /> Đặt Lịch Ngay
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="hidden md:block flex-1 max-w-md mx-10 relative">
        <Search className="absolute left-4 top-2.5 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Tìm kiếm phong cách, thợ chụp..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:border-photo-gold/50 transition-all text-white text-xs" 
        />
      </div>

      <div className="flex items-center gap-3">
        {token ? (
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            
            {/* NÚT ĐĂNG BÀI (DÀNH CHO PHOTOGRAPHER) */}
            {userRole === 'Photographer' && (
              <div 
                onClick={() => navTo('/create-post')}
                className="hidden sm:flex items-center gap-2 bg-photo-gold text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-yellow-400 transition-all cursor-pointer shadow-lg shadow-photo-gold/20"
              >
                <PlusSquare size={16} /> Đăng bài
              </div>
            )}

            {/* AVATAR & DROPDOWN TRIGGER */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-photo-gold to-orange-500 p-[2px] transition-transform group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                  <User size={20} />
                </div>
              </div>
              <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* DROPDOWN MENU */}
            {showDropdown && (
              <div className="absolute top-14 right-0 w-60 bg-[#141414] border border-white/10 rounded-3xl shadow-2xl p-2 z-[1000] animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-4 border-b border-white/5 mb-1">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tài khoản</p>
                  <p className="text-xs font-black truncate text-photo-gold uppercase">{fullName}</p>
                </div>
                
                <div className="space-y-1">
                  {userRole === 'Photographer' && (
                    <div 
                      onClick={() => navTo('/dashboard')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold text-xs cursor-pointer"
                    >
                      <LayoutDashboard size={16} /> Bảng điều khiển
                    </div>
                  )}
                  
                  <div 
                    onClick={() => navTo('/booking-manager')}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold text-xs cursor-pointer"
                  >
                    <Clock size={16} /> {userRole === 'Photographer' ? 'Lịch đã nhận' : 'Lịch sử buổi chụp'}
                  </div>

                  <div 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs mt-2 cursor-pointer border border-red-500/10"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* PHẦN CHƯA ĐĂNG NHẬP */
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navTo('/login')} 
              className="text-gray-400 hover:text-white transition-all font-black text-[10px] uppercase px-4 py-2"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => navTo('/register')} 
              className="bg-photo-gold text-black px-5 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-yellow-400 transition-all shadow-lg shadow-photo-gold/20 active:scale-95"
            >
              Đăng ký
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;