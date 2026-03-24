import React, { useState, useEffect } from 'react';
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
import { 
  LayoutDashboard, Image as ImageIcon, Heart, 
  MessageSquare, Settings, ChevronRight, Star,
  Clock, CheckCircle, Trash2, Edit3, Loader2, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhotographerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPosts: 0, totalLikes: 0, pendingJobs: 0 });
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin từ local
  const fullName = localStorage.getItem('fullName') || "Nhiếp ảnh gia";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Lấy danh sách bài đăng của chính thợ này
        const postsRes = await axiosClient.get(`/Posts?PhotographerName=${fullName}`);
        const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
        setMyPosts(posts);

        // 2. Lấy lịch sử để đếm Job đang chờ (Status: Pending)
        const bookingsRes = await axiosClient.get('/Bookings/my-history');
        const bookingData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        const pending = bookingData.filter(b => b.status === 'Pending').length;

        // 3. Tính toán thống kê
        const likes = posts.reduce((sum, p) => sum + (p.likesCount || 0), 0);
        setStats({
          totalPosts: posts.length,
          totalLikes: likes,
          pendingJobs: pending
        });

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [fullName]);

  const handleDeletePost = async (id) => {
    if(!window.confirm("Bạn có chắc muốn xóa bộ ảnh này khỏi hệ thống và Cloudinary?")) return;
    try {
      await axiosClient.delete(`/Posts/${id}`);
      setMyPosts(prev => prev.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
    } catch (error) {
      alert("Không thể xóa bài viết. Vui lòng thử lại sau!");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-photo-gold">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black tracking-[0.2em] uppercase text-sm">Đang đồng bộ dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <div className="pt-28 px-6 pb-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR TRÁI */}
        <aside className="w-full lg:w-64 space-y-2">
          <div className="p-5 bg-photo-gold/10 border border-photo-gold/20 rounded-3xl mb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-photo-gold/60 mb-1">Thợ chụp hiện tại</p>
            <p className="font-black truncate text-lg uppercase tracking-tighter">{fullName}</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-photo-gold text-black font-black transition-all">
              <div className="flex items-center gap-3"><LayoutDashboard size={20} /> Dashboard</div>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('/booking-manager')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold">
              <Clock size={20} /> Quản lý lịch chụp
            </button>
            <button onClick={() => navigate('/create-post')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold">
              <ImageIcon size={20} /> Đăng bài mới
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all font-bold mt-10">
              <LogOut size={20} /> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* NỘI DUNG CHÍNH */}
        <main className="flex-1 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<ImageIcon className="text-blue-400" />} label="Tổng bài đăng" value={stats.totalPosts} />
            <StatCard icon={<Heart className="text-red-500" />} label="Tổng lượt thích" value={stats.totalLikes} />
            <StatCard icon={<Star className="text-yellow-400" />} label="Job đang chờ" value={stats.pendingJobs} highlight />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[40px] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tighter">Bộ sưu tập Portfolio</h3>
                <button 
                  onClick={() => navigate(`/profile/${encodeURIComponent(fullName)}`)} 
                  className="text-xs font-black text-photo-gold hover:text-white transition-colors uppercase tracking-widest border-b border-photo-gold"
                >
                  Xem trang cá nhân
                </button>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                {myPosts.length === 0 ? (
                  <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <ImageIcon size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-500 font-bold">Bạn chưa đăng tác phẩm nào.</p>
                  </div>
                ) : (
                  myPosts.map(post => (
                    <div key={post.id} className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 group hover:border-photo-gold/30 transition-all">
                      <img src={post.photos[0]?.url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black truncate group-hover:text-photo-gold transition-colors text-sm uppercase">{post.title}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                          {post.likesCount} Tim • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/post/${post.id}`)}
                          className="p-2 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)} 
                          className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
               <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-photo-gold to-yellow-600 text-black relative overflow-hidden group">
                  <Star className="absolute -right-4 -top-4 w-32 h-32 text-black/10 rotate-12 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-black mb-2 leading-none uppercase tracking-tighter">Nâng cấp Profile?</h3>
                  <p className="font-bold text-sm opacity-80 mb-8 max-w-[200px]">Đăng thêm 3 bài viết mỗi tuần để tăng 40% tỉ lệ khách hàng tìm thấy bạn.</p>
                  <button onClick={() => navigate('/create-post')} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-gray-900 transition-all active:scale-95">
                    Đăng ngay
                  </button>
               </div>
               
               <div className="glass p-8 rounded-[40px] border border-white/5">
                  <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Hoạt động hệ thống</h3>
                  <div className="space-y-6">
                    <NotificationItem icon={<CheckCircle size={18} className="text-green-500"/>} text="Hệ thống đã phê duyệt bộ ảnh mới của bạn." time="2 giờ trước" />
                    <NotificationItem icon={<MessageSquare size={18} className="text-blue-500"/>} text="Có khách hàng vừa bình luận vào bài viết của bạn." time="5 giờ trước" />
                    <NotificationItem icon={<Star size={18} className="text-yellow-500"/>} text="Bạn nhận được đánh giá 5 sao từ buổi chụp Cưới." time="1 ngày trước" />
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sub-components giữ nguyên cấu hình nhưng tối ưu CSS
const StatCard = ({ icon, label, value, highlight }) => (
  <div className={`glass p-6 rounded-[32px] border border-white/5 flex items-center gap-5 transition-all hover:translate-y-[-4px] ${highlight ? 'ring-2 ring-photo-gold/20' : ''}`}>
    <div className="p-4 bg-white/5 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
  </div>
);

const NotificationItem = ({ icon, text, time }) => (
  <div className="flex gap-4 group cursor-default">
    <div className="mt-1 p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-sm font-bold text-gray-300 leading-snug">{text}</p>
      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{time}</p>
    </div>
  </div>
);

export default PhotographerDashboard;