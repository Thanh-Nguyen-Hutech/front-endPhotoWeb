import React, { useState } from 'react';
import axiosClient from '../utils/axiosClient';
import { Lock, Download, Image as ImageIcon, CheckCircle } from 'lucide-react';

const ClientGallery = ({ bookingId }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý khi khách bấm nút "Mở khóa"
  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gửi pass lên C# kiểm tra (chú ý gửi dạng string trong body nếu API yêu cầu [FromBody] string)
      const res = await axiosClient.post(`/Gallery/${bookingId}/verify`, `"${password}"`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setPhotos(res.data.photos);
      setIsUnlocked(true);
    } catch (err) {
      setError('Mật khẩu không chính xác. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm hỗ trợ tải ảnh về máy
  const handleDownload = async (url, index) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `FOTOZ_Image_${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Lỗi tải ảnh!");
    }
  };

  // 🔴 TRẠNG THÁI 1: YÊU CẦU NHẬP MẬT KHẨU
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass rounded-3xl border border-white/10 text-center shadow-2xl">
        <div className="w-16 h-16 bg-photo-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-photo-gold" size={32} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Bộ Sưu Tập Kín</h2>
        <p className="text-gray-400 text-sm mb-6">Vui lòng nhập mật khẩu do thợ ảnh cung cấp để xem và tải file chất lượng cao.</p>
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white focus:outline-none focus:border-photo-gold tracking-widest font-mono"
          />
          {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading || !password}
            className="w-full bg-photo-gold text-black font-black py-3 rounded-xl uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang kiểm tra...' : 'Mở Khóa Album'}
          </button>
        </form>
      </div>
    );
  }

  // 🟢 TRẠNG THÁI 2: ĐÃ MỞ KHÓA, HIỆN LƯỚI ẢNH
  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Đã mở khóa
          </h2>
          <p className="text-photo-gold font-bold mt-1">Gồm {photos.length} hình ảnh chất lượng cao</p>
        </div>
      </div>

      {photos.length === 0 ? (
        <p className="text-gray-400 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">Thợ ảnh chưa tải lên hình ảnh nào.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((url, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-square">
              {/* Ảnh thu nhỏ */}
              <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover group-hover:opacity-50 transition-all duration-300" />
              
              {/* Nút tải hiện lên khi hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => handleDownload(url, idx)}
                  className="bg-photo-gold text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                  title="Tải ảnh này"
                >
                  <Download size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientGallery;   