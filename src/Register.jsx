import React, { useState } from 'react';
import { User, Mail, Lock, Phone, Camera, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Customer' // Mặc định là khách hàng
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Đổi Account -> Auth
    await axios.post('https://localhost:7275/api/Auth/register', formData); 
    
    alert("Đăng ký thành công! Hãy đăng nhập nhé.");
    navigate('/login');
  } catch (error) {
    // Hiện lỗi chi tiết từ Backend trả về (nếu có)
    const errorMsg = error.response?.data?.message || "Đăng ký thất bại!";
    alert(errorMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="glass w-full max-w-[450px] p-10 rounded-[40px] border border-white/10 relative overflow-hidden">
        
        {/* Trang trí background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-photo-gold/20 blur-[100px]"></div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Gia nhập cộng đồng</h2>
          <p className="text-gray-400 text-sm">Lưu giữ khoảnh khắc cùng PhotoNow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Chọn Role - Rất quan trọng */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-6">
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'Customer'})}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${formData.role === 'Customer' ? 'bg-photo-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Tôi là Khách hàng
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, role: 'Photographer'})}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${formData.role === 'Photographer' ? 'bg-photo-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Tôi là Nhiếp ảnh gia
            </button>
          </div>

          <div className="relative group">
            <User className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-photo-gold transition-all text-white text-sm"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-photo-gold transition-all text-white text-sm"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-photo-gold transition-all text-white text-sm"
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-photo-gold transition-colors" size={20} />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-photo-gold transition-all text-white text-sm"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-photo-gold hover:bg-yellow-400 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Bắt đầu ngay <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Đã có tài khoản?{' '}
          <span onClick={() => navigate('/login')} className="text-photo-gold font-bold cursor-pointer hover:underline">
            Đăng nhập ngay
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;