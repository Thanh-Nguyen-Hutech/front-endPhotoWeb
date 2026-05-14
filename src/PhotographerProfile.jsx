import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import axiosClient from './utils/axiosClient';
import { ArrowLeft, MapPin, Heart, Image as ImageIcon, Camera, DollarSign, MessageCircle } from 'lucide-react';

const PhotographerProfile = () => {
  // 🌟 ĐÃ FIX: Nhận ID từ URL thay vì Name
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // 1. Gọi API lấy thông tin Cá nhân bằng ID
        try {
          const profileRes = await axiosClient.get(`/Users/profile/${id}`);
          setProfile(profileRes.data);
        } catch (profileErr) {
          console.error("Lỗi lấy thông tin cá nhân:", profileErr);
        }

        // 2. Gọi API lấy danh sách Bài đăng lọc theo ID
        const postsRes = await axiosClient.get(`/Posts?PhotographerId=${id}`);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);

      } catch (error) {
        console.error("Lỗi khi tải trang cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id]);

  const handleContact = () => {
    const phone = profile?.phoneNumber || "Chưa cập nhật";
    const name = profile?.fullName || "Nhiếp ảnh gia";
    alert(`📞 Kênh liên hệ với ${name}:\nSố điện thoại: ${phone}`);
  };

  const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || p.likes || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-photo-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Tên hiển thị (Phòng trường hợp chưa load xong data)
  const displayName = profile?.fullName || "Nhiếp ảnh gia FOTOZ";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-28 px-4 sm:px-6 pb-12 max-w-[1200px] mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-photo-gold transition-colors font-bold text-xs uppercase tracking-widest mb-8">
          <ArrowLeft size={16} /> Quay lại
        </button>

        {/* BOX THÔNG TIN CÁ NHÂN */}
        <div className="glass p-8 md:p-12 rounded-[40px] border border-white/5 mb-12 relative overflow-hidden flex flex-col items-center text-center shadow-[0_0_40px_rgba(250,204,21,0.05)]">
            <div className="absolute inset-0 bg-gradient-to-b from-photo-gold/5 to-transparent pointer-events-none"></div>
            
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-photo-gold to-orange-500 p-1 mb-6 shadow-2xl relative z-10 overflow-hidden shrink-0">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={displayName} className="w-full h-full object-cover rounded-full border-4 border-[#141414]" />
                ) : (
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-4 border-[#141414] text-4xl font-black text-photo-gold">
                      {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 relative z-10">
                {displayName}
            </h1>
            
            <p className="text-gray-400 font-medium max-w-lg mb-6 relative z-10 whitespace-pre-wrap">
                {profile?.bio || "Chào mừng bạn đến với không gian nghệ thuật của tôi. Nhiếp ảnh gia chưa cập nhật lời giới thiệu."}
            </p>

            {profile?.concepts && profile.concepts.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
                {profile.concepts.map((c, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-photo-gold uppercase tracking-widest">
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-6 md:gap-12 relative z-10">
                <div className="text-center">
                    <p className="text-3xl font-black text-photo-gold">{posts.length}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tác phẩm</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-photo-gold">{totalLikes}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Lượt thích</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-black text-photo-gold flex items-center justify-center gap-1"><MapPin size={24}/> {profile?.location || "VN"}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Khu vực</p>
                </div>
                {profile?.basePrice > 0 && (
                  <div className="text-center hidden sm:block">
                      <p className="text-3xl font-black text-photo-gold flex items-center justify-center gap-1"><DollarSign size={24}/> {profile.basePrice.toLocaleString()}₫</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Giá cơ bản / Buổi</p>
                  </div>
                )}
            </div>

            <div className="flex items-center gap-4 mt-10 relative z-10">
              <button 
                onClick={() => navigate('/book-now', { 
                    state: { 
                        photographerId: profile?.id, 
                        photographerName: profile?.fullName 
                    } 
                })} 
                className="bg-photo-gold text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:bg-yellow-400 hover:scale-105 transition-all relative z-10"
            >
                Đặt lịch chụp ngay
            </button>
              <button onClick={handleContact} className="bg-white/10 text-white border border-white/20 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                  <MessageCircle size={16} /> Liên hệ
              </button>
            </div>
        </div>

        {/* LƯỚI TÁC PHẨM */}
        <div className="mb-8 flex items-center gap-3 border-l-4 border-photo-gold pl-4">
            <Camera className="text-photo-gold" size={28} />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Tác phẩm nổi bật</h2>
        </div>

        {posts.length === 0 ? (
          <div className="glass text-center py-32 rounded-[40px] border border-dashed border-white/10">
            <ImageIcon size={64} className="mx-auto text-gray-700 mb-6" />
            <p className="text-xl font-bold text-gray-400">Thợ chụp này chưa có tác phẩm nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <div key={post.id} onClick={() => navigate(`/post/${post.id}`)} className="group cursor-pointer bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-photo-gold/30 transition-all hover:-translate-y-2 shadow-lg">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={post.photos?.[0]?.url || 'https://via.placeholder.com/400x500'} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-white">{post.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-300 uppercase tracking-widest">
                      <span className="flex items-center gap-1 text-photo-gold"><Heart size={14} className="fill-current"/> {post.likesCount || 0}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PhotographerProfile;