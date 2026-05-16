import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Loader2, BellRing, Key, RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react';

const ManageResetRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/Admin/reset-requests');
      setRequests(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReset = async (email, requestId) => {
    if (!window.confirm(`Xác nhận đặt lại mật khẩu cho tài khoản "${email}" về mặc định (Fotoz@123)?`)) return;
    
    setSubmittingId(requestId);
    try {
      // 🌟 TỐI ƯU: Gửi thẳng Email lên API chuyên dụng để Backend tự xử lý map
      await axiosClient.post(`/Admin/users/reset-by-email`, { email: email });
      alert(`✅ Đã reset mật khẩu thành công cho: ${email}\nMật khẩu mới: Fotoz@123`);
      
      // Xóa bỏ yêu cầu khỏi giao diện ngay lập tức
      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xử lý đặt lại mật khẩu.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white flex items-center gap-3">
            Yêu cầu <span className="text-red-500">Khôi phục</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Danh sách tài khoản khách hàng báo quên mật khẩu ({requests.length})
          </p>
        </div>
        
        <button 
          onClick={fetchRequests}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-all active:scale-95"
        >
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* DANH SÁCH CHI TIẾT */}
      {requests.length === 0 ? (
        <div className="glass p-12 rounded-[32px] border border-white/5 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
            <CheckCircle className="text-green-400" size={32} />
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">Sạch bóng yêu cầu!</p>
          <p className="text-gray-600 text-xs max-w-xs">Hiện tại không có tài khoản nào gửi yêu cầu xin cấp lại mật khẩu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => (
            <div 
              key={req.id} 
              className="glass p-6 rounded-[2rem] border border-red-500/10 bg-gradient-to-b from-red-500/[0.02] to-transparent relative overflow-hidden flex flex-col justify-between h-48 group shadow-2xl transition-all hover:border-red-500/30"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <ShieldAlert size={80} className="text-red-500" />
              </div>

              <div>
                <div className="flex items-center gap-2 text-red-400">
                  <BellRing size={16} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Yêu cầu cấp lại</span>
                </div>
                <h4 className="text-white font-black text-base mt-3 break-all group-hover:text-photo-gold transition-colors">
                  {req.email}
                </h4>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  {req.time}
                </span>
                
                <button 
                  onClick={() => handleQuickReset(req.email, req.id)}
                  disabled={submittingId === req.id}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {submittingId === req.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Key size={12} />
                  )}
                  Reset Ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageResetRequests;