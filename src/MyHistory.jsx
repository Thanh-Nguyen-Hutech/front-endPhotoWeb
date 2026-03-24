import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import axiosClient from './utils/axiosClient';
import { History, XCircle, Clock, CheckCircle, Calendar, MapPin, Tag } from 'lucide-react';

const MyHistory = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await axiosClient.get('/Bookings/my-history');
      // Backend trả về mảng, ta đảo ngược để cái mới nhất lên đầu
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
    if (!window.confirm("Bạn có chắc chắn muốn hủy yêu cầu này không?")) return;
    try {
      const response = await axiosClient.patch(`/Bookings/${id}/cancel`);
      alert(`✅ ${response.data.message}`);
      fetchHistory();
    } catch (error) {
      alert(error.response?.data || "Không thể hủy đơn hàng này.");
    }
  };

  const renderStatus = (status) => {
  const s = status?.toLowerCase(); 
  
  switch (s) {
    case 'pending':
      return <span className="flex items-center gap-1 text-photo-gold bg-photo-gold/10 px-3 py-1 rounded-full text-xs font-bold uppercase"><Clock size={14}/> Đang chờ</span>;
    
    // Chấp nhận cả 2 chữ để không bao giờ bị lỗi hiển thị xám/đỏ nữa
    case 'accepted':
    case 'confirmed': 
      return <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold uppercase"><CheckCircle size={14}/> Đã nhận</span>;
    
    case 'cancelled':
    case 'rejected':
      return <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-xs font-bold uppercase"><XCircle size={14}/> Đã hủy/Từ chối</span>;
    
    default:
      return <span className="text-gray-400 text-xs font-bold uppercase border border-white/10 px-3 py-1 rounded-full">{status}</span>;
  }
};

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <main className="pt-28 px-6 pb-12 max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 mb-10 border-l-4 border-photo-gold pl-4">
          <History className="text-photo-gold" size={32} />
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
            Lịch sử hoạt động
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-photo-gold">
            <div className="w-10 h-10 border-4 border-photo-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : historyList.length === 0 ? (
          <div className="glass text-center text-gray-500 py-20 rounded-[32px] border border-dashed border-white/10">
            <p className="text-xl font-bold">Chưa có dữ liệu lịch sử.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {historyList.map((item) => (
              <div key={item.id} className="glass p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5 hover:border-photo-gold/20 transition-all group">
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    {/* AVATAR TỰ ĐỘNG LẤY CHỮ CÁI ĐẦU TÊN NGƯỜI DÙNG */}
                    <div className="w-12 h-12 rounded-full bg-photo-gold/20 flex items-center justify-center text-photo-gold font-black text-xl border border-photo-gold/30">
                      {item.customerName ? item.customerName.charAt(0) : (item.photographerName ? item.photographerName.charAt(0) : "?")}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white group-hover:text-photo-gold transition-colors">
                        {item.customerName || item.photographerName || "Người dùng"}
                      </h3>
                      <div className="mt-1">{renderStatus(item.status)}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Calendar size={16} className="text-photo-gold"/> {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('vi-VN') : "N/A"}</span>
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-photo-gold"/> {item.location}</span>
                    <span className="flex items-center gap-2"><Tag size={16} className="text-photo-gold"/> {item.category || item.serviceType}</span>
                  </div>

                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Ghi chú / Mô tả:</p>
                    <p className="text-sm text-gray-300 italic">"{item.notes || "Không có ghi chú"}"</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 min-w-[150px]">
                   <p className="text-xl font-black text-photo-gold tracking-tighter">
                      {item.maxPrice > 0 ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} VNĐ` : "GIÁ THỎA THUẬN"}
                   </p>
                   
                   {item.status === 'Pending' && (
                    <button 
                      onClick={() => handleCancel(item.id)}
                      className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-lg active:scale-95"
                    >
                      Hủy Yêu Cầu
                    </button>
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

export default MyHistory;