import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
// 🌟 ĐÃ FIX LỖI IMPORT: Thêm XCircle vào danh sách gọi ra từ lucide-react
import { Lock, Download, CheckCircle, Loader2, AlertCircle, Maximize2, X, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ReceivedGallery = ({ bookingId }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State quản lý ảnh đang được phóng to
  const [previewIndex, setPreviewIndex] = useState(null); 

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await axiosClient.post(`/Gallery/${bookingId}/verify`, `"${password}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = res.data !== undefined ? res.data : res;
      setPhotos(data.photos || data.Photos || []);
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

  // Hàm phụ trợ để chuẩn hóa link ảnh
  const getSafeUrl = (item) => {
    if (!item) return "";
    let rawUrl = typeof item === 'string' ? item : (item.url || item.imageUrl || "");
    return rawUrl.replace("http://", "https://");
  };

  // Hàm xử lý chuyển ảnh trái/phải trong chế độ xem trước
  const nextPreview = () => {
    if (previewIndex !== null && previewIndex < photos.length - 1) {
      setPreviewIndex(prev => prev + 1);
    }
  };

  const prevPreview = () => {
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(prev => prev - 1);
    }
  };

  // Hỗ trợ phím tắt (Trái, Phải, ESC) để thao tác nhanh hơn
  useEffect(() => {
    if (previewIndex === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPreview();
      else if (e.key === 'ArrowLeft') prevPreview();
      else if (e.key === 'Escape') setPreviewIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewIndex]);

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 glass rounded-[32px] border border-white/10 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-photo-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-photo-gold/20 shadow-inner">
          <Lock className="text-photo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Quyền truy cập ảnh</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Nhập mã bảo mật từ Photographer</p>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value.toUpperCase())}
            placeholder="••••••"
            className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-4 text-center text-photo-gold text-2xl tracking-[0.5em] font-black focus:border-photo-gold focus:ring-1 focus:ring-photo-gold outline-none transition-all placeholder:text-gray-600 placeholder:font-sans placeholder:tracking-normal placeholder:text-base"
            maxLength={6}
          />
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-[10px] font-bold uppercase bg-red-500/10 p-2.5 rounded-full">
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
    <div className="w-full animate-in fade-in duration-700">
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
          Mẹo: Nhấn vào biểu tượng lúp để xem trước, sau đó nhấn Tải Xuống.
        </p>
      </div>

      {/* LƯỚI ẢNH GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {photos.map((item, idx) => {
          const safeUrl = getSafeUrl(item);

          return (
            <div key={idx} className="group relative rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-900 aspect-[3/4] shadow-2xl transition-transform duration-500 hover:-translate-y-2 cursor-pointer"
                 onClick={() => setPreviewIndex(idx)}
            >
              <img 
                src={safeUrl} 
                alt="Gallery" 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-30" 
                loading="lazy" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=Lỗi+Ảnh"; }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button className="bg-photo-gold text-black p-5 rounded-full hover:scale-110 active:scale-90 transition-transform shadow-2xl shadow-photo-gold/40 flex items-center justify-center gap-2">
                  <Maximize2 size={24} />
                  <span className="font-black text-xs uppercase tracking-widest">Phóng to</span>
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm p-2.5 rounded-lg border border-white/10">
                <p className="text-[9px] text-photo-gold font-black uppercase tracking-widest">FOTOZ_{idx+1}.jpg</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🌟 GIAO DIỆN XEM TRƯỚC (PREVIEW MODAL) - HOÀN HẢO 🌟 */}
      {previewIndex !== null && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col bg-black/95 animate-in fade-in zoom-in-95 duration-300"
          onClick={() => setPreviewIndex(null)} // Click ra ngoài ảnh để đóng
        >
          {/* NÚT ĐÓNG TUYỆT ĐỐI GÓC PHẢI TRÊN */}
          <button 
            onClick={() => setPreviewIndex(null)} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 text-white/70 hover:text-white bg-white/10 hover:bg-red-500 px-4 py-2 sm:py-2.5 rounded-full transition-all z-[10000] border border-white/20 shadow-xl"
            title="Đóng cửa sổ này"
          >
            <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Đóng</span>
            {/* Dùng icon X cơ bản cho an toàn và gọn gàng */}
            <X size={20} strokeWidth={3} />
          </button>

          {/* VÙNG CHỨA ẢNH CHÍNH */}
          <div className="flex-1 min-h-0 w-full flex items-center justify-center relative p-4 sm:p-12 mt-12 sm:mt-0">
            {/* Nút lùi ảnh */}
            {previewIndex > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); prevPreview(); }} 
                className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#FACC15] text-white hover:text-black p-3 sm:p-4 rounded-full transition-all z-[10000] border border-white/20 shadow-xl"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Ảnh Phóng To */}
            <img 
              src={getSafeUrl(photos[previewIndex])} 
              alt="Preview Zoom" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(250,195,33,0.15)]"
              onClick={(e) => e.stopPropagation()} // Chặn click vào ảnh bị tắt
            />

            {/* Nút tiến ảnh */}
            {previewIndex < photos.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); nextPreview(); }} 
                className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#FACC15] text-white hover:text-black p-3 sm:p-4 rounded-full transition-all z-[10000] border border-white/20 shadow-xl"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>

          {/* NÚT TẢI XUỐNG DƯỚI CÙNG */}
          <div className="shrink-0 flex flex-col items-center justify-center pb-6 sm:pb-10" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => handleDownload(getSafeUrl(photos[previewIndex]), previewIndex)}
              className="flex items-center gap-3 bg-[#FACC15] text-black font-black px-8 py-3.5 sm:px-12 sm:py-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(250,204,21,0.3)] uppercase tracking-widest text-sm"
            >
              <Download size={20} strokeWidth={2.5} /> Tải ảnh này xuống
            </button>
            <p className="text-white/50 text-xs font-bold mt-4 tracking-widest uppercase">
              Ảnh {previewIndex + 1} / {photos.length}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default ReceivedGallery;