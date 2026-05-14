import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { ShieldAlert, CheckCircle, Clock, Loader2, Search, User } from 'lucide-react';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axiosClient.get('/Admin/reports');
      setReports(res.data);
    } catch (err) {
      console.error("Lỗi lấy báo cáo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    if (!window.confirm("Xác nhận bạn đã fix xong lỗi này?")) return;

    try {
      const res = await axiosClient.put(`/Admin/reports/${id}/resolve`);
      
      // Cập nhật lại UI ngay lập tức
      setReports(prev => prev.map(r => r.id === id ? { ...r, isResolved: true } : r));
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      alert("Lỗi khi xử lý báo cáo.");
    }
  };

  const filteredReports = reports.filter(r => 
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Báo cáo <span className="text-red-500">Lỗi Hệ Thống</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Lắng nghe phản hồi từ người dùng</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Tìm lỗi hoặc tên người gửi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:border-red-500 outline-none text-white transition-all"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredReports.length === 0 ? (
          <div className="glass text-center py-20 rounded-[32px] border border-dashed border-white/10">
            <ShieldAlert size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Tuyệt vời! Không có báo cáo lỗi nào.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className={`glass p-6 rounded-[24px] border transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${report.isResolved ? 'border-white/5 opacity-60' : 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]'}`}>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  {report.isResolved ? (
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[9px] font-black rounded-full uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                      <CheckCircle size={10}/> Đã Fix
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[9px] font-black rounded-full uppercase tracking-widest border border-red-500/20 flex items-center gap-1 animate-pulse">
                      <Clock size={10}/> Chờ xử lý
                    </span>
                  )}
                  <h3 className="text-lg font-black text-white">{report.title}</h3>
                </div>
                
                <p className="text-gray-400 text-sm font-medium">{report.content}</p>
                
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-2">
                  <span className="flex items-center gap-1"><User size={12}/> {report.userName} ({report.userEmail})</span>
                  <span>•</span>
                  <span>{new Date(report.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>

              {!report.isResolved && (
                <button 
                  onClick={() => handleResolve(report.id)}
                  className="shrink-0 bg-white/5 hover:bg-green-500/20 text-white hover:text-green-500 border border-white/10 hover:border-green-500/30 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Đánh dấu xong
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageReports;