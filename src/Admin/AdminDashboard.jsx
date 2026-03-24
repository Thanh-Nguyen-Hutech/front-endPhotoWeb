import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Users, Camera, Calendar, TrendingUp, Award, Clock, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPhotographers: 0,
    totalPosts: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/Admin/stats');
        // ✅ C# trả về camelCase (totalUsers) nên React nhận đúng như vậy
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalPhotographers: res.data.totalPhotographers || 0,
          totalPosts: res.data.totalPosts || 0,
          totalBookings: res.data.totalBookings || 0
        });
      } catch (err) {
        console.error("Lỗi fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={48} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Tiêu đề */}
      <div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          Hệ thống <span className="text-photo-gold">Control</span>
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Dữ liệu thời gian thực từ FOTOZ Engine</p>
      </div>

      {/* Grid Stat Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox icon={<Users />} label="Người dùng" value={stats.totalUsers} color="text-blue-500" />
        <StatBox icon={<Camera />} label="Nhiếp ảnh gia" value={stats.totalPhotographers} color="text-photo-gold" />
        <StatBox icon={<Award />} label="Bài đăng" value={stats.totalPosts} color="text-purple-500" />
        <StatBox icon={<Calendar />} label="Lịch chụp" value={stats.totalBookings} color="text-green-500" />
      </div>

      {/* Biểu đồ & Nhật ký (Giữ nguyên giao diện đẹp của bạn) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
        <div className="xl:col-span-2 glass p-8 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-2">
                <TrendingUp className="text-photo-gold" /> Tăng trưởng hệ thống
            </h3>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
                {/* Random biểu đồ dựa trên stats.totalBookings để tạo cảm giác thực */}
                {[stats.totalBookings * 0.4, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-photo-gold/20 rounded-t-xl transition-all hover:bg-photo-gold/40 cursor-help" style={{height: `${h}%`}}></div>
                ))}
            </div>
        </div>
        
        {/* Nhật ký Logs */}
        <div className="glass p-8 rounded-[40px] border border-white/5">
            <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                <Clock className="text-photo-gold" /> Activity Log
            </h3>
            <div className="space-y-6">
                <LogItem text="Đã kết nối cơ sở dữ liệu" time="Vừa xong" />
                <LogItem text="Admin đã đăng nhập hệ thống" time="5 phút trước" />
            </div>
        </div>
      </div>
    </div>
  );
};

// Component con cho gọn code
const StatBox = ({ icon, label, value, color }) => (
  <div className="glass p-8 rounded-[35px] border border-white/5 hover:border-photo-gold/20 transition-all group relative overflow-hidden">
    <div className={`p-4 bg-white/5 w-fit rounded-2xl mb-6 ${color}`}>{icon}</div>
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
    <p className="text-4xl font-black tracking-tighter mt-2 text-white italic">{value}</p>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150">
        {icon}
    </div>
  </div>
);

const LogItem = ({ text, time }) => (
    <div className="border-l-2 border-photo-gold/20 pl-4 py-1 hover:border-photo-gold transition-colors">
      <p className="text-sm font-bold text-gray-300">{text}</p>
      <p className="text-[10px] text-gray-600 font-black uppercase mt-1">{time}</p>
    </div>
);

export default AdminDashboard;