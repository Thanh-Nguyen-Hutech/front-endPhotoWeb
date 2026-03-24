import React from 'react';
import { Star } from 'lucide-react';

const PhotographerCard = ({ photographer }) => {
  return (
    <div className="glass rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
      {/* Phần Ảnh */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={photographer.imageUrl} 
          alt={photographer.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Badge đánh giá sao */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
          <Star size={14} className="text-photo-gold fill-photo-gold" />
          <span className="text-white text-sm font-bold">{photographer.rating}</span>
        </div>
      </div>

      {/* Phần Thông tin */}
      <div className="p-5 bg-white/5">
        <h3 className="text-xl font-bold text-white mb-1">{photographer.name}</h3>
        <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-4">
          {photographer.styles}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <span className="text-sm text-gray-400 block">Bắt đầu từ</span>
            <span className="text-photo-gold font-bold">{photographer.price}</span>
          </div>
          <button className="bg-white/10 hover:bg-photo-gold hover:text-black text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Chọn thợ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;