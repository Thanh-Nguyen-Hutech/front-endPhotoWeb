import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Banner from './components/Banner';
import axiosClient from './utils/axiosClient';
import { Loader, Heart, MessageCircle, Share2, Camera, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // ✅ Đã thêm import useNavigate

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ Khởi tạo navigate

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosClient.get('/Posts');
        const data = Array.isArray(response.data) ? response.data : [];
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
    <div className="min-h-screen bg-photo-black text-white">
      <Navbar />
      
      <main className="pt-24 px-6 pb-12 max-w-[1400px] mx-auto">
        <Banner />

        <div className="flex items-center justify-between mb-10 mt-12">
            <h2 className="text-3xl font-black border-l-4 border-photo-gold pl-4 uppercase tracking-tighter flex items-center gap-3">
              <ImageIcon className="text-photo-gold" size={28} />
              Khám phá nghệ thuật
            </h2>
            <div className="hidden md:block">
                <span className="text-xs text-gray-500 font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  Sáng tạo mới nhất
                </span>
            </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-photo-gold/20 border-t-photo-gold rounded-full animate-spin"></div>
                <Camera className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-photo-gold" size={24} />
            </div>
            <p className="text-photo-gold font-bold animate-pulse tracking-widest uppercase text-xs">Đang tải khoảnh khắc...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
             <div className="p-6 bg-white/5 rounded-full mb-6 text-gray-600"><Camera size={48} /></div>
             <p className="text-gray-500 font-bold text-xl">Chưa có tác phẩm nào được chia sẻ.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {posts.map((post) => {
              
              const firstPhotoUrl = post.photos && post.photos.length > 0 ? post.photos[0].url : null;
              const displayImage = firstPhotoUrl ? firstPhotoUrl.replace("http://", "https://") : FALLBACK_IMAGE;

              return (
                // ✅ Đã thêm onClick={() => navigate(`/post/${post.id}`)}
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/post/${post.id}`)} 
                  className="break-inside-avoid glass rounded-[24px] overflow-hidden group cursor-pointer border border-white/5 hover:border-photo-gold/40 transition-all duration-500 shadow-2xl"
                >
                  
                  <div className="relative overflow-hidden bg-gray-900 min-h-[150px]">
                    <img 
                      src={displayImage} 
                      alt={post.title} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }} 
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                       <div className="flex items-center gap-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-white">
                          {/* Đã lấy post.likesCount (từ C#) và post.comments.length (vì C# trả về mảng bình luận) */}
                          <button 
                            className="flex items-center gap-2 hover:text-photo-gold transition-colors font-bold text-sm"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                // Tương lai có thể gọi API thả tim nhanh ở đây
                            }}
                          >
                            <Heart size={20} className={post.likesCount > 0 ? "fill-red-500 text-red-500" : ""} /> 
                            {post.likesCount || 0}
                          </button>

                          <button className="flex items-center gap-2 hover:text-photo-gold transition-colors font-bold text-sm">
                            <MessageCircle size={20} /> 
                            {post.comments?.length || 0} {/* Đổi thành post.comments?.length */}
                          </button>
                          <button 
                            className="ml-auto hover:text-photo-gold transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                // Logic share
                            }}
                          >
                            <Share2 size={20} />
                          </button>
                       </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/[0.02]">
                    <h3 className="text-white font-bold truncate text-lg group-hover:text-photo-gold transition-colors mb-4">
                      {post.title}
                    </h3>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-photo-gold to-yellow-600 p-[1.5px]">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] text-photo-gold font-black uppercase">
                            {post.photographerName?.[0] || 'P'}
                          </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold leading-none">
                                {post.photographerName || "NAG Giấu Tên"}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1 font-bold italic">
                                Photographer
                            </span>
                        </div>
                      </div>
                      
                      {post.photos?.length > 1 && (
                        <div className="bg-white/10 px-2 py-1 rounded-md text-[10px] font-bold text-gray-400 border border-white/5">
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