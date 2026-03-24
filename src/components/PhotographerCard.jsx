import React from 'react';
import { MapPin, Star, MessageCircle, CheckCircle, Camera } from 'lucide-react';

const PhotographerCard = ({ photographer, onClick }) => {
  
  const handleContact = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click vào thẻ
    const phone = photographer.phoneNumber || "Chưa cập nhật";
    alert(`📞 Liên hệ với ${photographer.fullName}:\nSố điện thoại: ${phone}`);
  };

  return (
    <div 
      onClick={onClick}
      className="glass rounded-[32px] overflow-hidden group cursor-pointer border border-white/5 hover:border-photo-gold/40 transition-all duration-500 shadow-2xl flex flex-col h-full bg-white/[0.02]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
        <img 
          src={photographer.avatar || "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop"} 
          alt={photographer.fullName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
          <Star size={12} className="text-photo-gold fill-photo-gold" />
          <span className="text-[10px] font-black text-white italic">{photographer.rating || "5.0"}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-white font-black text-lg uppercase tracking-tighter group-hover:text-photo-gold transition-colors truncate">
            {photographer.fullName}
          </h3>
          <CheckCircle size={16} className="text-blue-400 shrink-0" />
        </div>
        
        <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 italic">
          Professional Artist
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin size={14} className="text-photo-gold" />
            <span className="text-xs font-bold">{photographer.location || "Toàn quốc"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <Camera size={14} className="text-photo-gold" />
            <span className="text-xs font-bold text-white uppercase tracking-tighter">
                {photographer.basePrice?.toLocaleString()} ₫ <span className="text-[10px] text-gray-500">/ buổi</span>
            </span>
          </div>
        </div>

        {/* ✅ CỤM NÚT HÀNH ĐỘNG DÀNH CHO KHÁCH */}
        <div className="mt-auto grid grid-cols-2 gap-2">
            <button className="py-3 bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-white/10 transition-all">
              Portfolio
            </button>
            <button 
              onClick={handleContact}
              className="py-3 bg-photo-gold text-black font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-1"
            >
              <MessageCircle size={14} /> Liên hệ
            </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;