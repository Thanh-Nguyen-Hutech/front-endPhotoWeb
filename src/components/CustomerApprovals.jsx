import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, UserCircle, Bell, Loader2 } from 'lucide-react';

const CustomerApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchApprovals = async () => {
    try {
      const res = await axiosClient.get('/Bookings/my-approvals');
      setApprovals(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách duyệt:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (bookingId, photoName) => {
    if (!window.confirm(`Bạn đồng ý chọn thợ ${photoName} cho buổi chụp này?`)) return;
    try {
      await axiosClient.put(`/Bookings/${bookingId}/approve`);
      alert(`🎉 Đã chốt thợ ${photoName} thành công! Hãy vào Lịch Sử để xem.`);
      fetchApprovals(); // Load lại danh sách
    } catch (error) {
      alert("Lỗi khi duyệt thợ.");
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm("Bạn muốn từ chối thợ này và chờ thợ khác?")) return;
    try {
      await axiosClient.put(`/Bookings/${bookingId}/reject`);
      fetchApprovals(); // Load lại danh sách
    } catch (error) {
      alert("Lỗi khi từ chối.");
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-photo-gold" size={32} /></div>;

  return (
    <div className="bg-[#0F172A]/80 backdrop-blur-md p-6 sm:p-8 rounded-[40px] border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Bell className="text-photo-gold" size={24} />
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">Chờ bạn duyệt</h2>
        {approvals.length > 0 && (
          <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
            {approvals.length} YÊU CẦU MỚI
          </span>
        )}
      </div>

      {approvals.length === 0 ? (
        <p className="text-gray-500 font-bold text-sm text-center py-10 uppercase tracking-widest">
          Hiện chưa có thợ nào ứng tuyển vào Job của bạn.
        </p>
      ) : (
        <div className="space-y-4">
          {approvals.map((item) => (
            <div key={item.bookingId} className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-photo-gold/30 transition-all">
              
              {/* Thông tin thợ */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img 
                  src={item.photographerAvatar || 'https://via.placeholder.com/150'} 
                  alt="avatar" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-photo-gold/50"
                />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                    Muốn nhận Job: <span className="text-photo-gold">{item.jobTitle}</span>
                  </p>
                  <h3 className="text-xl font-black text-white">{item.photographerName}</h3>
                </div>
              </div>

              {/* Các nút hành động */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Nút xem Profile */}
                <button 
                  onClick={() => navigate(`/profile/${item.photographerId}`)}
                  className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-[#BDE8F5]/10 text-[#BDE8F5] font-black text-[10px] uppercase tracking-widest hover:bg-[#BDE8F5] hover:text-[#0F2854] transition-all flex items-center justify-center gap-2"
                >
                  <UserCircle size={16} /> Xem Profile
                </button>

                {/* Nút Đồng ý */}
                <button 
                  onClick={() => handleApprove(item.bookingId, item.photographerName)}
                  className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-green-500/20 text-green-400 font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> Đồng ý
                </button>

                {/* Nút Từ chối */}
                <button 
                  onClick={() => handleReject(item.bookingId)}
                  className="flex-none p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  title="Tìm thợ khác"
                >
                  <XCircle size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerApprovals;