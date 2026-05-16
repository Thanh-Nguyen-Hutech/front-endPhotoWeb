import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    try {
      // Gọi API gửi yêu cầu cho Admin
      await axios.post('https://localhost:7275/api/Auth/forgot-password', { email });
      
      setIsSuccess(true);
      setStatusMsg('Yêu cầu đã được gửi! Quản trị viên (Admin) sẽ kiểm tra và cấp lại mật khẩu cho bạn trong thời gian sớm nhất.');
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message || error.response?.data;
      setStatusMsg(typeof serverMsg === 'string' ? serverMsg : 'Lỗi hệ thống. Vui lòng thử lại sau!');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px]"></div>

      <div className="glass p-10 rounded-[3rem] w-full max-w-md relative z-10 animate-fade-in border border-white/5 shadow-2xl">
        
        <button 
          onClick={() => navigate('/login')} 
          className="flex items-center gap-2 text-gray-500 hover:text-brand-lightest transition-colors text-xs font-bold uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={16} /> Quay lại đăng nhập
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-4 border border-white/10">
            <ShieldAlert className="text-brand-lightest" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-3 text-white uppercase italic">
            Quên mật khẩu?
          </h1>
          <p className="text-gray-500 font-medium text-sm tracking-wide">
            Nhập email đăng ký của bạn. Chúng tôi sẽ thông báo cho Admin để hỗ trợ cấp lại mật khẩu.
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center bg-green-500/10 border border-green-500/20 p-6 rounded-3xl text-center space-y-4">
            <CheckCircle className="text-green-400" size={48} />
            <p className="text-green-400 font-bold text-sm leading-relaxed">{statusMsg}</p>
            <p className="text-gray-500 text-xs mt-2 italic">Mẹo: Bạn có thể liên hệ trực tiếp qua Zalo/Hotline nếu cần hỗ trợ gấp.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-4 bg-transparent border border-green-400 text-green-400 font-bold text-xs uppercase tracking-widest py-3 px-6 rounded-xl hover:bg-green-400 hover:text-black transition-all"
            >
              Về trang Đăng nhập
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {statusMsg && !isSuccess && (
              <div className="bg-red-500/5 border border-red-500/20 py-3 px-4 rounded-2xl">
                <p className="text-red-500 text-xs font-bold text-center uppercase tracking-wider">{statusMsg}</p>
              </div>
            )}

            <div className="group relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-lightest transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
                placeholder="Nhập email tài khoản..." 
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:border-brand-lightest/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !email}
              className="w-full bg-brand-lightest text-black font-black text-sm uppercase tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-[0.97] shadow-2xl shadow-brand-lightest/5 disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu cho Admin'} <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;