import React, { useState, useEffect } from 'react';
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
import { 
  LayoutDashboard, Image as ImageIcon, Heart, 
  MessageSquare, Settings, ChevronRight, Star,
  Clock, CheckCircle, Trash2, Loader2, LogOut, X, Phone, MapPin, UserCircle, Camera, DollarSign, Tags
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_CONCEPTS = ['Cá nhân', 'Cặp đôi', 'Nhóm', 'Sự kiện', 'Gia đình', 'Cổ trang', 'Fashion'];

const PhotographerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalPosts: 0, totalLikes: 0, pendingJobs: 0 });
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Modal Cập nhật
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
  // Thêm AvatarFile và BasePrice, Concepts vào Form
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileForm, setProfileForm] = useState({ 
    phoneNumber: '', 
    location: '', 
    bio: '',
    basePrice: '',
    concepts: [] 
  });

  let rawName = localStorage.getItem('fullName');
  const fullName = (rawName && rawName !== 'undefined' && rawName !== 'null' && rawName.trim() !== '') 
                    ? rawName 
                    : ""; 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bookingsRes = await axiosClient.get('/Bookings/my-history');
        const bookingData = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
        const pendingCount = bookingData.filter(b => b.status?.toLowerCase() === 'pending').length;

        // ✅ ĐÃ FIX: Gọi thẳng API my-posts bằng Token bảo mật, không cần tự lọc bằng tên nữa
        const postsRes = await axiosClient.get('/Posts/my-posts');
        const myOwnPosts = Array.isArray(postsRes.data) ? postsRes.data : [];

        const likesCount = myOwnPosts.reduce((sum, p) => sum + (p.likesCount || p.likes || 0), 0);

        setMyPosts(myOwnPosts);
        setStats({
          totalPosts: myOwnPosts.length,
          totalLikes: likesCount,
          pendingJobs: pendingCount
        });

      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []); // Bỏ fullName khỏi dependency vì không dùng để lọc nữa

  const handleDeletePost = async (id) => {
    if(!window.confirm("Bạn có chắc muốn xóa bộ ảnh này khỏi hệ thống?")) return;
    try {
      await axiosClient.delete(`/Posts/${id}`);
      setMyPosts(prev => prev.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
    } catch (error) {
      alert("Không thể xóa bài viết. Vui lòng thử lại sau!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const toggleConcept = (concept) => {
    setProfileForm(prev => {
      const isSelected = prev.concepts.includes(concept);
      if (isSelected) {
        return { ...prev, concepts: prev.concepts.filter(c => c !== concept) };
      } else {
        return { ...prev, concepts: [...prev.concepts, concept] };
      }
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      if (avatarFile) formData.append('AvatarFile', avatarFile);
      if (profileForm.phoneNumber) formData.append('PhoneNumber', profileForm.phoneNumber);
      if (profileForm.location) formData.append('Location', profileForm.location);
      if (profileForm.bio) formData.append('Bio', profileForm.bio);
      if (profileForm.basePrice) formData.append('BasePrice', profileForm.basePrice);
      
      profileForm.concepts.forEach(c => formData.append('Concepts', c));

      await axiosClient.put('/Users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("✅ Cập nhật thông tin thành công! Hãy qua trang Tìm Thợ Ảnh để xem sự thay đổi.");
      setShowProfileModal(false);
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data || "Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-photo-gold">
        <Loader2 className="animate-spin mb-4" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <div className="pt-28 px-6 pb-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 relative">
        <aside className="w-full lg:w-64 space-y-2">
          <div className="p-5 bg-photo-gold/10 border border-photo-gold/20 rounded-3xl mb-6 shadow-[0_0_30px_rgba(250,204,21,0.05)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-photo-gold/60 mb-1">Thợ chụp hiện tại</p>
            <p className="font-black truncate text-lg uppercase tracking-tighter text-white">{fullName || "CHƯA CẬP NHẬT TÊN"}</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-photo-gold text-black font-black transition-all shadow-lg shadow-photo-gold/20">
              <div className="flex items-center gap-3"><LayoutDashboard size={20} /> Dashboard</div>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('/booking-manager')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold">
              <Clock size={20} /> Quản lý lịch chụp
            </button>
            <button onClick={() => navigate('/create-post')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold">
              <ImageIcon size={20} /> Đăng bài mới
            </button>
            <button onClick={() => setShowProfileModal(true)} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-white/5 text-gray-400 hover:text-white transition-all font-bold">
              <Settings size={20} /> Cài đặt thông tin
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-red-500/10 text-red-500 transition-all font-bold mt-10">
              <LogOut size={20} /> Đăng xuất
            </button>
          </nav>
        </aside>

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
                      <img src={post.photos?.[0]?.url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black truncate group-hover:text-photo-gold transition-colors text-sm uppercase">{post.title}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/post/${post.id}`)} className="p-2 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl transition-all"><ChevronRight size={18} /></button>
                        <button onClick={() => handleDeletePost(post.id)} className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
               <div className="glass p-8 rounded-[40px] bg-gradient-to-br from-photo-gold to-yellow-600 text-black relative overflow-hidden group shadow-[0_0_40px_rgba(250,204,21,0.15)]">
                  <Star className="absolute -right-4 -top-4 w-32 h-32 text-black/10 rotate-12 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-black mb-2 leading-none uppercase tracking-tighter">Nâng cấp Profile?</h3>
                  <button onClick={() => navigate('/create-post')} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-2xl hover:bg-gray-900 transition-all active:scale-95 mt-4">Nâng cấp ngay</button>
               </div>
            </div>
          </div>
        </main>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141414] w-full max-w-lg p-8 rounded-[40px] border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-white/5 hover:bg-red-500 p-2 rounded-full transition-all z-10"><X size={20} /></button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Cập nhật <span className="text-photo-gold">Hồ Sơ</span></h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Nổi bật hơn trong mắt khách hàng</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-photo-gold/50 bg-black/50 group shrink-0">
                  <img 
                    src={previewImage || "https://images.unsplash.com/photo-1554080353-a576cf803bda"} 
                    alt="Preview" 
                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                  />
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={28} className="text-photo-gold" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Bấm vào ảnh để đổi Avatar</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group relative">
                  <Phone className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={18} />
                  <input type="text" value={profileForm.phoneNumber} onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})} placeholder="SĐT liên hệ" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-photo-gold outline-none transition-all placeholder:text-gray-600 text-white font-medium" />
                </div>
                
                <div className="group relative">
                  <DollarSign className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={18} />
                  <input type="number" value={profileForm.basePrice} onChange={(e) => setProfileForm({...profileForm, basePrice: e.target.value})} placeholder="Giá mong muốn (VNĐ)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-photo-gold outline-none transition-all placeholder:text-gray-600 text-white font-medium" />
                </div>
              </div>

              <div className="group relative">
                <MapPin className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={18} />
                <input type="text" value={profileForm.location} onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} placeholder="Khu vực hoạt động (Vd: TP.HCM, Hà Nội)" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-photo-gold outline-none transition-all placeholder:text-gray-600 text-white font-medium" />
              </div>

              <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Tags size={16} />
                  <label className="text-[10px] font-black uppercase tracking-widest">Phong cách chụp (Concepts)</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CONCEPTS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleConcept(c)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${profileForm.concepts.includes(c) ? 'bg-photo-gold text-black border-photo-gold' : 'bg-[#141414] text-gray-500 border-white/10 hover:border-photo-gold/40'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group relative">
                <UserCircle className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={18} />
                <textarea value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Vài lời giới thiệu về bản thân..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-photo-gold outline-none transition-all placeholder:text-gray-600 text-white font-medium h-24 resize-none custom-scrollbar" />
              </div>

              <button type="submit" disabled={updatingProfile} className="w-full bg-photo-gold text-black font-black text-xs uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 shadow-lg shadow-photo-gold/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                {updatingProfile ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                {updatingProfile ? 'Đang tải lên hệ thống...' : 'Lưu Hồ Sơ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, highlight }) => (
  <div className={`glass p-6 rounded-[32px] border border-white/5 flex items-center gap-5 transition-all hover:translate-y-[-4px] ${highlight ? 'ring-2 ring-photo-gold/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : ''}`}>
    <div className="p-4 bg-white/5 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
  </div>
);

export default PhotographerDashboard;