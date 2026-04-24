import React from 'react';
import { MapPin, Tag, User, CheckCircle } from 'lucide-react';

const JobCard = ({ job, onAccept }) => {
  return (
    <div className="glass p-6 rounded-[32px] border border-white/5 hover:border-photo-gold/30 transition-all group flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
      <div className="flex-1 space-y-4 w-full">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-photo-gold/10 flex items-center justify-center text-photo-gold border border-photo-gold/20 font-black">
            {job.author?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-black text-white group-hover:text-photo-gold transition-colors uppercase italic tracking-tighter">
              {job.title}
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <User size={12}/> {job.author}
            </p>
          </div>
        </div>
//fhfgssf
        <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <MapPin size={14} className="text-photo-gold"/> {job.location}
          </span>
          <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <Tag size={14} className="text-photo-gold"/> {job.type}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-4 w-full md:w-auto min-w-[200px]">
        <p className="text-xl font-black text-photo-gold tracking-tighter italic">
          {job.price}
        </p>
        
        {/* ✅ NÚT NHẬN JOB: Luôn hiển thị cho thợ ảnh */}
        <button 
          onClick={() => onAccept(job.id)}
          className="w-full md:w-auto bg-photo-gold text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-400 transition-all shadow-lg shadow-photo-gold/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle size={16} /> Nhận buổi chụp
        </button>
      </div>
    </div>
  );
};

export default JobCard;