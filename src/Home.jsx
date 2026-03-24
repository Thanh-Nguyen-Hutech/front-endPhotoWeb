import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import axiosClient from './utils/axiosClient';
import { Heart, MessageCircle, Share2, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosClient.get('/Posts');
        const data = Array.isArray(response.data) ? response.data : [];
        // Đảo ngược để bài mới nhất lên đầu
        setPosts(data.reverse()); 
      } catch (error) {
        console.error("Lỗi tải bài đăng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="pt-24 px-6 pb-12 max-w-[1400px] mx-auto">
        <Banner />

        {/* Tiêu đề mục khám phá */}
        <div className="flex items-center justify-between mb-10 mt-16">
            <h2 className="text-3xl md:text-4xl font-black border-l-4 border-photo-gold pl-5 uppercase tracking-tighter flex items-center gap-3 italic">
              <ImageIcon className="text-photo-gold" size={32} />
              Khám phá nghệ thuật
            </h2>
            <div className="hidden md:block">
                <span className="text-[10px] text-photo-gold font-black uppercase tracking-[0.3em] bg-photo-gold/10 px-5 py-2.5 rounded-full border border-photo-gold/20 shadow-lg shadow-photo-gold/5">
                  Sáng tạo mới nhất
                </span>
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative">
                <div className="w-20 h-20 border-4 border-photo-gold/10 border-t-photo-gold rounded-full animate-spin"></div>
                <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-photo-gold" size={28} />
            </div>
            <p className="text-photo-gold font-black tracking-[0.2em] uppercase text-xs animate-pulse">Đang tải khoảnh khắc...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
             <div className="p-8 bg-white/5 rounded-full mb-6 text-gray-600 shadow-inner"><Camera size={56} /></div>
             <p className="text-gray-500 font-black uppercase tracking-widest text-lg">Chưa có tác phẩm nào.</p>
          </div>
        ) : (
          /* ✅ ĐÃ SỬA: Chuyển từ columns sang grid để các hàng luôn thẳng tắp */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((post) => {
              
              const firstPhotoUrl = post.photos && post.photos.length > 0 ? post.photos[0].url : null;
              // Chống lỗi Mixed Content (http sang https)
              const displayImage = firstPhotoUrl ? firstPhotoUrl.replace("http://", "https://") : FALLBACK_IMAGE;

              return (
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/post/${post.id}`)} 
                  className="glass rounded-[32px] overflow-hidden group cursor-pointer border border-white/5 hover:border-photo-gold/40 transition-all duration-500 shadow-2xl flex flex-col h-full hover:-translate-y-2"
                >
                  
                  {/* ✅ KHUNG ẢNH: Tỉ lệ 4:5 chuẩn Portfolio quốc tế */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-900 shadow-inner">
                    <img 
                      src={displayImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }} 
                    />
                    
                    {/* Overlay Gradient khi hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                       <div className="flex items-center gap-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-white">
                          <div className="flex items-center gap-2 font-black text-sm">
                            <Heart size={20} className={post.likesCount > 0 ? "fill-red-500 text-red-500" : ""} /> 
                            {post.likesCount || 0}
                          </div>
                          <div className="flex items-center gap-2 font-black text-sm">
                            <MessageCircle size={20} className="text-photo-gold" /> 
                            {post.comments?.length || 0}
                          </div>
                          <button className="ml-auto p-2 bg-white/10 rounded-full hover:bg-photo-gold hover:text-black transition-all">
                            <Share2 size={16} />
                          </button>
                       </div>
                    </div>
                  </div>

                  {/* ✅ NỘI DUNG DƯỚI ẢNH */}
                  <div className="p-6 flex flex-col flex-grow justify-between bg-white/[0.01]">
                    <div className="mb-6">
                      <h3 className="text-white font-black truncate text-lg group-hover:text-photo-gold transition-colors uppercase tracking-tight italic">
                        {post.title}
                      </h3>
                    </div>
                    
                    {/* Footer của Card: Thông tin NAG */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-photo-gold to-orange-500 p-[1.5px] shadow-lg">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] text-photo-gold font-black uppercase border border-black">
                            {post.photographerName?.[0] || 'P'}
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-white text-[13px] font-black leading-none truncate">
                                {post.photographerName || "NAG Giấu Tên"}
                            </span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-1 font-bold italic">
                                Professional
                            </span>
                        </div>
                      </div>
                      
                      {post.photos?.length > 1 && (
                        <div className="bg-white/10 px-2 py-1 rounded-lg text-[9px] font-black text-gray-400 border border-white/5 uppercase tracking-tighter">
                            +{post.photos.length - 1} ảnh
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;