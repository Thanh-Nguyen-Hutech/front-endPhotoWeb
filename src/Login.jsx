import React, { useState } from 'react';
import { Camera, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Component nhận props onLoginSuccess từ App.jsx để báo hiệu cập nhật Navbar
const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMsg('');    

    try {
      // Gọi API đăng nhập tới Backend
      const response = await axios.post('https://localhost:7275/api/Auth/login', {
        email: email,
        password: password
      });

      // Nếu API trả về thành công (có thể kiểm tra response.data.isSuccess tùy logic Backend)
      if (response.data) {
        // 🚩 LƯU TRỮ ĐẦY ĐỦ THÔNG TIN VÀO LOCAL STORAGE
        localStorage.setItem('token', response.data.token);
        
        // Dự phòng trường hợp Backend trả về key viết hoa (Role) hay thường (role)
        const userRole = response.data.role || response.data.Role; 
        localStorage.setItem('role', userRole); 
        
        const userFullName = response.data.fullName || response.data.FullName;
        localStorage.setItem('fullName', userFullName);

        // Gọi hàm callback (nếu có) để ép App.jsx render lại Navbar ngay lập tức
        if (onLoginSuccess) {
          onLoginSuccess();
        }

        alert("Đăng nhập thành công!");
        
        // Phương án 1: Dùng window.location.href để ép trình duyệt tải lại toàn bộ trang (chắc chắn nhất)
        window.location.href = '/'; 
        
        // Phương án 2 (tùy chọn): Nếu dùng onLoginSuccess thì chỉ cần navigate('/')
        // navigate('/'); 
      }

    } catch (error) {
      console.error(error);
      // Hiển thị lỗi từ server nếu có, hoặc lỗi mặc định
      const serverMsg = error.response?.data?.message || error.response?.data;
      setErrorMsg(typeof serverMsg === 'string' ? serverMsg : 'Sai email hoặc mật khẩu, vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1492691523567-6170c24e5dfa?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      
      <div className="glass p-10 rounded-[2.5rem] w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-photo-gold rounded-2xl mb-4 rotate-3 shadow-lg shadow-photo-gold/20">
            <Camera className="text-black" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 text-white italic uppercase">FOTOZ</h1>
          <p className="text-gray-400 font-medium text-sm">Capture the moment, share the soul.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl animate-in slide-in-from-top-2">
              <p className="text-red-500 text-sm font-bold text-center">{errorMsg}</p>
            </div>
          )}

          <div className="group relative">
            <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Email của bạn" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-photo-gold outline-none transition-all placeholder:text-gray-600 text-white" 
            />
          </div>

          <div className="group relative">
            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Mật khẩu" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-photo-gold outline-none transition-all placeholder:text-gray-600 text-white" 
            />
          </div>

          <button type="submit" className="w-full bg-photo-gold text-black font-black text-sm uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 shadow-xl shadow-photo-gold/20 transition-all active:scale-[0.98]">
            Đăng nhập <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Chưa có tài khoản?{' '}
          <span onClick={() => navigate('/register')} className="text-photo-gold font-bold cursor-pointer hover:underline">
            Đăng ký ngay
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;