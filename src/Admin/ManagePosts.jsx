import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Trash2, ExternalLink, Loader2, Image as ImageIcon, Search } from 'lucide-react';

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axiosClient.get('/Posts');
      setPosts(Array.isArray(res.data) ? res.data.reverse() : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách bài đăng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId, title) => {
    if (!window.confirm(`⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA BÀI VIẾT: "${title}"?\nHành động này không thể hoàn tác!`)) return;

    try {
      // Gọi API Delete. Đảm bảo Backend C# đã cho phép Admin xóa bài
      await axiosClient.delete(`/Posts/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      alert("✅ Đã xóa bài viết thành công khỏi hệ thống!");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa bài viết.");
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.photographerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Quản lý <span className="text-photo-gold">Bài đăng</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Kiểm duyệt nội dung hệ thống</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề hoặc tác giả..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:border-photo-gold outline-none text-white transition-all"
          />
        </div>
      </div>
      
      <div className="glass p-6 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase text-gray-500 border-b border-white/5">
              <th className="pb-4 pl-4">Ảnh & Tiêu đề</th>
              <th className="pb-4">Tác giả</th>
              <th className="pb-4 text-center">Tương tác</th>
              <th className="pb-4 text-center">Ngày đăng</th>
              <th className="pb-4 text-right pr-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredPosts.map(post => (
              <tr key={post.id} className="group hover:bg-white/[0.02] transition-all">
                <td className="py-4 pl-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden border border-white/10 shrink-0">
                    <img src={post.photos?.[0]?.url || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col max-w-[200px] sm:max-w-xs">
                    <span className="font-bold text-sm text-white truncate">{post.title}</span>
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">{post.photos?.length || 0} Ảnh đính kèm</span>
                  </div>
                </td>
                <td className="py-4 text-photo-gold font-bold text-xs">{post.photographerName}</td>
                <td className="py-4 text-center">
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-black rounded-full border border-red-500/20">
                    {post.likesCount || 0} ❤️
                  </span>
                </td>
                <td className="py-4 text-center text-gray-400 text-xs">
                  {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-4 text-right pr-4 flex justify-end gap-2 items-center h-full">
                  <a href={`/post/${post.id}`} target="_blank" rel="noreferrer" className="p-2 rounded-xl transition-all hover:bg-white/10 text-gray-400 hover:text-white">
                    <ExternalLink size={18}/>
                  </a>
                  <button 
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="p-2 rounded-xl transition-all hover:bg-red-500/20 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePosts;