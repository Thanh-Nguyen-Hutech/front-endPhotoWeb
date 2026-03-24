import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
// Đã thêm icon Trash2 (Thùng rác)
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, Send, ArrowLeft, Loader2, Trash2 } from 'lucide-react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop";

const PostDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axiosClient.get(`/Posts/${id}`);
        setPost(response.data);
        setLikeCount(response.data.likesCount || 0);
        
        // Nhận mảng comments thật từ Backend
        setComments(response.data.comments || []); 
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetail();
  }, [id]);

  const nextImage = (e) => {
    e.stopPropagation();
    if (post?.photos && currentImgIndex < post.photos.length - 1) {
      setCurrentImgIndex(prev => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImgIndex > 0) {
      setCurrentImgIndex(prev => prev - 1);
    }
  };

  // ✅ 1. HÀM XÓA BÀI ĐĂNG (Đã nối API C#)
  const handleDelete = async () => {
    const isConfirm = window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa bộ ảnh này không? Dữ liệu không thể khôi phục!");
    if (!isConfirm) return;

    try {
      await axiosClient.delete(`/Posts/${id}`);
      alert("✅ Đã xóa bài đăng và toàn bộ ảnh trên Cloudinary thành công!");
      navigate('/'); // Đá về trang chủ sau khi xóa
    } catch (error) {
      console.error(error);
      alert("❌ Lỗi: Bạn không có quyền xóa bài này (Chỉ tác giả mới được xóa)!");
    }
  };

  // ✅ 1. HÀM THẢ TIM ĐÃ NỐI API
  const handleLike = async () => {
    try {
      // Đổi màu tim và cộng/trừ số đếm ngay lập tức cho mượt (Optimistic UI)
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      // Gọi API sang C# để lưu vào SQL Server
      await axiosClient.post(`/Posts/${id}/like`); 
    } catch (error) {
      // Nếu API báo lỗi (vd: chưa đăng nhập), tự động lùi lại trạng thái cũ
      setIsLiked(!isLiked); 
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      
      if(error.response?.status === 401) {
          alert("Bạn cần đăng nhập để thả tim nhé!");
      } else {
          console.error("Lỗi thả tim:", error);
      }
    }
  };

  // ✅ 2. HÀM GỬI BÌNH LUẬN ĐÃ NỐI API
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      // Gọi API gửi chữ (text) lên cho C# theo chuẩn CommentDto
      const response = await axiosClient.post(`/Posts/${id}/comment`, { 
          Text: commentText 
      });

      // C# lưu xong sẽ trả về 1 object chứa { id, author, text }
      // Ta lấy cục data đó nhét vào cuối danh sách bình luận hiện tại
      setComments([...comments, response.data]);
      
      // Xóa trắng ô nhập chữ
      setCommentText('');
    } catch (error) {
      if(error.response?.status === 401) {
          alert("Bạn cần đăng nhập để bình luận nhé!");
      } else {
          console.error("Lỗi bình luận:", error);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-photo-black flex items-center justify-center"><Loader2 className="animate-spin text-photo-gold" size={48} /></div>;
  if (!post) return <div className="min-h-screen bg-photo-black flex items-center justify-center text-white">Không tìm thấy bài đăng hoặc Backend chưa có API GET /api/Posts/{id}</div>;

  const images = post.photos?.length > 0 
    ? post.photos.map(p => p.url.replace("http://", "https://")) 
    : [FALLBACK_IMAGE];

  return (
    <div className="min-h-screen bg-photo-black text-white">
      <Navbar />
      
      <main className="pt-24 px-4 pb-8 max-w-[1200px] mx-auto min-h-[calc(100vh-80px)] flex flex-col">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-photo-gold w-fit mb-4 transition-colors font-bold uppercase text-sm tracking-widest">
          <ArrowLeft size={20} /> Quay lại thư viện
        </button>

        <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col md:flex-row border border-white/10 shadow-2xl">
          
          {/* CỘT TRÁI (SLIDER ẢNH) */}
          <div className="w-full md:w-[60%] bg-black relative flex items-center justify-center min-h-[400px] md:min-h-full group">
            <img 
              src={images[currentImgIndex]} 
              alt={post.title} 
              className="max-w-full max-h-[80vh] object-contain transition-all duration-300"
            />

            {currentImgIndex > 0 && (
              <button onClick={prevImage} className="absolute left-4 bg-black/50 hover:bg-photo-gold text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft size={24} />
              </button>
            )}

            {currentImgIndex < images.length - 1 && (
              <button onClick={nextImage} className="absolute right-4 bg-black/50 hover:bg-photo-gold text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight size={24} />
              </button>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 flex gap-2">
                {images.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImgIndex ? 'bg-photo-gold w-6' : 'bg-white/50'}`} />
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI (THÔNG TIN & TƯƠNG TÁC) */}
          <div className="w-full md:w-[40%] flex flex-col bg-gradient-to-b from-white/[0.05] to-transparent border-l border-white/10">
            
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div 
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/profile/${post.photographerName}`)} // Bấm vào tên để sang trang Cá nhân
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-photo-gold to-yellow-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-black">
                    {post.photographerName?.[0] || 'P'}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">{post.photographerName || "NAG Giấu Tên"}</h3>
                  <p className="text-xs text-photo-gold font-bold">Photographer</p>
                </div>
              </div>
              
              {/* ✅ NÚT LIÊN HỆ & NÚT XÓA BÀI */}
              <div className="flex items-center gap-2">
                <button className="text-sm font-bold bg-white/10 hover:bg-photo-gold hover:text-black px-4 py-2 rounded-full transition-colors">
                  Liên hệ
                </button>
                <button onClick={handleDelete} title="Xóa bài đăng này" className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
              <div>
                <h1 className="text-2xl font-black mb-2 uppercase tracking-tight text-photo-gold">{post.title}</h1>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{post.description}</p>
                <p className="text-xs text-gray-500 mt-3 font-bold">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>

              <div className="h-[1px] bg-white/10 w-full"></div>

              <div className="space-y-4">
                {comments.map(cmt => (
                  <div key={cmt.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">
                      {cmt.author[0]}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-gray-200 mr-2">{cmt.author}</span>
                      <span className="text-sm text-gray-400">{cmt.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-5 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={handleLike} className="flex items-center gap-2 group transition-all">
                  <Heart size={28} className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-red-400'}`} /> 
                  <span className="font-bold text-lg">{likeCount}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                  <MessageCircle size={28} /> <span className="font-bold text-lg">{comments.length}</span>
                </button>
                <button className="ml-auto hover:text-photo-gold transition-colors">
                  <Share2 size={26} />
                </button>
              </div>
              <p className="text-sm font-bold text-gray-400 mb-4">{likeCount} lượt yêu thích</p>

              <form onSubmit={handleComment} className="flex items-center relative">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Thêm bình luận..." 
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white focus:border-photo-gold outline-none transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!commentText.trim()}
                  className="absolute right-3 text-photo-gold disabled:text-gray-600 hover:scale-110 transition-transform"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetail;