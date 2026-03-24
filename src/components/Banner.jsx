import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Thêm cái này

const Banner = () => {
  const navigate = useNavigate(); // 2. Khai báo hàm chuyển trang

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 p-10 md:p-16 mt-6 mb-12 flex flex-col md:flex-row items-center justify-between">
      {/* ... (Giữ nguyên các phần div hiệu ứng ánh sáng và text) ... */}
      
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
          Lưu giữ khoảnh khắc
        </h1>
        <h2 className="text-5xl md:text-7xl font-black text-photo-gold mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">
          CÙNG FOTOZ
        </h2>
        <p className="text-gray-400 text-lg mb-8 font-medium">
          Nền tảng kết nối nhiếp ảnh gia chuyên nghiệp hàng đầu Việt Nam.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 3. Gắn onClick vào nút ĐẶT LỊCH NGAY để chuyển sang trang Danh sách */}
          <button 
            onClick={() => navigate('/booking-list')} 
            className="bg-photo-gold text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all flex items-center justify-center gap-2"
          >
            ĐẶT LỊCH NGAY <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="bg-white/5 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            XEM THỢ CHỤP
          </button>
        </div>
      </div>
      
      {/* ... (Giữ nguyên phần hình ảnh minh họa bên phải) ... */}
    </div>
  );
};

export default Banner;