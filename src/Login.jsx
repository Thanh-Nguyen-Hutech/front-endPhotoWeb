import React, { useState } from 'react';
import { Camera, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMsg('');    

    try {
      const response = await axios.post('https://localhost:7275/api/Auth/login', {
        email: email,
        password: password
      });

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        const userRole = response.data.role || response.data.Role; 
        localStorage.setItem('role', userRole); 
        const userFullName = response.data.fullName || response.data.FullName;
        localStorage.setItem('fullName', userFullName);

        if (onLoginSuccess) {
          onLoginSuccess();
        }

        alert("Đăng nhập thành công!");
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message || error.response?.data;
      setErrorMsg(typeof serverMsg === 'string' ? serverMsg : 'Sai email hoặc mật khẩu, vui lòng thử lại!');
    }
  };

  return (
    // Đổi bg-brand-darkest thành bg-black để đen tuyệt đối
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* Hiệu ứng ánh sáng xanh chạy ngầm phía sau cho đỡ đơn điệu */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px]"></div>

      <div className="glass p-10 rounded-[3rem] w-full max-w-md relative z-10 animate-fade-in border border-white/5">
        <div className="text-center mb-10">
          {/* Icon Camera với màu xanh sáng nhất trên nền đen */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-lightest rounded-3xl mb-6 -rotate-3 shadow-2xl shadow-brand-lightest/10">
            <Camera className="text-black" size={36} />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-3 text-white italic uppercase">
            FOTOZ
          </h1>
          <p className="text-gray-500 font-medium text-sm tracking-widest uppercase">
            Capture the moment
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-500/5 border border-red-500/20 py-3 px-4 rounded-2xl">
              <p className="text-red-500 text-xs font-bold text-center uppercase tracking-wider">{errorMsg}</p>
            </div>
          )}

          <div className="group relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Email của bạn" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white" 
            />
          </div>

          <div className="group relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Mật khẩu" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-lightest text-black font-black text-sm uppercase tracking-[0.25em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all active:scale-[0.97] shadow-2xl shadow-brand-lightest/5"
          >
            Đăng nhập <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-600 text-sm">
            Chưa có tài khoản?{' '}
            <span 
              onClick={() => navigate('/register')} 
              className="text-brand-lightest font-bold cursor-pointer hover:text-white transition-colors ml-1"
            >
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;