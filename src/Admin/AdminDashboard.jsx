import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router-dom';
import { exportToExcel } from '../utils/exportData'; 
import { Users, Camera, Calendar, Award, Loader2, Zap, ShieldAlert, ArrowRight, FileSpreadsheet, Activity, TrendingUp, Star, CheckCircle, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // 🌟 MỞ RỘNG STATE: Chuẩn bị sẵn các ô trống để hứng dữ liệu thật từ Backend
  const [stats, setStats] = useState({
    totalUsers: 0, 
    totalPhotographers: 0, 
    totalPosts: 0, 
    totalBookings: 0,
    customerGrowth: "Đang tải...", 
    bookingSuccessRate: "Đang tải...", 
    averageRating: "Đang tải...", 
    paymentStatus: "Đang tải..."
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/Admin/stats');
        
        // 🌟 MAP DỮ LIỆU: Lấy dữ liệu từ Backend đắp vào State (Kèm giá trị dự phòng nếu Backend chưa có)
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalPhotographers: res.data.totalPhotographers || 0,
          totalPosts: res.data.totalPosts || 0,
          totalBookings: res.data.totalBookings || 0,
          customerGrowth: res.data.customerGrowth || "0%",
          bookingSuccessRate: res.data.bookingSuccessRate || "0%",
          averageRating: res.data.averageRating || "0.0/5.0",
          paymentStatus: res.data.paymentStatus || "Không xác định"
        });
      } catch (err) {
        console.error("Lỗi fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExportGeneralReport = () => {
    const currentAdmin = localStorage.getItem("userName") || "System Admin";
    const exportTime = new Date().toLocaleString('vi-VN');

    const reportData = [
      { "Phân loại": "[ THÔNG TIN HỆ THỐNG ]", "Hạng mục": "Ngày xuất báo cáo", "Giá trị": exportTime },
      { "Phân loại": "[ THÔNG TIN HỆ THỐNG ]", "Hạng mục": "Tài khoản thực hiện", "Giá trị": currentAdmin },
      
      { "Phân loại": "", "Hạng mục": "", "Giá trị": "" },
      
      { "Phân loại": "[ THỐNG KÊ DỮ LIỆU ]", "Hạng mục": "Tổng người dùng (Khách hàng)", "Giá trị": stats.totalUsers },
      { "Phân loại": "[ THỐNG KÊ DỮ LIỆU ]", "Hạng mục": "Nhiếp ảnh gia đối tác", "Giá trị": stats.totalPhotographers },
      { "Phân loại": "[ THỐNG KÊ DỮ LIỆU ]", "Hạng mục": "Tổng số bài đăng", "Giá trị": stats.totalPosts },
      { "Phân loại": "[ THỐNG KÊ DỮ LIỆU ]", "Hạng mục": "Tổng giao dịch / Lịch chụp", "Giá trị": stats.totalBookings },
      
      { "Phân loại": "", "Hạng mục": "", "Giá trị": "" },

      // 🌟 XUẤT EXCEL TỪ DỮ LIỆU THẬT
      { "Phân loại": "[ CHỈ SỐ HIỆU QUẢ ]", "Hạng mục": "Tăng trưởng người dùng", "Giá trị": stats.customerGrowth },
      { "Phân loại": "[ CHỈ SỐ HIỆU QUẢ ]", "Hạng mục": "Tỉ lệ chốt lịch thành công", "Giá trị": stats.bookingSuccessRate },
      { "Phân loại": "[ CHỈ SỐ HIỆU QUẢ ]", "Hạng mục": "Đánh giá trung bình", "Giá trị": stats.averageRating },
      { "Phân loại": "[ CHỈ SỐ HIỆU QUẢ ]", "Hạng mục": "Cổng thanh toán VNPay", "Giá trị": stats.paymentStatus },
    ];

    exportToExcel(reportData, `Bao_Cao_He_Thong_FOTOZ_${new Date().getTime()}`);
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={48} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Hệ thống <span className="text-photo-gold">Control</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Dữ liệu thời gian thực từ FOTOZ Engine</p>
        </div>
        
        <button 
          onClick={handleExportGeneralReport}
          className="flex items-center gap-2 bg-photo-gold/10 hover:bg-photo-gold text-photo-gold hover:text-black border border-photo-gold/20 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(250,195,33,0.1)] hover:shadow-[0_0_20px_rgba(250,195,33,0.3)] active:scale-95"
        >
          <FileSpreadsheet size={16} /> Xuất Báo Cáo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox icon={<Users />} label="Người dùng" value={stats.totalUsers} color="text-blue-500" />
        <StatBox icon={<Camera />} label="Nhiếp ảnh gia" value={stats.totalPhotographers} color="text-photo-gold" />
        <StatBox icon={<Award />} label="Bài đăng" value={stats.totalPosts} color="text-purple-500" />
        <StatBox icon={<Calendar />} label="Lịch chụp" value={stats.totalBookings} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
        
        <div className="xl:col-span-2 glass p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5"><Zap size={200} /></div>
            <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2 relative z-10">
                <Zap className="text-photo-gold" /> Lối tắt Quản trị
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                <QuickLinkCard title="Kiểm duyệt Bài đăng" desc="Xóa các bài viết vi phạm tiêu chuẩn cộng đồng." icon={<Award size={24} className="text-purple-500"/>} onClick={() => navigate('/admin/posts')} />
                <QuickLinkCard title="Xử lý Báo cáo lỗi" desc="Xem phản hồi và khiếu nại từ người dùng." icon={<ShieldAlert size={24} className="text-red-500"/>} onClick={() => navigate('/admin/reports')} />
                <QuickLinkCard title="Quản lý Tài khoản" desc="Khóa/Mở khóa hoặc Reset mật khẩu người dùng." icon={<Users size={24} className="text-blue-500"/>} onClick={() => navigate('/admin/users')} />
            </div>
        </div>
        
        <div className="glass p-8 rounded-[40px] border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent relative overflow-hidden">
            <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                <Activity className="text-photo-gold" /> Chỉ số hiệu quả
            </h3>
            
            {/* 🌟 TRUYỀN DỮ LIỆU THẬT VÀO GIAO DIỆN */}
            <div className="space-y-6 relative z-10">
                <PerformanceStat label="Tăng trưởng KH" value={stats.customerGrowth} desc="So với tháng trước" icon={<TrendingUp size={14}/>} color="text-green-500" />
                <PerformanceStat label="Tỉ lệ chốt lịch" value={stats.bookingSuccessRate} desc="Tỉ lệ thành công" icon={<CheckCircle size={14}/>} color="text-blue-500" />
                <PerformanceStat label="Đánh giá dịch vụ" value={stats.averageRating} desc="Điểm trung bình" icon={<Star size={14}/>} color="text-yellow-400" />
                <PerformanceStat label="Cổng thanh toán" value={stats.paymentStatus} desc="Trạng thái kết nối" icon={<CreditCard size={14}/>} color="text-photo-gold" />
            </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, color }) => (
  <div className="glass p-8 rounded-[35px] border border-white/5 hover:border-photo-gold/20 transition-all group relative overflow-hidden">
    <div className={`p-4 bg-white/5 w-fit rounded-2xl mb-6 ${color}`}>{icon}</div>
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
    <p className="text-4xl font-black tracking-tighter mt-2 text-white italic">{value}</p>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150">{icon}</div>
  </div>
);

const QuickLinkCard = ({ title, desc, icon, onClick }) => (
    <div onClick={onClick} className="bg-white/5 border border-white/5 hover:border-photo-gold/30 p-5 rounded-3xl cursor-pointer transition-all hover:-translate-y-1 group">
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
            <ArrowRight size={16} className="text-gray-600 group-hover:text-photo-gold transition-colors" />
        </div>
        <h4 className="font-bold text-white text-sm mt-3">{title}</h4>
        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{desc}</p>
    </div>
);

const PerformanceStat = ({ label, value, desc, icon, color }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
      <div className="flex items-center gap-2 text-gray-400">
        <span className={color}>{icon}</span>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <div className="text-right">
        <span className={`block text-xs font-black tracking-widest ${color}`}>
          {value}
        </span>
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{desc}</span>
      </div>
    </div>
);

export default AdminDashboard;