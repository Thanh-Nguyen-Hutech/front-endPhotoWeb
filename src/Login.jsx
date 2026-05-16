import React, { useState } from 'react';
import { Camera, Mail, Lock, ArrowRight, Eye, EyeOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from './utils/axiosClient'; // 🌟 Đã chuyển sang dùng axiosClient đồng bộ hệ thống

const Login = ({ onLoginSuccess }) => {
  // Chế độ: 'login' (Đăng nhập) hoặc 'change-password' (Đổi mật khẩu)
  const [mode, setMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  // State quản lý toàn bộ ô nhập liệu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Trạng thái ẩn/hiện mật khẩu cho từng ô
  const [showPass, setShowPass] = useState({ login: false, old: false, new: false, confirm: false });

  // 1. XỬ LÝ ĐĂNG NHẬP
  const handleLoginSubmit = async () => {
    try {
      const response = await axiosClient.post('/Auth/login', {
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

  // 2. XỬ LÝ ĐỔI MẬT KHẨU (Khách dùng Email bên ngoài trang Login)
  const handleChangePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    if (oldPassword === newPassword) {
      setErrorMsg('Mật khẩu mới không được trùng với mật khẩu cũ!');
      return;
    }

    try {
      await axiosClient.post('/Auth/change-password-by-email', {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword
      });

      setSuccessMsg('Đổi mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.');
      setMode('login'); // Quay về tab login
      // Reset các trường pass
      setPassword('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message || error.response?.data;
      setErrorMsg(typeof serverMsg === 'string' ? serverMsg : 'Email hoặc mật khẩu cũ không chính xác!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (mode === 'login') {
      await handleLoginSubmit();
    } else {
      await handleChangePasswordSubmit();
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px]"></div>

      <div className="glass p-10 rounded-[3rem] w-full max-w-md relative z-10 animate-fade-in border border-white/5 transition-all duration-300">
        
        {/* 🌟 TAB TOGGLE: Chuyển đổi qua lại giữa Đăng nhập & Đổi mật khẩu */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5">
          <button 
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${mode === 'login' ? 'bg-brand-lightest text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Đăng nhập
          </button>
          <button 
            type="button"
            onClick={() => { setMode('change-password'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${mode === 'change-password' ? 'bg-brand-lightest text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* LOGO & BRAND */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-lightest rounded-3xl mb-4 -rotate-3 shadow-2xl shadow-brand-lightest/10">
            <Camera className="text-black" size={28} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-1 text-white italic uppercase">
            PEAKFOTO
          </h1>
          <p className="text-gray-500 font-medium text-[10px] tracking-widest uppercase">
            {mode === 'login' ? 'Capture the moment' : 'Secure your account'}
          </p>
        </div>

        {/* THÔNG BÁO LỖI */}
        {errorMsg && (
          <div className="bg-red-500/5 border border-red-500/20 py-3 px-4 rounded-2xl mb-4">
            <p className="text-red-500 text-xs font-bold text-center uppercase tracking-wider">{errorMsg}</p>
          </div>
        )}

        {/* THÔNG BÁO THÀNH CÔNG */}
        {successMsg && (
          <div className="bg-green-500/5 border border-green-500/20 py-4 px-4 rounded-2xl mb-4 flex items-center gap-2 justify-center">
            <CheckCircle2 className="text-green-400" size={16} />
            <p className="text-green-400 text-xs font-bold text-center uppercase tracking-wider">{successMsg}</p>
          </div>
        )}

        {/* FORM NHẬP LIỆU */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Ô Email (Luôn hiển thị ở cả 2 chế độ) */}
          <div className="group relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Email của bạn" 
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
            />
          </div>

          {/* CHẾ ĐỘ 1: FORM ĐĂNG NHẬP THƯỜNG */}
          {mode === 'login' && (
            <div>
              <div className="group relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
                <input 
                  type={showPass.login ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                  placeholder="Mật khẩu" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-12 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
                />
                <button type="button" onClick={() => setShowPass({ ...showPass, login: !showPass.login })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPass.login ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              <div className="flex justify-end mt-3">
                <span 
                  onClick={() => navigate('/forgot-password')} 
                  className="text-gray-500 hover:text-brand-lightest text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Quên mật khẩu?
                </span>
              </div>
            </div>
          )}

          {/* CHẾ ĐỘ 2: FORM ĐỔI MẬT KHẨU TRỰC TIẾP */}
          {mode === 'change-password' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              
              {/* Mật khẩu cũ */}
              <div className="group relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
                <input 
                  type={showPass.old ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)} 
                  required
                  placeholder="Mật khẩu hiện tại" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-12 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
                />
                <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Mật khẩu mới */}
              <div className="group relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
                <input 
                  type={showPass.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required
                  placeholder="Mật khẩu mới (Tối thiểu 6 ký tự)" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-12 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
                />
                <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="group relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
                <input 
                  type={showPass.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                  placeholder="Xác nhận mật khẩu mới" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-12 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
                />
                <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

            </div>
          )}

          {/* NÚT THỰC THI CHÍNH */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-lightest text-black font-black text-sm uppercase tracking-[0.25em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all active:scale-[0.97] shadow-2xl shadow-brand-lightest/5 disabled:opacity-60"
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : mode === 'login' ? (
              <>Đăng nhập <ArrowRight size={20} /></>
            ) : (
              <>Đổi mật khẩu <RefreshCw size={18} /></>
            )}
          </button>
        </form>

        {/* BOTTOM ĐIỀU HƯỚNG ĐĂNG KÝ */}
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