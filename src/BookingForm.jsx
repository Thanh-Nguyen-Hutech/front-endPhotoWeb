import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // 🌟 Đã thêm useParams
import axiosClient from './utils/axiosClient';
import Navbar from './components/Navbar';
import { Sparkles, Send, MapPin, Type, Calendar, Wallet, UserCircle, Home } from 'lucide-react'; 

const categories = [
  { id: 'canhan', name: 'Cá nhân', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop' },
  { id: 'capdoi', name: 'Cặp đôi', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=500&auto=format&fit=crop' },
  { id: 'giadinh', name: 'Gia đình', image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=500&auto=format&fit=crop' },
  { id: 'nhom', name: 'Nhóm', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=500&auto=format&fit=crop' },
  { id: 'sukien', name: 'Sự kiện', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=500&auto=format&fit=crop' },
];

const BookingForm = () => {
  const { photographerId } = useParams(); // 🌟 ĐÃ THÊM: Lấy ID thợ từ URL
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy tên thợ truyền từ trang Profile qua State để hiển thị UI
  const photographerName = location.state?.photographerName || "Nhiếp ảnh gia";

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [shootingDate, setShootingDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false); 
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState({ code: '', name: '' });
  const [selectedDistrict, setSelectedDistrict] = useState({ code: '', name: '' });
  const [selectedWard, setSelectedWard] = useState({ code: '', name: '' });
  const [streetAddress, setStreetAddress] = useState('');

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await res.json();
        setProvinces(data);
      } catch (error) {
        console.error("Lỗi tải danh sách Tỉnh/Thành:", error);
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    
    setSelectedProvince({ code, name });
    setSelectedDistrict({ code: '', name: '' });
    setSelectedWard({ code: '', name: '' });
    setWards([]); 

    if (code) {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;

    setSelectedDistrict({ code, name });
    setSelectedWard({ code: '', name: '' });

    if (code) {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
      const data = await res.json();
      setWards(data.wards);
    } else {
      setWards([]);
    }
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setSelectedWard({ code, name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      alert("Vui lòng chọn một thể loại chụp ảnh ở bên trái nhé!");
      return;
    }

    if (!selectedProvince.name) {
      alert("Vui lòng chọn ít nhất Tỉnh/Thành phố!");
      return;
    }

    setLoading(true);

    try {
      const fullLocation = [
        streetAddress,
        selectedWard.name,
        selectedDistrict.name,
        selectedProvince.name
      ].filter(Boolean).join(', '); 

      const finalPrice = maxPrice
  ? Number(maxPrice)
  : minPrice
    ? Number(minPrice)
    : 0;

const payload = {
  title: title,
  content: details,
  serviceType: selectedCategory,

  includeMakeup: false,
  includeStudio: false,

  minPrice: minPrice ? Number(minPrice) : 0,
  maxPrice: maxPrice ? Number(maxPrice) : 0,

  // QUAN TRỌNG
  totalPrice: finalPrice,

  shootingDate: new Date(shootingDate).toISOString(),

  location: fullLocation,

  photographerId: photographerId || null,

  status: photographerId
    ? "WaitingApproval"
    : "Pending"
};

      await axiosClient.post('/Bookings', payload);

      if (photographerId) {
        alert(`🎉 Tuyệt vời! Đã gửi yêu cầu trực tiếp đến thợ nhiếp ảnh.`);
      } else {
        alert(`🎉 Tuyệt vời! Yêu cầu "${title}" đã được đăng lên hệ thống tìm thợ thành công.`);
      }
      
      navigate('/my-history');

    } catch (error) {
      console.error("Lỗi API chi tiết:", error.response?.data);
      if (error.response?.status === 401) {
        alert("Bạn cần Đăng Nhập để có thể đặt lịch nhé!");
      } else {
        const errorMsg = error.response?.data?.title || JSON.stringify(error.response?.data?.errors) || "Lỗi không xác định";
        alert(`Lỗi từ Backend: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-photo-black">
      <Navbar />
      
      <main className="pt-28 px-6 pb-12 max-w-[1200px] mx-auto">
        
        {photographerId ? (
          <div className="mb-10 p-6 bg-gradient-to-r from-photo-gold/20 to-transparent border-l-4 border-photo-gold rounded-r-2xl flex items-center gap-4 animate-in slide-in-from-left-4">
            <UserCircle size={40} className="text-photo-gold" />
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang đặt lịch trực tiếp với</p>
              <h2 className="text-2xl font-black text-photo-gold uppercase tracking-tighter">{photographerName}</h2>
            </div>
          </div>
        ) : (
          <div className="bg-photo-gold/10 border border-photo-gold/20 text-photo-gold px-6 py-4 rounded-xl mb-10 flex items-center gap-3 font-bold">
            <Sparkles size={20} />
            Mới: Đăng yêu cầu tìm thợ chụp ảnh chỉ với vài bước đơn giản.
          </div>
        )}

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
                  <div className={`p-4 text-center font-bold transition-colors ${selectedCategory === cat.name ? 'bg-photo-gold text-black' : 'bg-white/5 text-white'}`}>
                    {cat.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="glass p-8 rounded-3xl sticky top-28 border-t-4 border-t-photo-gold shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Chi tiết yêu cầu</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="relative group">
                  <Type className="absolute left-3 top-3 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề (Vd: Chụp kỷ yếu lớp)" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all" required />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <p className="text-[10px] font-black text-photo-gold uppercase tracking-widest mb-1 flex items-center gap-2">
                    <MapPin size={14}/> Địa điểm chụp
                  </p>
                  
                  <select 
                    value={selectedProvince.code} 
                    onChange={handleProvinceChange} 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-photo-gold outline-none transition-all cursor-pointer appearance-none text-sm" 
                    required
                  >
                    <option value="" disabled>-- Chọn Tỉnh / Thành phố --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code} className="bg-[#050505] text-white">{p.name}</option>
                    ))}
                  </select>

                  <div className="flex gap-3">
                    <select 
                      value={selectedDistrict.code} 
                      onChange={handleDistrictChange} 
                      disabled={!selectedProvince.code}
                      className="w-1/2 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-photo-gold outline-none transition-all cursor-pointer appearance-none disabled:opacity-50 text-sm" 
                    >
                      <option value="" disabled>Quận / Huyện</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.code} className="bg-[#050505] text-white">{d.name}</option>
                      ))}
                    </select>

                    <select 
                      value={selectedWard.code} 
                      onChange={handleWardChange} 
                      disabled={!selectedDistrict.code}
                      className="w-1/2 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-photo-gold outline-none transition-all cursor-pointer appearance-none disabled:opacity-50 text-sm" 
                    >
                      <option value="" disabled>Phường / Xã</option>
                      {wards.map((w) => (
                        <option key={w.code} value={w.code} className="bg-[#050505] text-white">{w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative group mt-2">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={16} />
                    <input 
                      type="text" 
                      value={streetAddress} 
                      onChange={(e) => setStreetAddress(e.target.value)} 
                      placeholder="Số nhà, Tên đường, Toà nhà..." 
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all text-sm" 
                    />
                  </div>
                </div>

                <div className="relative group">
                  <Calendar className="absolute left-3 top-3 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
                  <input type="date" value={shootingDate} onChange={(e) => setShootingDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all [color-scheme:dark]" required />
                </div>

                <div className="flex gap-3">
                  <div className="relative w-1/2 group">
                    <Wallet className="absolute left-3 top-3 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
                    <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Giá từ" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-photo-gold outline-none transition-all" />
                  </div>
                  <div className="relative w-1/2 group">
                    <span className="absolute left-3 top-3 text-gray-500 font-bold">-</span>
                    <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Đến (VNĐ)" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:border-photo-gold outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Mô tả chi tiết yêu cầu của bạn..." className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-photo-gold outline-none transition-all resize-none h-28 custom-scrollbar" required></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-photo-gold text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all active:scale-[0.98] disabled:opacity-70">
                  {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN YÊU CẦU'} <Send size={20} />
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