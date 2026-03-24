import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import JobCard from './components/JobCard';
import { Filter, Loader } from 'lucide-react';
import axiosClient from './utils/axiosClient'; 

const filters = ['Cá nhân', 'Cặp đôi', 'Nhóm', 'Sự kiện', 'Gia đình'];

const BookingList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải dữ liệu (Giữ nguyên)
  const fetchBookings = async () => {
  try {
    const response = await axiosClient.get('/Bookings/requests-feed');
    setBookings(response.data);
  } catch (error) {
    console.error("Lỗi khi tải danh sách:", error);
    // ✅ Nếu lỗi 401 (chưa đăng nhập), chuyển về trang login
    if (error.response?.status === 401) {
       alert("Vui lòng đăng nhập với quyền Nhiếp ảnh gia để xem danh sách này!");
       navigate('/login');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBookings();
  }, []);

  // ⚡ MỚI THÊM: Hàm xử lý khi Thợ bấm nút NHẬN JOB
  const handleAcceptJob = async (jobId) => {
    // Hỏi xác nhận cho chắc cú
    if (!window.confirm("Bạn có chắc chắn muốn nhận buổi chụp này không?")) return;

    try {
      // Gọi API PUT sang Backend
      const response = await axiosClient.put(`/Bookings/${jobId}/accept`);
      
      // Báo thành công (Lấy câu chúc mừng từ C# trả về)
      alert(`🎉 ${response.data.message}`);
      
      // Load lại danh sách để job đó biến mất hoặc đổi trạng thái
      fetchBookings(); 

    } catch (error) {
      console.error("Lỗi nhận job:", error);
      alert(error.response?.data || "Có lỗi xảy ra, không thể nhận Job lúc này.");
    }
  };

  return (
    <div className="min-h-screen bg-photo-black">
      <Navbar />
      
      <main className="pt-28 px-6 pb-12 max-w-[1200px] mx-auto flex flex-col md:flex-row gap-8">
        
        {/* ... (Phần Cột trái: Bộ lọc GIỮ NGUYÊN) ... */}
        <div className="w-full md:w-1/4">
          <div className="glass p-6 rounded-2xl sticky top-28">
            <h3 className="text-photo-gold font-bold mb-6 flex items-center gap-2 text-lg">
              <Filter size={20} /> Bộ lọc
            </h3>
            <div className="space-y-4">
              {filters.map(item => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-600 text-photo-gold focus:ring-photo-gold bg-transparent accent-photo-gold cursor-pointer" />
                  <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Danh sách */}
        <div className="w-full md:w-3/4">
          <h2 className="text-4xl font-black text-white mb-8 tracking-tighter drop-shadow-md">BUỔI CHỤP</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="animate-spin text-photo-gold" size={40} />
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass text-center text-gray-400 py-16 rounded-2xl border border-dashed border-white/20">
              <p className="text-xl font-bold mb-2">Chưa có yêu cầu chụp ảnh nào.</p>
              <p>Hãy chờ khách hàng đặt lịch nhé!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {jobs.map(job => (
                <JobCard 
                  key={job.id} 
                  // ⚡ MỚI THÊM: Truyền onAccept và ID vào JobCard
                  onAccept={handleAcceptJob}
                  job={{
                    id: job.id, // Bắt buộc phải truyền ID qua thì mới biết đang nhận job nào
                    title: job.title,
                    author: job.customerName || "Khách hàng",
                    location: job.location,
                    type: job.serviceType,
                    price: job.maxPrice > 0 ? `${job.minPrice} - ${job.maxPrice} VNĐ` : "Thỏa thuận",
                    status: job.status || 'Pending' // Đảm bảo status là Pending thì nút mới hiện
                  }} 
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default BookingList;