import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
import { Camera, Image as ImageIcon, ArrowLeft, Heart } from 'lucide-react';

const PhotographerProfile = () => {
  const { name } = useParams(); 
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotographerPosts = async () => {
      try {
        const response = await axiosClient.get(`/Posts?PhotographerName=${name}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setPosts(data.reverse());
      } catch (error) {
        console.error("Lỗi tải trang cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotographerPosts();
  }, [name]);

  // Tính tổng số lượt Tim của tất cả bài đăng
  const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || 0), 0);

  return (
    <div className="min-h-screen bg-photo-black text-white">
      <Navbar />
      <main className="pt-24 px-6 pb-12 max-w-[1000px] mx-auto">
        
        {/* Nút quay lại */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-photo-gold w-fit mb-4 transition-colors font-bold uppercase text-sm tracking-widest">
          <ArrowLeft size={20} /> Trở về
        </button>

        {/* Header Trang cá nhân */}
        <div className="flex flex-col items-center justify-center mb-12 border-b border-white/10 pb-8 mt-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-photo-gold to-yellow-600 p-1 mb-4">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-black text-photo-gold uppercase">
              {name?.[0] || 'P'}
            </div>
          </div>
          <h1 className="text-3xl font-black">{name}</h1>
          <p className="text-photo-gold font-bold uppercase tracking-widest text-sm mt-1">Nhiếp Ảnh Gia</p>
          
          <div className="flex gap-8 mt-6 text-center">
             <div><span className="block font-black text-xl">{posts.length}</span><span className="text-xs text-gray-400">Tác phẩm</span></div>
             <div><span className="block font-black text-xl">{totalLikes}</span><span className="text-xs text-gray-400">Lượt thích</span></div>
          </div>
        </div>

        {/* Lưới ảnh (Grid Style Instagram) */}
        {loading ? (
           <div className="text-center text-photo-gold flex flex-col items-center gap-2"><Camera className="animate-pulse" size={32} /> Đang tải...</div>
        ) : posts.length === 0 ? (
           <p className="text-center text-gray-500">Thợ chụp này chưa có tác phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map(post => {
              const firstImage = post.photos?.[0]?.url?.replace("http://", "https://") || "";
              return (
                <div 
                  key={post.id} 
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="aspect-square bg-gray-900 cursor-pointer group relative overflow-hidden rounded-md md:rounded-xl"
                >
                  <img src={firstImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Lớp phủ đen khi hover hiện số Tim/Comment */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 font-bold text-lg">
                    <span className="flex items-center gap-2"><Heart className="fill-white" size={24} /> {post.likesCount}</span>
                  </div>

                  {/* Icon Album góc phải nếu có nhiều ảnh */}
                  {post.photos?.length > 1 && (
                     <div className="absolute top-2 right-2 md:top-3 md:right-3"><ImageIcon className="text-white drop-shadow-md" size={20} /></div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PhotographerProfile;