import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PhotographerCard from './components/PhotographerCard';
import JobCard from './components/JobCard'; 
import { Filter, Loader2, Search, MapPin, Camera, SlidersHorizontal, Briefcase } from 'lucide-react'; 
import axiosClient from './utils/axiosClient'; 

const concepts = ['Cá nhân', 'Cặp đôi', 'Nhóm', 'Sự kiện', 'Gia đình', 'Cổ trang', 'Fashion'];

const BookingList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('role')?.trim().toLowerCase();
  const isPhotographer = userRole === 'photographer';

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [selectedConcepts, setSelectedConcepts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isPhotographer) {
          const res = await axiosClient.get('/Bookings/requests-feed');
          setData(Array.isArray(res.data) ? res.data : []);
        } else {
          const res = await axiosClient.get('/Users/photographers');
          setData(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isPhotographer]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const nameToSearch = isPhotographer ? item.title : item.fullName;
      const safeName = nameToSearch || '';
      
      const safeLoc = item.address || item.location || '';
      
      const matchName = safeName.toLowerCase().includes(search.toLowerCase());
      const matchLoc = safeLoc.toLowerCase().includes(location.toLowerCase());
      
      let itemConcepts = [];
      if (isPhotographer) {
        itemConcepts = [item.serviceType];
      } else {
        const rawConcepts = item.concepts || item.Concepts;
        if (typeof rawConcepts === 'string') {
          itemConcepts = rawConcepts.split(',').map(c => c.trim());
        } else if (Array.isArray(rawConcepts)) {
          itemConcepts = rawConcepts;
        }
      }

      const matchConcept = selectedConcepts.length === 0 || 
                           selectedConcepts.some(c => itemConcepts.includes(c));
      
      return matchName && matchLoc && matchConcept;
    });
  }, [data, search, location, selectedConcepts, isPhotographer]);

  const handleAcceptJob = async (jobId) => {
    if (!window.confirm("Bạn muốn nhận buổi chụp này?")) return;
    try {
      const res = await axiosClient.put(`/Bookings/${jobId}/accept`);
      alert(`🎉 ${res.data.message || 'Nhận Job thành công!'}`);
      const reload = await axiosClient.get('/Bookings/requests-feed');
      setData(reload.data);
    } catch (err) { 
      alert(err.response?.data?.message || "Lỗi khi nhận Job"); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white italic">
      <Navbar />
      
      <main className="pt-28 px-6 pb-12 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-72">
          <div className="glass p-8 rounded-[40px] border border-white/5 sticky top-28 space-y-8 shadow-2xl">
            <h3 className="text-photo-gold font-black flex items-center gap-2 text-xl uppercase mb-2">
              <SlidersHorizontal size={20} /> {isPhotographer ? 'Săn Job Mới' : 'Tìm Thợ Ảnh'}
            </h3>

            <div className="space-y-6 not-italic">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="text" placeholder={isPhotographer ? "Tên buổi chụp..." : "Tên thợ ảnh..."}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:border-photo-gold outline-none transition-all"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Khu vực</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    type="text" placeholder="TP.HCM, Hà Nội..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:border-photo-gold outline-none transition-all"
                    value={location} onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Concept yêu thích</label>
                <div className="flex flex-wrap gap-2">
                  {concepts.map(c => (
                    <button
                      key={c} onClick={() => setSelectedConcepts(prev => prev.includes(c) ? prev.filter(x => x!==c) : [...prev, c])}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${selectedConcepts.includes(c) ? 'bg-photo-gold text-black border-photo-gold' : 'bg-white/5 text-gray-500 border-white/10 hover:border-photo-gold/40'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              {isPhotographer ? <>Yêu cầu <span className="text-photo-gold">Mới</span></> : <>Nghệ sĩ <span className="text-photo-gold">FOTOZ</span></>}
            </h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
              Kết quả: <span className="text-photo-gold italic">{filteredData.length}</span>
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-40"><Loader2 className="animate-spin text-photo-gold" size={48} /></div>
          ) : filteredData.length === 0 ? (
            <div className="glass text-center py-32 rounded-[40px] border border-dashed border-white/10 text-gray-500 font-bold uppercase tracking-widest">Không có dữ liệu phù hợp</div>
          ) : (
            <div className={isPhotographer ? "flex flex-col gap-5" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"}>
              {filteredData.map(item => (
                isPhotographer ? (
                  <JobCard 
                    key={item.id} 
                    onAccept={handleAcceptJob}
                    job={{
                      id: item.id, 
                      title: item.title, 
                      author: item.customer?.fullName || item.customerName || "Khách hàng",
                      location: item.address || item.location || "Thỏa thuận",
                      type: item.serviceType,
                      price: item.maxPrice > 0 ? `${item.minPrice.toLocaleString()} - ${item.maxPrice.toLocaleString()} ₫` : "Thỏa thuận"
                    }} 
                  />
                ) : (
                  /* ✅ ĐÃ CẬP NHẬT: Trỏ đến Link ID và lấy chính xác Số điện thoại */
                  <PhotographerCard 
                    key={item.id} 
                    photographer={{
                      ...item,
                      location: item.address || item.location || "Toàn quốc",
                      phoneNumber: item.phoneNumber,
                      basePrice: item.basePrice > 0 ? item.basePrice : 0, 
                      avatar: item.avatar || "https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000&auto=format&fit=crop"
                    }} 
                    onClick={() => navigate(`/profile/${item.id}`)}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingList;