import React, { useState } from 'react';
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
import { ImagePlus, Send, X, Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]); 
  const [previews, setPreviews] = useState([]);    
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setImageFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return alert("Vui lòng chọn ít nhất 1 tấm ảnh!");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Title', title);
      formData.append('Description', description);
      
      imageFiles.forEach(file => {
        formData.append('Images', file, file.name); 
      });

      await axiosClient.post('/Posts/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("🎉 Album ảnh của bạn đã được đăng thành công!");
      navigate('/'); 

    } catch (error) {
      if (error.response?.data?.errors) {
          const errs = error.response.data.errors;
          let msg = "TÌM THẤY LỖI TỪ BACKEND C#:\n\n";
          for (let key in errs) {
              msg += `❌ Biến [${key}]: ${errs[key][0]}\n`;
          }
          alert(msg);
          console.log("Chi tiết lỗi:", errs);
      } else {
          alert("Lỗi Server: " + (error.response?.data || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A15]">
      <Navbar />
      <main className="pt-28 px-6 pb-12 max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          {/* Đổi màu icon Camera sang xanh #BDE8F5 */}
          <div className="p-3 bg-[#BDE8F5] rounded-2xl rotate-3 shadow-[0_0_20px_rgba(189,232,245,0.3)] transition-transform hover:rotate-0 duration-300">
            <Camera className="text-[#0F2854]" size={24} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Đăng tác phẩm mới</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="preview" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {/* Label thêm ảnh: Hover sang màu xanh #BDE8F5 */}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[#BDE8F5]/50 hover:bg-[#BDE8F5]/5 transition-all group shadow-sm">
              <ImagePlus size={32} className="text-gray-500 group-hover:text-[#BDE8F5] mb-2 transition-colors" />
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-white transition-colors">Thêm ảnh</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
            </label>
          </div>

          <div className="bg-[#0F172A]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] space-y-6 shadow-2xl">
            <div>
              <label className="block text-gray-400 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Tiêu đề bộ ảnh</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Vd: Nắng thủy tinh - Lookbook 2026" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#BDE8F5] focus:ring-1 focus:ring-[#BDE8F5]/50 outline-none transition-all font-medium placeholder:text-gray-600" 
                required 
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Mô tả câu chuyện</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Chia sẻ một chút về cảm hứng của bộ ảnh này..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#BDE8F5] focus:ring-1 focus:ring-[#BDE8F5]/50 outline-none transition-all h-36 resize-none placeholder:text-gray-600" 
                required 
              />
            </div>

            {/* Nút gửi: Đổi sang màu xanh #BDE8F5 với hiệu ứng Highlight khi click */}
            <button 
  type="submit" 
  disabled={loading} 
  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
    loading 
      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
      : 'bg-[#BDE8F5] text-[#0F2854] hover:bg-white hover:shadow-[0_0_20px_rgba(189,232,245,0.5)]'
  }`}
>
  {loading ? (
    <>
      <Loader2 className="animate-spin" size={20} /> 
      ĐANG ĐẨY ẢNH LÊN CLOUDINARY...
    </>
  ) : (
    <>
      <Send size={20} /> 
      XÁC NHẬN ĐĂNG ALBUM ({imageFiles.length})
    </>
  )}
</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;