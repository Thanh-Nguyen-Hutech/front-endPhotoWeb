import React, { useState, useEffect } from 'react';
import axiosClient from './utils/axiosClient';
import ChatRoom from './components/ChatRoom';
import imageCompression from 'browser-image-compression'; 
import { Calendar, MapPin, Check, X, Loader2, MessageCircle, XCircle, Image as ImageIcon, Send, Plus, Trash2, Key } from 'lucide-react'; 

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Các state cho việc Giao ảnh
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryBooking, setDeliveryBooking] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]); 
  const [selectedFiles, setSelectedFiles] = useState([]);  
  const [previewUrls, setPreviewUrls] = useState([]);      
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [selectedChat, setSelectedChat] = useState(null); 
  const [showChatModal, setShowChatModal] = useState(false);
  
  const userRole = localStorage.getItem('role')?.trim().toLowerCase(); 
  const currentUserFullName = localStorage.getItem('fullName') || "Thợ Ảnh";
  const token = localStorage.getItem('token');
  let currentUserId = "";

  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
      currentUserId = payload.nameid || ""; 
    } catch (error) { console.error("Lỗi token:", error); }
  }

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get('/Bookings/my-history');
      const resData = response.data !== undefined ? response.data : response;
      setBookings([...resData].reverse());
    } catch (error) { console.error("Lỗi lấy lịch:", error); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, action) => {
    let confirmMsg = "";
    if (action === 'cancel') confirmMsg = "CẢNH BÁO: Bạn có chắc muốn HỦY/TỪ CHỐI lịch chụp này? Thao tác này không thể hoàn tác.";
    if (action === 'accept') confirmMsg = "Bạn xác nhận chấp nhận yêu cầu đặt lịch chụp trực tiếp này chứ?";

    if (confirmMsg && !window.confirm(confirmMsg)) return;

    try {
      let response;
      // Phân bổ phương thức gọi HTTP tương thích với Backend API
      if (action === 'cancel') {
        response = await axiosClient.patch(`/Bookings/${id}/${action}`);
      } else {
        response = await axiosClient.put(`/Bookings/${id}/${action}`);
      }
      
      alert(`✅ ${response.data?.message || 'Cập nhật trạng thái đơn thành công!'}`);
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

  const fetchExistingPhotos = async (bookingId, password) => {
    if (!password) return; 
    try {
      const res = await axiosClient.post(`/Gallery/${bookingId}/verify`, JSON.stringify(password), {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = res.data !== undefined ? res.data : res;
      setExistingPhotos(data.photos || []);
    } catch (error) {
      console.error("Không thể tải ảnh cũ:", error);
    }
  };

  const handleOpenDeliveryModal = (booking) => {
    setDeliveryBooking(booking);
    setExistingPhotos([]);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowDeliveryModal(true);
    if (booking.galleryPassword || booking.GalleryPassword) {
      fetchExistingPhotos(booking.id, booking.galleryPassword || booking.GalleryPassword);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const handleRemovePreview = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteExistingPhoto = async (photoId) => {
    if (!window.confirm("Bạn muốn xóa vĩnh viễn tấm ảnh này khỏi kho?")) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/Gallery/photo/${photoId}`);
      setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (error) {
      alert("Lỗi khi xóa ảnh.");
    } finally { setIsDeleting(false); }
  };

  const handleUploadGallery = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formData = new FormData();
    const options = { maxSizeMB: 9.5, maxWidthOrHeight: 4000, useWebWorker: true, initialQuality: 0.9 };

    try {
      for (let file of selectedFiles) {
        if (file.size > 9.5 * 1024 * 1024) file = await imageCompression(file, options);
        formData.append('files', file);
      }
      await axiosClient.post(`/Gallery/${deliveryBooking.id}/upload`, formData);
      
      alert("✅ Đã cập nhật kho ảnh thành công!");
      fetchBookings(); 
      closeDeliveryModal();
    } catch (error) {
      alert("Lỗi upload.");
    } finally { setIsUploading(false); }
  };

  const closeDeliveryModal = () => {
    setShowDeliveryModal(false);
    setDeliveryBooking(null);
  };

  return (
    <div className="min-h-screen bg-[#050A15] text-white">
      <main className="pt-32 px-6 pb-12 max-w-[1000px] mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <h2 className="text-3xl font-black border-l-4 border-[#BDE8F5] pl-4 uppercase tracking-tighter italic">
              Quản lý lịch chụp
            </h2>
            <div className="bg-[#BDE8F5]/10 px-4 py-2 rounded-xl text-xs font-bold text-[#BDE8F5] uppercase tracking-widest border border-[#BDE8F5]/20">
                Tổng cộng: {bookings.length} đơn
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32 text-[#BDE8F5]">
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
              const isCancelled = ['cancelled', 'canceled', 'cancel', 'rejected', 'reject', 'declined'].includes(s);
              const isCompleted = ['completed', 'done', 'finished', 'success'].includes(s);
              const isPaid = s === 'paid'; 
              const isAccepted = ['accepted', 'confirmed', 'approved'].includes(s);
              
              // 🌟 PHÂN LUỒNG LOGIC ĐÃ ĐỒNG BỘ TRẠNG THÁI DIRECTPENDING MỚI
              // Luồng 1: Đơn công khai thợ ứng tuyển -> Chờ KHÁCH duyệt thợ
              const isWaitingCustomerApproval = s === 'waitingapproval'; 
              // Luồng 2: Đơn khách đặt đích danh qua Profile -> Chờ THỢ duyệt khách
              const isWaitingMyApproval = s === 'directpending'; 

              const pass = booking.galleryPassword || booking.GalleryPassword;

              return (
                <div key={booking.id} className="bg-[#0F172A]/40 backdrop-blur-md p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-8 border border-white/5 hover:border-[#BDE8F5]/30 transition-all duration-300 group shadow-lg shadow-black/50 animate-in slide-in-from-bottom-4" style={{ animationFillMode: 'both', animationDelay: `${index * 100}ms` }}>
                  
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#BDE8F5]/20 to-blue-500/20 flex items-center justify-center text-[#BDE8F5] font-black text-xl border border-[#BDE8F5]/30 shadow-inner">
                            {booking.customerName ? booking.customerName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <h3 className="text-2xl font-black text-white group-hover:text-[#BDE8F5] transition-colors tracking-tight">
                          {booking.customerName || "Khách hàng ẩn danh"}
                        </h3>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><Calendar size={16} className="text-[#BDE8F5]"/> {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : 'N/A'}</span>
                      <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5"><MapPin size={16} className="text-[#BDE8F5]"/> {booking.location || 'Chưa cập nhật'}</span>
                      
                      {pass && (
                        <span className="flex items-center gap-2 bg-photo-gold/10 text-photo-gold px-4 py-2 rounded-xl border border-photo-gold/20 font-black">
                          <Key size={16}/> PASS: {pass}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-4 min-w-[220px] pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                    
                    {/* ĐỒNG BỘ BADGE MÀU THEO TỪNG LUỒNG XỬ LÝ */}
                    <span className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                      isWaitingCustomerApproval ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      isWaitingMyApproval ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse' :
                      isAccepted || isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      isCancelled ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      isCompleted ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {isWaitingCustomerApproval ? '⏳ Đang chờ khách duyệt' : 
                       isWaitingMyApproval ? '⚡ Đơn trực tiếp - Chờ bạn duyệt' :
                       isPaid ? '✅ Khách đã cọc' :
                       isAccepted ? '✨ Khách đã chốt' : 
                       isCompleted ? '🏆 Đã hoàn thành' : '❌ Đã Hủy/Từ chối'}
                    </span>

                    <div className="w-full flex flex-col gap-2 mt-2">
                        {/* 🌟 CẶP NÚT THAO TÁC DUYỆT TRỰC TIẾP DÀNH RIÊNG CHO THỢ */}
                        {isWaitingMyApproval && (
                          <div className="flex gap-2 w-full">
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'accept')} 
                              className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-400 text-black px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-green-500/10"
                            >
                              <Check size={14} /> Nhận lịch
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking.id, 'cancel')} 
                              className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all active:scale-95"
                            >
                              <X size={14} /> Từ chối
                            </button>
                          </div>
                        )}

                        {(isAccepted || isPaid || isCompleted) && (
                          <button 
                            onClick={() => handleOpenDeliveryModal(booking)} 
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs uppercase transition-all shadow-lg active:scale-95 ${
                              isCompleted 
                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                                : 'bg-[#BDE8F5] text-[#0F2854] hover:bg-white shadow-[#BDE8F5]/20'
                            }`}
                          >
                            <ImageIcon size={16} /> {pass ? 'Quản lý Kho Ảnh' : 'Giao File Ảnh'}
                          </button>
                        )}

                        {(!isCancelled && !isCompleted) && (
                          <button onClick={() => handleOpenChat(booking)} className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-black text-xs uppercase transition-all border border-white/10 active:scale-95">
                            <MessageCircle size={16} /> Nhắn tin khách
                          </button>
                        )}

                        {/* Hiện nút hủy thông thường cho thợ khi lịch đã chốt/cọc nhưng chưa hoàn thành */}
                        {((isAccepted || isPaid) && !isWaitingMyApproval) && (
                          <button onClick={() => handleUpdateStatus(booking.id, 'cancel')} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase transition-all border border-red-500/20 active:scale-95">
                            <XCircle size={16} /> Hủy lịch
                          </button>
                        )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* MODAL KHO ẢNH GIỮ NGUYÊN HOẠT ĐỘNG HOÀN HẢO */}
        {showDeliveryModal && deliveryBooking && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-[#0a0a0a] p-8 rounded-[32px] border border-[#BDE8F5]/30 my-8">
              <button onClick={closeDeliveryModal} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"><X size={24}/></button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-[#BDE8F5] uppercase">Kho Ảnh: {deliveryBooking.customerName}</h3>
                {(deliveryBooking.galleryPassword || deliveryBooking.GalleryPassword) && (
                   <div className="mt-2 text-photo-gold font-mono text-xl font-black tracking-widest bg-white/5 px-4 py-2 rounded-xl inline-block border border-photo-gold/20">
                     🔑 CODE: {deliveryBooking.galleryPassword || deliveryBooking.GalleryPassword}
                   </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[50vh] overflow-y-auto p-2 custom-scrollbar">
                {existingPhotos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                    <img src={photo.url} className="w-full h-full object-cover" alt="existing-photo" />
                    <button 
                       disabled={isDeleting}
                       onClick={() => handleDeleteExistingPhoto(photo.id)}
                       className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[#BDE8F5] group">
                    <img src={url} className="w-full h-full object-cover opacity-60" alt="preview" />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#BDE8F5] uppercase">Chờ up</div>
                    <button onClick={() => handleRemovePreview(index)} className="absolute top-1 right-1 bg-gray-800 p-1.5 rounded-lg text-white"><X size={14}/></button>
                  </div>
                ))}

                <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all text-gray-500 hover:text-[#BDE8F5]">
                  <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <Plus size={32} />
                  <span className="text-[10px] font-bold uppercase mt-2">Thêm ảnh</span>
                </label>
              </div>

              <div className="mt-8 flex gap-4">
                <button onClick={closeDeliveryModal} className="flex-1 py-4 rounded-2xl bg-white/5 font-black uppercase text-xs">Đóng</button>
                <button 
                  onClick={handleUploadGallery}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-[2] py-4 rounded-2xl bg-[#BDE8F5] text-[#0F2854] font-black uppercase text-xs shadow-lg shadow-[#BDE8F5]/20 disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="animate-spin inline mr-2" size={16}/> : <Send className="inline mr-2" size={16}/>}
                  Lưu & Cập nhật kho ảnh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CHAT GIỮ NGUYÊN */}
        {showChatModal && selectedChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-[32px] border border-photo-gold/30">
              <button onClick={() => setShowChatModal(false)} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full"><XCircle size={24} /></button>
              <ChatRoom bookingId={selectedChat.id} currentUser={currentUserFullName} currentUserId={currentUserId} isPaid={['paid', 'completed'].includes(selectedChat.status?.toLowerCase())} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingManager;