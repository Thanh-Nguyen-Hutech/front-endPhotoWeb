import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import axiosClient from './utils/axiosClient';
import ChatRoom from './components/ChatRoom';
import ReceivedGallery from './components/ReceivedGallery'; // 🌟 Import component đã đổi tên
import { History, XCircle, Clock, CheckCircle, Calendar, MapPin, MessageCircle, CheckSquare, UserCircle, CreditCard, Image as ImageIcon, Loader2 } from 'lucide-react';

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
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      currentUserId = payload.nameid; // Đồng nhất ID để chat
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
      alert("Cổng thanh toán đang bảo trì.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="pt-28 px-4 sm:px-6 pb-12 max-w-[1100px] mx-auto">
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
              const isAccepted = ['accepted', 'confirmed'].includes(status);
              const isCompleted = ['completed', 'done', 'success'].includes(status);
              const isPaid = status === 'paid'; 
              const isCancelled = ['cancelled', 'rejected'].includes(status);

              return (
                <div key={item.id} className="glass p-6 sm:p-10 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5 hover:border-photo-gold/20 transition-all duration-500 shadow-2xl group">
                  
                  <div className="flex-1 space-y-6 w-full">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-photo-gold/20 to-orange-500/10 flex items-center justify-center text-photo-gold font-black border border-photo-gold/20 text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        {item.photographerName?.charAt(0) || "P"}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black group-hover:text-photo-gold transition-colors">{item.photographerName || "Chờ thợ nhận..."}</h3>
                        <div className="flex gap-2 mt-2">
                           {isPaid && <span className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-black border border-green-400/20 uppercase tracking-widest">Đã cọc</span>}
                           {isCompleted && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-black border border-blue-400/20 uppercase tracking-widest">Hoàn thành</span>}
                           {isCancelled && <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full font-black border border-red-400/20 uppercase tracking-widest">Đã hủy</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-[0.1em] bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="flex items-center gap-2"><Calendar size={16} className="text-photo-gold"/> {new Date(item.bookingDate).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center gap-2"><MapPin size={16} className="text-photo-gold"/> {item.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-4 w-full md:w-auto min-w-[220px]">
                    <div className="text-3xl font-black text-photo-gold tracking-tighter">
                        {item.maxPrice > 0 ? `${item.minPrice.toLocaleString()} ₫` : "GIÁ THỎA THUẬN"}
                    </div>
                    
                    <div className="w-full flex flex-col gap-2">
                      {isAccepted && !isPaid && (
                        <button onClick={() => handlePayment(item.id, 500000)} className="w-full py-4 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                          <CreditCard size={16} /> Thanh toán cọc (VNPay)
                        </button>
                      )}

                      {/* NÚT VÀNG: XEM ẢNH - Chỉ hiện khi hoàn thành */}
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

        {/* MODAL GALLERY (FULLSCREEN OVERLAY) */}
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