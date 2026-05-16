import React from 'react';
import { MapPin, Star, Heart, DollarSign, MessageCircle } from 'lucide-react'; 

const PhotographerCard = ({ photographer, onClick }) => {
  
  const handleContact = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click vào thẻ chuyển trang
    const phone = photographer.phoneNumber || "Chưa cập nhật";
    alert(`📞 Liên hệ với ${photographer.fullName}:\nSố điện thoại: ${phone}`);
  };

  return (
    <div 
      onClick={onClick} 
      className="bg-[#0F172A]/40 backdrop-blur-xl rounded-[32px] border border-white/5 cursor-pointer hover:border-[#BDE8F5]/30 group transition-all duration-300 hover:shadow-[0_0_40px_rgba(189,232,245,0.15)] flex flex-col h-full overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)]"
    >
      {/* 1. KHUNG TRÊN: ẢNH BÌA */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900 shrink-0">
        <img 
          src={photographer.avatar || "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop"} 
          alt={photographer.fullName} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        {/* Điểm đánh giá đè lên góc phải ảnh */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
          <Star size={12} className="text-[#BDE8F5] fill-[#BDE8F5]" />
          <span className="text-[10px] font-black text-white">{(photographer.rating || 5).toFixed(1)}</span>
        </div>
      </div>

      {/* 2. KHUNG DƯỚI: AVATAR & THÔNG TIN */}
      <div className="p-6 flex flex-col flex-grow bg-white/[0.02]">
        
        {/* Avatar & Tên thợ ảnh */}
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 rounded-full border-2 border-[#1E293B] overflow-hidden bg-black shrink-0 shadow-lg">
              <img 
                src={photographer.avatar || "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop"} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
           </div>
           <div className="flex flex-col min-w-0">
             <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#BDE8F5] transition-colors truncate italic">
               {photographer.fullName || "NAG Fotoz"}
             </h3>
             <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
               Professional Artist
             </span>
           </div>
        </div>

        {/* Các thẻ Tags: Vị trí & Giá tiền */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 text-[10px] text-[#BDE8F5] bg-[#BDE8F5]/10 px-2.5 py-1.5 rounded-full font-bold uppercase tracking-wider border border-[#BDE8F5]/20">
            <MapPin size={12} /> {photographer.location || "Toàn quốc"}
          </span>
          {photographer.basePrice > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2.5 py-1.5 rounded-full font-bold uppercase tracking-wider border border-green-400/20">
              <DollarSign size={12} /> {photographer.basePrice.toLocaleString()}₫
            </span>
          )}
        </div>

        {/* Đoạn giới thiệu ngắn */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-6 font-medium leading-relaxed">
          {photographer.bio || "Nhiếp ảnh gia chuyên nghiệp, nhiệt tình, mang đến những khung hình xuất sắc nhất cho bạn."}
        </p>

        {/* THANH HÀNH ĐỘNG CUỐI THẺ */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <button 
            onClick={(e) => { e.stopPropagation(); /* Bạn có thể làm chức năng Yêu thích ở đây */ }}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Heart size={16} className="group-hover:stroke-red-400 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Yêu thích</span>
          </button>

          {/* Nút Liên hệ giữ nguyên logic cũ */}
          <button 
            onClick={handleContact}
            className="flex items-center gap-2 text-[#BDE8F5] hover:text-white transition-colors bg-[#BDE8F5]/10 hover:bg-[#BDE8F5]/20 px-3 py-1.5 rounded-lg"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Liên hệ</span>
            <MessageCircle size={16} />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default PhotographerCard;