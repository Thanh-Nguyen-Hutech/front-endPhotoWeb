import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 p-10 md:p-16 mt-6 mb-12 flex flex-col md:flex-row items-center justify-between">
      
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
          Lưu giữ khoảnh khắc
        </h1>
        <h2 className="text-5xl md:text-7xl font-black text-[#BDE8F5] mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(189,232,245,0.3)]">
          CÙNG FOTOZ
        </h2>
        <p className="text-gray-400 text-lg mb-8 font-medium">
          Nền tảng kết nối nhiếp ảnh gia chuyên nghiệp hàng đầu Việt Nam.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* NÚT CHÍNH: Đổi sang màu #BDE8F5 với hiệu ứng Highlight chuyên nghiệp */}
          <button 
            onClick={() => navigate('/booking-list')} 
            className="group relative bg-[#BDE8F5] text-[#0F2854] px-8 py-4 rounded-xl font-bold 
                       transition-all duration-300 ease-out
                       hover:bg-white hover:shadow-[0_0_30px_rgba(189,232,245,0.5)] 
                       active:scale-95 active:brightness-110
                       flex items-center justify-center gap-2 overflow-hidden"
          >
            {/* Hiệu ứng lớp phủ sáng khi bấm */}
            <span className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></span>
            
            <span className="relative z-10 flex items-center gap-2">
              ĐẶT LỊCH NGAY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="bg-white/5 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold 
                       hover:bg-white/10 active:scale-95 transition-all"
          >
            XEM THỢ CHỤP
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Banner;