import React, { useState, useEffect } from 'react';
import axiosClient from './utils/axiosClient';
import ChatRoom from './components/ChatRoom';
import { Calendar, MapPin, Check, X, Loader2, MessageCircle, XCircle, Image as ImageIcon } from 'lucide-react'; // 🌟 Đã import thêm ImageIcon

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Các state cho việc Giao ảnh
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryBooking, setDeliveryBooking] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deliveryResult, setDeliveryResult] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);
  
  // Các state cho Chat
  const [selectedChat, setSelectedChat] = useState(null); 
  const [showChatModal, setShowChatModal] = useState(false);
  
  const userRole = localStorage.getItem('role')?.trim().toLowerCase(); 

  // GIẢI MÃ TOKEN ĐỂ LẤY ID CỦA THỢ ẢNH
  const currentUserFullName = localStorage.getItem('fullName') || "Thợ Ảnh";
  const token = localStorage.getItem('token');
  let currentUserId = "";

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      currentUserId = payload.nameid || ""; 
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
    }
  }

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

  const handleOpenChat = (booking) => {
    setSelectedChat(booking);
    setShowChatModal(true);
  };

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return alert("Vui lòng chọn ảnh!");
    
    setIsUploading(true);
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await axiosClient.post(`/Gallery/${deliveryBooking.id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setDeliveryResult(res.data);
      fetchBookings(); 
    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Có lỗi xảy ra khi tải ảnh lên.");
    } finally {
      setIsUploading(false);
    }
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
              const s = booking.status?.toLowerCase() || '';
              const isPending = ['pending', 'waiting'].includes(s);
              const isAccepted = ['accepted', 'confirmed', 'approved'].includes(s);
              const isCompleted = ['completed', 'done', 'finished', 'success'].includes(s);
              const isPaid = s === 'paid'; 
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
                      isAccepted || isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      isCompleted ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-photo-gold/10 text-photo-gold border border-photo-gold/20'
                    }`}>
                      {isPending ? 'Đang chờ duyệt' : 
                       isPaid ? 'Khách đã cọc' :
                       isAccepted ? 'Đã xác nhận' : 
                       isCompleted ? 'Đã hoàn thành' : 'Đã Hủy/Từ chối'}
                    </span>

                    <div className="w-full space-y-2 mt-2">
                        {(!isCancelled && !isCompleted) && (
                          <button onClick={() => handleOpenChat(booking)} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-black text-xs uppercase transition-all border border-white/10 active:scale-95">
                            <MessageCircle size={16} /> Nhắn tin khách
                          </button>
                        )}

                        {/* 🌟 NÚT GIAO ẢNH DÀNH CHO THỢ */}
                        {(isAccepted || isPaid) && userRole === 'photographer' && (
                          <button 
                            onClick={() => {
                              setDeliveryBooking(booking);
                              setShowDeliveryModal(true);
                              setDeliveryResult(null);
                              setSelectedFiles([]);
                            }} 
                            className="w-full flex items-center justify-center gap-2 bg-photo-gold text-black hover:bg-yellow-400 px-4 py-3 rounded-xl font-black text-[10px] uppercase transition-all shadow-[0_0_15px_rgba(250,195,33,0.3)] active:scale-95 mt-2"
                          >
                            <ImageIcon size={16} /> Giao Ảnh Cho Khách
                          </button>
                        )}

                        {userRole === 'photographer' && isPending && (
                          <div className="flex gap-2 w-full mt-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'accept')} className="flex-1 flex items-center justify-center gap-2 bg-photo-gold text-black px-4 py-3 rounded-xl hover:bg-yellow-400 transition-all font-black text-[10px] uppercase shadow-lg shadow-photo-gold/20 active:scale-95"><Check size={16} /> Nhận kèo</button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'reject')} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 px-4 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase border border-red-500/20 active:scale-95"><X size={16} /> Bỏ qua</button>
                          </div>
                        )}

                        {(isAccepted || isPaid) && (
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

        {/* 🌟 MODAL GIAO ẢNH HÀNG LOẠT */}
        {showDeliveryModal && deliveryBooking && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-[#111] p-8 rounded-[32px] border border-photo-gold/30 shadow-2xl text-center">
              
              <button onClick={() => setShowDeliveryModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button>

              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Giao File Ảnh</h3>
              <p className="text-sm text-gray-400 mb-6">Đơn hàng: #{deliveryBooking.id} - Khách: {deliveryBooking.customerName}</p>

              {!deliveryResult ? (
                <form onSubmit={handleUploadGallery} className="space-y-6">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 hover:border-photo-gold/50 transition-colors">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={(e) => setSelectedFiles(e.target.files)}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-photo-gold/10 file:text-photo-gold hover:file:bg-photo-gold/20 cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-photo-gold font-bold">Đã chọn: {selectedFiles.length} file</p>

                  <button 
                    type="submit" 
                    disabled={isUploading || selectedFiles.length === 0}
                    className="w-full bg-photo-gold text-black font-black py-4 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? <><Loader2 className="animate-spin" size={20}/> Đang tải lên Cloudinary...</> : 'Bắt đầu Tải lên'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white">Đã tải ảnh thành công!</h4>
                  
                  <div className="bg-black p-4 rounded-xl border border-white/10 text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Mật khẩu để gửi cho khách:</p>
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-mono font-black text-photo-gold tracking-[0.2em]">{deliveryResult.password}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(deliveryResult.password)}
                        className="text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors font-bold"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* MODAL KHUNG CHAT */}
        {showChatModal && selectedChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[32px] border border-photo-gold/30 shadow-[0_0_50px_rgba(250,195,33,0.15)]">
              
              <button 
                onClick={() => setShowChatModal(false)}
                className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-all shadow-lg z-10"
                title="Đóng chat"
              >
                <XCircle size={24} />
              </button>

              <ChatRoom 
                bookingId={selectedChat.id} 
                currentUser={currentUserFullName} 
                currentUserId={currentUserId}
                isPaid={selectedChat.status?.toLowerCase() === "paid" || selectedChat.status?.toLowerCase() === "completed"} 
              />
              
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default BookingManager;