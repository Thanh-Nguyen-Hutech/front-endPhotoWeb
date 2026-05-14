import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axiosClient from '../utils/axiosClient'; // Đảm bảo đường dẫn này đúng với file axios của bạn
import { CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';

const PaymentResult = () => {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Đang xử lý giao dịch, vui lòng không tắt trình duyệt...');

  useEffect(() => {
    const confirmPayment = async () => {
      // location.search chính là đoạn "?vnp_Amount=...&vnp_TransactionNo=..."
      if (!location.search) {
        setStatus('error');
        setMessage('Không tìm thấy dữ liệu giao dịch từ VNPay.');
        return;
      }

      try {
        // 🌟 Gửi toàn bộ chuỗi URL đó xuống API C# để C# kiểm tra chữ ký và lưu Database
        const response = await axiosClient.get(`/Payments/vnpay-return${location.search}`);
        
        if (response.data.success) {
          setStatus('success');
          setMessage('Thanh toán thành công! Đã cập nhật trạng thái đơn đặt lịch.');
        }
      } catch (error) {
        console.error("Lỗi xác nhận thanh toán:", error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Giao dịch thất bại hoặc có lỗi xảy ra.');
      }
    };

    // Chạy hàm kiểm tra ngay khi trang vừa load xong
    confirmPayment();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="glass p-8 sm:p-12 rounded-[32px] border border-white/10 text-center max-w-md w-full shadow-2xl">
        
        {/* TRẠNG THÁI ĐANG LOAD */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-photo-gold" size={64} />
            <h2 className="text-xl font-black text-white tracking-widest uppercase mt-4">Đang xử lý...</h2>
            <p className="text-gray-400 text-sm">{message}</p>
          </div>
        )}

        {/* TRẠNG THÁI THÀNH CÔNG */}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
            <CheckCircle className="text-green-500" size={80} />
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mt-4">Thành Công!</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <Link to="/my-history" className="mt-6 flex items-center gap-2 bg-photo-gold hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
               <ArrowLeft size={16} /> Về trang Lịch sử
            </Link>
          </div>
        )}

        {/* TRẠNG THÁI THẤT BẠI */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
            <XCircle className="text-red-500" size={80} />
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mt-4">Thất bại</h2>
            <p className="text-gray-400 text-sm">{message}</p>
            <Link to="/my-history" className="mt-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
               <ArrowLeft size={16} /> Quay lại
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentResult;