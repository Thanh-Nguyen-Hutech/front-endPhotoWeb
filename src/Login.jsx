import React, { useState } from 'react';
import { Camera, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  // 1. Tạo các biến để lưu trữ những gì người dùng gõ vào
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // 2. Hàm xử lý khi bấm nút Đăng Nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt tự động load lại trang
    setErrorMsg('');    // Xóa lỗi cũ (nếu có)

    try {
      // Gọi API sang Backend (.NET). 
      // LƯU Ý: Nhớ đổi số 7275 thành đúng cái Port trên Swagger của bạn nhé!
      const response = await axios.post('https://localhost:7275/api/Auth/login', {
        email: email,
        password: password
      });

      // Nếu thành công, Backend sẽ trả về Token. Ta lưu nó vào "két sắt" của trình duyệt
      localStorage.setItem('token', response.data.token);
      
      navigate('/'); // Tự động chuyển về Trang Chủ

    } catch (error) {
      console.error(error);
      setErrorMsg('Sai email hoặc mật khẩu, vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1492691523567-6170c24e5dfa?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      
      <div className="glass p-10 rounded-[2.5rem] w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-photo-gold rounded-2xl mb-4 rotate-3 shadow-lg shadow-yellow-500/20">
            <Camera className="text-black" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">PHOTONOW</h1>
          <p className="text-gray-400 font-medium">Capture the moment, share the soul.</p>
        </div>

        {/* Thêm sự kiện onSubmit vào Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Hiện thông báo lỗi nếu nhập sai */}
          {errorMsg && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded-lg">{errorMsg}</p>}

          <div className="group relative">
            <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Lưu email người dùng gõ
              required
              placeholder="Email của bạn" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-photo-gold focus:ring-1 focus:ring-photo-gold outline-none transition-all placeholder:text-gray-600" 
            />
          </div>

          <div className="group relative">
            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Lưu mật khẩu
              required
              placeholder="Mật khẩu" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-photo-gold focus:ring-1 focus:ring-photo-gold outline-none transition-all placeholder:text-gray-600" 
            />
          </div>

          <button type="submit" className="w-full bg-photo-gold text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-[0.98]">
            ĐĂNG NHẬP <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;