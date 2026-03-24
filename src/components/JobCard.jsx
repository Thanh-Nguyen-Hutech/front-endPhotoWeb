import React from 'react';
import { User, MapPin, Users } from 'lucide-react';

const JobCard = ({ job, onAccept }) => {
  // Kiểm tra xem job này còn trống không (Pending / ĐANG TÌM NAG)
  const isPending = job.status === 'Pending' || job.status === 'ĐANG TÌM NAG';

  return (
    <div className="glass p-6 md:p-8 rounded-2xl border-l-4 border-l-photo-gold hover:bg-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h3 className="text-xl md:text-2xl font-black text-white mb-3 uppercase tracking-wide">
          {job.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1"><User size={16} className="text-photo-gold" /> {job.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><MapPin size={16} className="text-photo-gold" /> {job.location}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Users size={16} className="text-photo-gold" /> {job.type}</span>
        </div>
        
        <p className="text-photo-gold font-black text-xl md:text-2xl">
          {job.price}
        </p>
      </div>

      <div className="w-full md:w-auto text-right">
        {isPending ? (
          // Nếu đang Pending thì hiện Nút bấm
          <button 
            onClick={() => onAccept(job.id)}
            className="bg-photo-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] transition-all active:scale-95"
          >
            NHẬN JOB
          </button>
        ) : (
          // Nếu đã có người nhận rồi thì hiện chữ mờ đi
          <span className="inline-block bg-gray-500/20 text-gray-400 px-5 py-2.5 rounded-full text-sm font-bold tracking-wider border border-gray-500/30">
            {job.status}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;