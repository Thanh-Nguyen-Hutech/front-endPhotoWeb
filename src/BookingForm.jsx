import React, { useState } from 'react';
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
import { Sparkles, Send, MapPin, Type, Calendar, Wallet } from 'lucide-react'; // Thêm icon Wallet

const categories = [
  { id: 'canhan', name: 'Cá nhân', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop' },
  { id: 'capdoi', name: 'Cặp đôi', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=500&auto=format&fit=crop' },
  { id: 'giadinh', name: 'Gia đình', image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=500&auto=format&fit=crop' },
  { id: 'nhom', name: 'Nhóm', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=500&auto=format&fit=crop' },
  { id: 'sukien', name: 'Sự kiện', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=500&auto=format&fit=crop' },
];

const BookingForm = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [shootingDate, setShootingDate] = useState('');
  
  // 1. Thêm State lưu giá tiền
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [details, setDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      alert("Vui lòng chọn một thể loại chụp ảnh ở bên trái nhé!");
      return;
    }

    try {
      const payload = {
        title: title,
        content: details,
        serviceType: selectedCategory,
        includeMakeup: false,
        includeStudio: false,
        // 2. Chuyển giá từ dạng chữ sang số (nếu bỏ trống thì mặc định là 0)
        minPrice: minPrice ? Number(minPrice) : 0,
        maxPrice: maxPrice ? Number(maxPrice) : 0,
        shootingDate: new Date(shootingDate).toISOString(),
        location: location
      };

      await axiosClient.post('/Bookings', payload);

      alert(`🎉 Tuyệt vời! Yêu cầu "${title}" đã được gửi thành công.`);
      
      setTitle('');
      setLocation('');
      setShootingDate('');
      setMinPrice('');
      setMaxPrice('');
      setDetails('');
      setSelectedCategory(null);

    } catch (error) {
      console.error("Lỗi API chi tiết:", error.response?.data);
      if (error.response?.status === 401) {
        alert("Bạn cần Đăng Nhập để có thể đặt lịch nhé!");
      } else {
        const errorMsg = error.response?.data?.title || JSON.stringify(error.response?.data?.errors) || "Lỗi không xác định";
        alert(`Lỗi 400 từ Backend: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-photo-black">
      <Navbar />
      
      <main className="pt-28 px-6 pb-12 max-w-[1200px] mx-auto">
        <div className="bg-photo-gold/10 border border-photo-gold/20 text-photo-gold px-6 py-4 rounded-xl mb-10 flex items-center gap-3 font-bold">
          <Sparkles size={20} />
          Mới: Đăng yêu cầu tìm thợ chụp ảnh chỉ với vài bước đơn giản.
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-black text-white mb-6">
              Chọn thể loại chụp <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedCategory === cat.name 
                      ? 'ring-4 ring-photo-gold scale-[1.02] shadow-[0_0_20px_rgba(250,204,21,0.3)]' 
                      : 'border border-white/10 hover:border-white/30 hover:scale-[1.02]'
                  }`}
                >
                  <div className="h-32 sm:h-40 overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`p-4 text-center font-bold ${selectedCategory === cat.name ? 'bg-photo-gold text-black' : 'bg-white/5 text-white'}`}>
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="glass p-8 rounded-3xl sticky top-28 border-t-4 border-t-photo-gold">
              <h3 className="text-xl font-bold text-white mb-6">Chi tiết yêu cầu</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="relative">
                  <Type className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề (Vd: Chụp kỷ yếu lớp)" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all" required />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Địa điểm (Vd: Hồ Gươm, Hà Nội)" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all" required />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input type="date" value={shootingDate} onChange={(e) => setShootingDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all [color-scheme:dark]" required />
                </div>

                {/* 3. Thêm khu vực nhập Ngân sách */}
                <div className="flex gap-3">
                  <div className="relative w-1/2">
                    <Wallet className="absolute left-3 top-3 text-gray-500" size={20} />
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Giá từ" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all" />
                  </div>
                  <div className="relative w-1/2">
                    <span className="absolute left-3 top-3 text-gray-500 font-bold">-</span>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Đến (VNĐ)" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:border-photo-gold outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Mô tả chi tiết yêu cầu của bạn..." className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-photo-gold outline-none transition-all resize-none h-28" required></textarea>
                </div>

                <button type="submit" className="w-full bg-photo-gold text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all active:scale-[0.98]">
                  XÁC NHẬN YÊU CẦU <Send size={20} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BookingForm;