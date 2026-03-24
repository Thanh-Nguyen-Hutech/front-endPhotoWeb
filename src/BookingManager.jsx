import React, { useState, useEffect } from 'react';
import axiosClient from './utils/axiosClient';
import { Calendar, MapPin, Check, X, Loader2 } from 'lucide-react';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Kiểm tra kỹ Key 'role' hay 'userRole' tùy theo lúc bạn lưu ở trang Login nhé
  const userRole = localStorage.getItem('role'); 

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get('/Bookings/my-history');
      setBookings(response.data);
    } catch (error) {
      console.error("Lỗi lấy lịch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
  try {
    // ✅ Phải gọi đúng router [HttpPut("{id}/accept")] như trong Controller bạn gửi
    const response = await axiosClient.put(`/Bookings/${id}/accept`);
    
    alert(`✅ ${response.data.message}`);
    
    // Sau khi nhận thành công, load lại dữ liệu
    fetchBookings(); 
  } catch (error) {
    console.error("Lỗi nhận lịch:", error);
    alert(error.response?.data || "Không thể nhận lịch này!");
  }
};
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* KHÔNG ĐẶT NAVBAR Ở ĐÂY VÌ APP.JSX ĐÃ CÓ */}
      
      <main className="pt-32 px-6 pb-12 max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black border-l-4 border-photo-gold pl-4 uppercase tracking-tighter">
              {userRole === 'Photographer' ? 'Quản lý lịch chụp' : 'Lịch đã đặt của tôi'}
            </h2>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Tổng cộng: {bookings.length} đơn
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 text-photo-gold">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase text-xs tracking-widest">Đang tải dữ liệu...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center mt-32 p-10 border border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500 font-bold">Chưa có lịch chụp nào được ghi nhận.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5 hover:border-photo-gold/20 transition-all group">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-photo-gold/10 flex items-center justify-center text-photo-gold font-black">
                          {booking.customerName?.charAt(0)}
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-photo-gold transition-colors">
                        {booking.customerName}
                      </h3>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                        <Calendar size={14} className="text-photo-gold"/> 
                        {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                        <MapPin size={14} className="text-photo-gold"/> 
                        {booking.location}
                    </span>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-2xl">
                    <p className="text-xs text-gray-500 uppercase font-black mb-1">Ghi chú từ khách:</p>
                    <p className="text-sm text-gray-300 italic">"{booking.notes || 'Không có ghi chú'}"</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${
                    booking.status === 'Accepted' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    booking.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-photo-gold/10 text-photo-gold border border-photo-gold/20'
                  }`}>
                    {booking.status === 'Pending' ? 'Đang chờ duyệt' : 
                     booking.status === 'Accepted' ? 'Đã xác nhận' : 'Đã từ chối'}
                  </span>

                  {userRole === 'Photographer' && booking.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'Accepted')}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl hover:bg-photo-gold transition-all font-black text-xs uppercase"
                      >
                        <Check size={16} /> Nhận kèo
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(booking.id, 'Rejected')}
                        className="flex items-center gap-2 bg-white/5 text-white px-6 py-3 rounded-2xl hover:bg-red-500 transition-all font-black text-xs uppercase border border-white/10"
                      >
                        <X size={16} /> Bỏ qua
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingManager;