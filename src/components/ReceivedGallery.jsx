import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Lock, Download, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const ReceivedGallery = ({ bookingId }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError('');

    try {
      // API C# thường yêu cầu string body phải bọc trong dấu ngoặc kép hoặc dùng object
      const res = await axiosClient.post(`/Gallery/${bookingId}/verify`, `"${password}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setPhotos(res.data.photos || []);
      setIsUnlocked(true);
    } catch (err) {
      setError('Mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, index) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `FOTOZ_Photo_${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Không thể tải ảnh. Vui lòng thử lại sau.");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 glass rounded-[32px] border border-white/10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-photo-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-photo-gold/20 shadow-inner">
          <Lock className="text-photo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Quyền truy cập ảnh</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Nhập mã bảo mật từ Photographer</p>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-4 text-center text-photo-gold text-2xl tracking-[0.5em] font-black focus:border-photo-gold focus:ring-1 focus:ring-photo-gold outline-none transition-all"
            maxLength={6}
          />
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-[10px] font-bold uppercase">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || password.length < 3}
            className="w-full bg-photo-gold text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-photo-gold/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : 'Mở Khóa Album'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 bg-white/5 p-8 rounded-[32px] border border-white/5">
        <div>
          <div className="flex items-center gap-3 text-green-400 mb-2">
            <CheckCircle size={28} />
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Album hoàn tất</h2>
          </div>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1">
            Đã sẵn sàng tải xuống: <span className="text-photo-gold">{photos.length} hình ảnh</span>
          </p>
        </div>
        <p className="text-[11px] text-gray-500 italic max-w-[200px] text-right">
          Mẹo: Nhấn vào biểu tượng tải xuống để lưu ảnh chất lượng gốc.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((url, idx) => (
          <div key={idx} className="group relative rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 aspect-[3/4] shadow-2xl transition-transform duration-500 hover:-translate-y-2">
            <img src={url} alt="Gallery" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-30" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button 
                onClick={() => handleDownload(url, idx)}
                className="bg-photo-gold text-black p-5 rounded-full hover:scale-110 active:scale-90 transition-transform shadow-2xl shadow-photo-gold/40"
              >
                <Download size={28} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedGallery;