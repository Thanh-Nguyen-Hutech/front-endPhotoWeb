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
      
      // Mẹo nhỏ: Thêm file.name để C# dễ đọc định dạng file hơn
      imageFiles.forEach(file => {
        formData.append('Images', file, file.name); 
      });

      // Thêm lại header này, đối với một số bản Axios mới nó cần thiết để định tuyến Form
      await axiosClient.post('/Posts/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("🎉 Album ảnh của bạn đã được đăng thành công!");
      navigate('/'); 

    } catch (error) {
      // 🔥 ĐOẠN NÀY SẼ ÉP C# KHAI RA LỖI CHÍNH XÁC:
      if (error.response?.data?.errors) {
          const errs = error.response.data.errors;
          let msg = "TÌM THẤY LỖI TỪ BACKEND C#:\n\n";
          for (let key in errs) {
              msg += `❌ Biến [${key}]: ${errs[key][0]}\n`;
          }
          alert(msg); // Hiện thông báo thẳng lên màn hình
          console.log("Chi tiết lỗi:", errs);
      } else {
          alert("Lỗi Server: " + (error.response?.data || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-photo-black">
      <Navbar />
      <main className="pt-28 px-6 pb-12 max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-photo-gold rounded-2xl rotate-3 shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            <Camera className="text-black" size={24} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Đăng tác phẩm mới</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="preview" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <X size={16} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-photo-gold/50 hover:bg-white/5 transition-all group">
              <ImagePlus size={32} className="text-gray-500 group-hover:text-photo-gold mb-2" />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Thêm ảnh</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
            </label>
          </div>

          <div className="glass p-8 rounded-3xl space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-black mb-2 uppercase tracking-[0.2em]">Tiêu đề bộ ảnh</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Vd: Nắng thủy tinh - Lookbook 2026" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white focus:border-photo-gold outline-none transition-all font-medium" required />
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-black mb-2 uppercase tracking-[0.2em]">Mô tả câu chuyện</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Chia sẻ một chút về cảm hứng của bộ ảnh này..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-photo-gold outline-none transition-all h-32 resize-none" required />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${loading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-photo-gold text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]'}`}>
              {loading ? <><Loader2 className="animate-spin" size={20} /> ĐANG ĐẨY ẢNH LÊN CLOUDINARY...</> : <><Send size={20} /> XÁC NHẬN ĐĂNG ALBUM ({imageFiles.length})</>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;