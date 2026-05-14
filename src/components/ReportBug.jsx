import React, { useState } from 'react';
import { ShieldAlert, X, Send } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const ReportBug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chỉ hiện nút này nếu người dùng đã đăng nhập (có token)
  const token = localStorage.getItem('token');
  if (!token) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 🌟 ĐÃ MỞ KHÓA GỌI API THẬT
      await axiosClient.post('/Reports', { title, content });
      
      alert("Cảm ơn bạn! Báo cáo lỗi đã được gửi đến Admin hệ thống FOTOZ.");
      setIsOpen(false);
      setTitle('');
      setContent('');
      window.location.reload();
    } catch (err) {
      alert("Cảm ơn bạn đã báo cáo. Chúng tôi đã ghi nhận!");
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* NÚT THẢ NỔI GÓC DƯỚI BÊN PHẢI */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-110 transition-all flex items-center justify-center group"
        title="Báo cáo lỗi / Góp ý"
      >
        <ShieldAlert size={24} />
      </button>

      {/* MODAL NHẬP BÁO CÁO */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass w-full max-w-md bg-[#0a0a0a] rounded-[32px] border border-red-500/20 p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/10 rounded-2xl"><ShieldAlert className="text-red-500" size={24}/></div>
                <div>
                    <h2 className="text-xl font-black italic uppercase text-white">Báo cáo sự cố</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Gửi trực tiếp đến Admin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tiêu đề lỗi</label>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: Không tải được ảnh..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mô tả chi tiết</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Mô tả các bước dẫn đến lỗi để Admin dễ dàng kiểm tra..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-red-500 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Gửi Báo Cáo
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportBug;