import React from 'react';

const PostCard = ({ post }) => {
  // Lấy ảnh đầu tiên của bài đăng (nếu có)
  const coverImage = post.photos && post.photos.length > 0 ? post.photos[0].url : 'https://via.placeholder.com/400x600?text=No+Image';

  return (
    <div className="break-inside-avoid mb-6 group relative overflow-hidden rounded-3xl cursor-pointer bg-white/5 border border-white/10">
      <img 
        src={coverImage} 
        alt={post.title}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Lớp phủ Gradient đen khi hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <h3 className="font-bold text-xl text-white mb-1">{post.title}</h3>
        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{post.description}</p>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-photo-gold flex items-center justify-center text-black text-xs font-bold">
            {post.photographerName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-photo-gold">{post.photographerName}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;