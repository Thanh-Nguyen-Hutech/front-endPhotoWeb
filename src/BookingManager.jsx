import React, { useState, useEffect } from 'react';
import axiosClient from './utils/axiosClient';
import { Calendar, MapPin, Check, X, Loader2, MessageCircle, XCircle } from 'lucide-react';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userRole = localStorage.getItem('role')?.trim().toLowerCase(); 

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get('/Bookings/my-history');
      setBookings([...response.data].reverse());
    } catch (error) {
      console.error("Lỗi lấy lịch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, action) => {
    let confirmMsg = "";
    if (action === 'accept') confirmMsg = "Bạn có chắc chắn muốn NHẬN lịch chụp này?";
    else if (action === 'reject') confirmMsg = "Bạn có chắc chắn muốn TỪ CHỐI lịch chụp này?";
    else if (action === 'cancel') confirmMsg = "CẢNH BÁO: Bạn có chắc muốn HỦY lịch chụp đã nhận này? Việc hủy lịch đột xuất có thể làm giảm uy tín của bạn với khách hàng.";

    if (!window.confirm(confirmMsg)) return;

    try {
      let response;
      // ⚡ PHÂN LOẠI METHOD: Cancel dùng PATCH, Accept/Reject dùng PUT
      if (action === 'cancel') {
        response = await axiosClient.patch(`/Bookings/${id}/${action}`);
      } else {
        response = await axiosClient.put(`/Bookings/${id}/${action}`);
      }
      
      alert(`✅ ${response.data?.message || 'Cập nhật thành công!'}`);
      fetchBookings(); 
    } catch (error) {
      console.error(`Lỗi thao tác ${action}:`, error);
      alert(error.response?.data?.message || error.response?.data || "Không thể thực hiện thao tác này!");
    }
  };

  const handleContact = (booking) => {
    const customerName = booking.customerName || "Khách hàng";
    const contactInfo = booking.phoneNumber ? `Số điện thoại: ${booking.phoneNumber}` : "Khách hàng chưa cập nhật số điện thoại.";
    alert(`📞 Thông tin liên hệ với ${customerName}:\n\n${contactInfo}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="pt-32 px-6 pb-12 max-w-[1000px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <h2 className="text-3xl font-black border-l-4 border-photo-gold pl-4 uppercase tracking-tighter">
              Quản lý lịch chụp
            </h2>
            <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-photo-gold uppercase tracking-widest border border-photo-gold/20">
                Tổng cộng: {bookings.length} đơn
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 text-photo-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center mt-20 p-16 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-gray-400 font-bold text-lg mb-2">Chưa có lịch chụp nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, index) => {
              // ✅ BỘ LỌC THÔNG MINH BẤT CHẤP LỖI CHÍNH TẢ TỪ BACKEND
              const s = booking.status?.toLowerCase() || '';
              const isPending = ['pending', 'waiting'].includes(s);
              const isAccepted = ['accepted', 'confirmed', 'approved'].includes(s);
              const isCompleted = ['completed', 'done', 'finished', 'success'].includes(s);
              const isCancelled = ['cancelled', 'canceled', 'cancel', 'rejected', 'reject', 'declined'].includes(s);

              return (
                <div key={booking.id} className="glass p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-8 border border-white/5 hover:border-photo-gold/30 transition-all duration-300 group shadow-lg shadow-black/50 animate-in slide-in-from-bottom-4" style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-photo-gold/20 to-orange-500/20 flex items-center justify-center text-photo-gold font-black text-xl border border-photo-gold/30 shadow-inner">
                            {booking.customerName ? booking.customerName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-photo-gold transition-colors tracking-tight">
                          {booking.customerName || "Khách hàng ẩn danh"}
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Calendar size={16} className="text-photo-gold"/> {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><MapPin size={16} className="text-photo-gold"/> {booking.location || 'Chưa cập nhật'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-4 min-w-[200px] pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                    <span className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                      isAccepted ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      isCompleted ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-photo-gold/10 text-photo-gold border border-photo-gold/20'
                    }`}>
                      {isPending ? 'Đang chờ duyệt' : 
                       isAccepted ? 'Đã xác nhận' : 
                       isCompleted ? 'Đã hoàn thành' : 'Đã Hủy/Từ chối'}
                    </span>

                    <div className="w-full space-y-2 mt-2">
                        {/* Nút Nhắn tin */}
                        {(!isCancelled && !isCompleted) && (
                          <button onClick={() => handleContact(booking)} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-black text-xs uppercase transition-all border border-white/10 active:scale-95">
                            <MessageCircle size={16} /> Nhắn tin khách
                          </button>
                        )}

                        {/* Nút Nhận / Từ chối (Khi Pending) */}
                        {userRole === 'photographer' && isPending && (
                          <div className="flex gap-2 w-full mt-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'accept')} className="flex-1 flex items-center justify-center gap-2 bg-photo-gold text-black px-4 py-3 rounded-xl hover:bg-yellow-400 transition-all font-black text-[10px] uppercase shadow-lg shadow-photo-gold/20 active:scale-95"><Check size={16} /> Nhận kèo</button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'reject')} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase border border-red-500/20 active:scale-95"><X size={16} /> Bỏ qua</button>
                          </div>
                        )}

                        {/* NÚT HỦY LỊCH DÀNH CHO THỢ */}
                        {isAccepted && (
                          <button onClick={() => handleUpdateStatus(booking.id, 'cancel')} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase transition-all border border-red-500/20 active:scale-95 mt-2">
                            <XCircle size={16} /> Hủy lịch đột xuất
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

export default BookingManager;