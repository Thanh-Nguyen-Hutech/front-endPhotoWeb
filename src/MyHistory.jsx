import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import axiosClient from './utils/axiosClient';
import ChatRoom from './components/ChatRoom';
import ReceivedGallery from './components/ReceivedGallery'; 
import CustomerApprovals from './components/CustomerApprovals'; 
import { History, XCircle, Calendar, MapPin, MessageCircle, CreditCard, Image as ImageIcon, Loader2 } from 'lucide-react';

const MyHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedChat, setSelectedChat] = useState(null); 
  const [showChatModal, setShowChatModal] = useState(false);

  const [selectedGallery, setSelectedGallery] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const currentUserFullName = localStorage.getItem('fullName') || "Khách hàng";
  const token = localStorage.getItem('token');
  let currentUserId = "";

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      currentUserId = payload.nameid; 
    } catch (error) {
      console.error("Token error:", error);
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await axiosClient.get('/Bookings/my-history');
      setHistoryList([...response.data].reverse());
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleComplete = async (id) => {
    if (!window.confirm("Xác nhận buổi chụp đã kết thúc và bạn hài lòng?")) return;
    try {
      await axiosClient.put(`/Bookings/${id}/complete`);
      fetchHistory(); 
    } catch (error) {
      alert("Lỗi xác nhận.");
    }
  };

  const handlePayment = async (bookingId, amount) => {
    try {
      const res = await axiosClient.post('/Payments/create-url', { bookingId, amount });
      window.location.href = res.data.url;
    } catch (error) {
      alert("Cổng thanh toán đang bảo trì hoặc chuỗi Hash cấu hình chưa chính xác.");
    }
  };

  const handleOpenChat = (booking) => {
    setSelectedChat(booking);
    setShowChatModal(true);
  };

  const renderPrice = (min, max) => {
    const hasMin = min > 0;
    const hasMax = max > 0;

    if (hasMin && hasMax) return `${min.toLocaleString()} - ${max.toLocaleString()} ₫`;
    if (hasMin && !hasMax) return `Từ ${min.toLocaleString()} ₫`;
    if (!hasMin && hasMax) return `Đến ${max.toLocaleString()} ₫`;
    
    return "GIÁ THỎA THUẬN";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="pt-28 px-4 sm:px-6 pb-12 max-w-[1100px] mx-auto">
        
        <div className="mb-12">
          <CustomerApprovals />
        </div>

        <div className="flex items-center gap-3 mb-10 border-l-4 border-photo-gold pl-5 animate-in slide-in-from-left-4 duration-700">
          <History className="text-photo-gold" size={36} />
          <h2 className="text-3xl font-black tracking-tighter uppercase">Lịch sử đặt lịch</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-photo-gold" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {historyList.map((item, index) => {
              const status = item.status?.toLowerCase() || '';
              
              // 🌟 CHỈ ẨN ĐƠN KHẢO SÁT CÔNG KHAI CHƯA CÓ AI APPLY
              if (status === 'waitingapproval' && !item.photographerId) return null;

              // PHÂN PHỐI ĐIỀU KIỆN TRẠNG THÁI BIỆT LẬP
              const isDirectPending = status === 'directpending'; // Đơn đặt đích danh từ Profile chờ thợ duyệt
              const isWaitingApproval = status === 'waitingapproval'; // Đơn công khai thợ xin việc chờ khách duyệt
              const isAccepted = ['accepted', 'confirmed', 'approved'].includes(status);
              const isCompleted = ['completed', 'done', 'success'].includes(status);
              const isPaid = status === 'paid'; 
              const isCancelled = ['cancelled', 'rejected', 'declined'].includes(status);

              return (
                <div key={item.id} className="glass p-6 sm:p-10 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 hover:border-photo-gold/20 transition-all duration-500 shadow-2xl group">
                  
                  <div className="flex-1 space-y-6 w-full">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-photo-gold/20 to-orange-500/10 flex items-center justify-center text-photo-gold font-black border border-photo-gold/20 text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        {item.photographerName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black group-hover:text-photo-gold transition-colors">
                          {item.photographerName || "Hệ thống đang tìm thợ..."}
                        </h3>
                        
                        {/* 🌟 ĐỒNG BỘ HIỂN THỊ BADGE PHÍA USER CHUẨN NÉT */}
                        <div className="flex gap-2 mt-2">
                           {isDirectPending && <span className="text-[10px] bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full font-black border border-yellow-400/20 uppercase tracking-widest animate-pulse">⏳ Chờ thợ xác nhận đơn</span>}
                           {isWaitingApproval && <span className="text-[10px] bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full font-black border border-orange-400/20 uppercase tracking-widest">🔍 Đang chờ bạn duyệt thợ</span>}
                           {isAccepted && <span className="text-[10px] bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full font-black border border-teal-400/20 uppercase tracking-widest">✨ Lịch chụp đã chốt</span>}
                           {isPaid && <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-black border border-green-400/20 uppercase tracking-widest">💳 Đã cọc thành công</span>}
                           {isCompleted && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-black border border-blue-400/20 uppercase tracking-widest">🏆 Đã hoàn thành</span>}
                           {isCancelled && <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-black border border-red-400/20 uppercase tracking-widest">❌ Đã hủy lịch</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-[0.1em] bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="flex items-center gap-2"><Calendar size={16} className="text-photo-gold"/> {new Date(item.bookingDate).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-photo-gold"/> {item.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-4 w-full md:w-auto min-w-[220px]">
                    <div className="text-2xl sm:text-3xl font-black text-photo-gold tracking-tighter text-right">
                        {renderPrice(item.minPrice, item.maxPrice)}
                    </div>
                    
                    <div className="w-full flex flex-col gap-2">
                      {/* Chỉ hiện nút thanh toán VNPay khi thợ chụp đã nhấn đồng ý tiếp nhận */}
                      {isAccepted && !isPaid && (
                        <button onClick={() => handlePayment(item.id, 500000)} className="w-full py-4 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                          <CreditCard size={16} /> Thanh toán cọc (VNPay)
                        </button>
                      )}

                      {isCompleted && (
                        <button 
                          onClick={() => { setSelectedGallery(item); setShowGalleryModal(true); }} 
                          className="w-full py-4 bg-photo-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.05] transition-all shadow-[0_10px_20px_rgba(250,195,33,0.3)] active:scale-95 flex items-center justify-center gap-2"
                        >
                          <ImageIcon size={18} /> Xem & Tải ảnh về
                        </button>
                      )}

                      {item.photographerName && !isCancelled && !isCompleted && (
                        <button onClick={() => handleOpenChat(item)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2">
                          <MessageCircle size={16} /> Nhắn tin cho thợ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL CHAT */}
        {showChatModal && selectedChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[40px] border border-photo-gold/30 shadow-2xl">
              <button onClick={() => setShowChatModal(false)} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-all shadow-xl z-20"><XCircle size={24} /></button>
              <ChatRoom bookingId={selectedChat.id} currentUser={currentUserFullName} currentUserId={currentUserId} isPaid={selectedChat.status === 'paid' || selectedChat.status === 'completed'} />
            </div>
          </div>
        )}

        {/* MODAL GALLERY */}
        {showGalleryModal && selectedGallery && (
          <div className="fixed inset-0 z-[150] flex flex-col bg-[#050505] overflow-y-auto animate-in slide-in-from-bottom-full duration-500">
            <div className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 p-5 px-8 flex justify-between items-center shadow-2xl">
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-xl">Phòng Nhận Ảnh</h3>
                <p className="text-[10px] text-photo-gold font-black uppercase mt-1">Photo: {selectedGallery.photographerName}</p>
              </div>
              <button onClick={() => setShowGalleryModal(false)} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-all"><XCircle size={36} /></button>
            </div>
            <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-10">
               <ReceivedGallery bookingId={selectedGallery.id} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyHistory;