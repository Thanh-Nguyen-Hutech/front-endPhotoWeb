import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import axiosClient from './utils/axiosClient';
import { ArrowLeft, MapPin, Heart, Image as ImageIcon, Camera } from 'lucide-react';

const PhotographerProfile = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(name); 
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // ✅ CHỈ LẤY BÀI CỦA ĐÚNG NGƯỜI NÀY
        const response = await axiosClient.get(`/Posts?PhotographerName=${decodedName}`);
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Lỗi khi tải trang cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [decodedName]);

  const totalLikes = posts.reduce((sum, p) => sum + (p.likesCount || p.likes || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-photo-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
            
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-photo-gold to-orange-500 p-1 mb-6 shadow-2xl relative z-10">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-4 border-[#141414] text-4xl font-black text-photo-gold">
                    {decodedName ? decodedName.charAt(0).toUpperCase() : '?'}
                </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-3 relative z-10">
                {decodedName || "Nhiếp ảnh gia ẩn danh"}
            </h1>
            
            <p className="text-gray-400 font-medium max-w-lg mb-8 relative z-10">
                Chào mừng bạn đến với không gian nghệ thuật của tôi. Chuyên chụp ảnh chân dung, kỷ yếu và sự kiện.
            </p>

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
                    <p className="text-3xl font-black text-photo-gold flex items-center justify-center gap-1"><MapPin size={24}/> VN</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Khu vực</p>
                </div>
            </div>

            <button onClick={() => navigate('/book-now')} className="mt-10 bg-photo-gold text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-photo-gold/20 hover:bg-yellow-400 hover:scale-105 transition-all relative z-10">
                Đặt lịch chụp ngay
            </button>
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