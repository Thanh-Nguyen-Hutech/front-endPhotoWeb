import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import axiosClient from './utils/axiosClient';
import { History, XCircle, Clock, CheckCircle, Calendar, MapPin, Tag, MessageCircle, CheckSquare, UserCircle } from 'lucide-react';

const MyHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axiosClient.get('/Bookings/my-history');
      setHistoryList([...response.data].reverse());
    } catch (error) {
      console.error("Lỗi khi tải lịch sử:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch chụp này không? Hành động này không thể hoàn tác.")) return;
    try {
      const response = await axiosClient.patch(`/Bookings/${id}/cancel`); 
      alert(`✅ ${response.data?.message || 'Hủy đơn thành công!'}`);
      fetchHistory(); 
    } catch (error) {
      alert(error.response?.data?.message || "Không thể hủy đơn hàng này.");
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm("Xác nhận buổi chụp đã diễn ra thành công?")) return;
    try {
      const response = await axiosClient.put(`/Bookings/${id}/complete`);
      alert(`🎉 ${response.data?.message || 'Đã xác nhận hoàn thành! Cảm ơn bạn đã sử dụng dịch vụ.'}`);
      fetchHistory(); 
    } catch (error) {
      alert(error.response?.data?.message || "Không thể xác nhận lúc này.");
    }
  };

  const handleContact = (item) => {
    const partnerName = item.photographerName || "Nhiếp ảnh gia";
    const contactInfo = item.phoneNumber ? `Số điện thoại: ${item.phoneNumber}` : "Thợ ảnh chưa cập nhật số điện thoại.";
    alert(`📞 Kênh liên hệ với ${partnerName}\n\n${contactInfo}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="pt-28 px-4 sm:px-6 pb-12 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 mb-10 border-l-4 border-photo-gold pl-4 animate-in slide-in-from-left-4 duration-500">
          <History className="text-photo-gold" size={32} />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">Lịch sử đã đặt</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-photo-gold"><div className="w-10 h-10 border-4 border-photo-gold border-t-transparent rounded-full animate-spin"></div></div>
        ) : historyList.length === 0 ? (
          <div className="glass text-center text-gray-500 py-20 rounded-[32px] border border-dashed border-white/10 animate-in fade-in duration-500">
            <p className="text-lg font-bold">Chưa có dữ liệu lịch sử.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {historyList.map((item, index) => {
              // ✅ BỘ LỌC THÔNG MINH BẤT CHẤP LỖI CHÍNH TẢ TỪ BACKEND
              const s = item.status?.toLowerCase() || '';
              const isPending = ['pending', 'waiting'].includes(s);
              const isAccepted = ['accepted', 'confirmed', 'approved'].includes(s);
              const isCompleted = ['completed', 'done', 'finished', 'success'].includes(s);
              const isCancelled = ['cancelled', 'canceled', 'cancel', 'rejected', 'reject', 'declined'].includes(s);

              return (
                <div key={item.id} className="glass p-6 sm:p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5 hover:border-photo-gold/30 transition-all duration-300 group shadow-lg shadow-black/50 animate-in slide-in-from-bottom-4" style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}>
                  
                  <div className="flex-1 space-y-5 w-full">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl border shadow-inner ${item.photographerName ? 'bg-gradient-to-tr from-photo-gold/20 to-orange-500/20 text-photo-gold border-photo-gold/30' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                        {item.photographerName ? item.photographerName.charAt(0).toUpperCase() : <UserCircle size={24} />}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white group-hover:text-photo-gold transition-colors">{item.photographerName || "Đang chờ thợ nhận lịch..."}</h3>
                        <div className="mt-2">
                          {/* HIỂN THỊ BADGE STATUS */}
                          {isPending && <span className="flex items-center gap-1 w-fit text-photo-gold bg-photo-gold/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-photo-gold/20"><Clock size={12}/> Đang chờ thợ</span>}
                          {isAccepted && <span className="flex items-center gap-1 w-fit text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-400/20"><CheckCircle size={12}/> Thợ đã nhận kèo</span>}
                          {isCompleted && <span className="flex items-center gap-1 w-fit text-green-400 bg-green-400/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-400/20"><CheckSquare size={12}/> Đã hoàn thành</span>}
                          {isCancelled && <span className="flex items-center gap-1 w-fit text-red-400 bg-red-400/10 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-400/20"><XCircle size={12}/> Đã hủy</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="flex items-center gap-2"><Calendar size={16} className="text-photo-gold"/> {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('vi-VN') : "N/A"}</span>
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-photo-gold"/> {item.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-4 w-full md:w-auto md:min-w-[180px] pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                    <p className="text-2xl font-black text-photo-gold tracking-tighter">
                        {item.maxPrice > 0 ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} ₫` : "THỎA THUẬN"}
                    </p>
                    
                    <div className="w-full space-y-2 mt-2">
                      {/* Nút Hoàn thành */}
                      {isAccepted && (
                        <button onClick={() => handleComplete(item.id)} className="w-full flex items-center justify-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-black px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">
                          <CheckSquare size={16} /> Xác nhận hoàn thành
                        </button>
                      )}

                      {/* Nút Liên hệ */}
                      {item.photographerName && (!isCancelled && !isCompleted) && (
                        <button onClick={() => handleContact(item)} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
                          <MessageCircle size={16} /> Nhắn tin cho thợ
                        </button>
                      )}

                      {/* Nút Hủy đơn */}
                      {(isPending || isAccepted) && (
                        <button onClick={() => handleCancel(item.id)} className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95">
                          <XCircle size={16} /> Hủy Lịch Chụp
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyHistory;