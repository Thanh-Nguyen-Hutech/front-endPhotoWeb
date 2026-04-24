import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Photographer');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://localhost:7275/api/Auth/register', { ...formData, role }); 
      navigate('/login');
    } catch {
      alert("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Fix lỗi cuộn: Sử dụng h-screen và overflow-hidden
    <div className="h-screen w-full bg-[#050A15] flex items-center justify-center p-4 xl:p-8 font-sans text-white overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#BDE8F5]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* 2. Căn chỉnh Box: Dùng aspect-video để bề thế, max-h để không bị tràn */}
      <div className="relative w-full max-w-[1360px] aspect-video max-h-[800px] bg-white/[0.02] backdrop-blur-2xl rounded-[3.5rem] border border-white/10 flex shadow-[0_0_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in-out overflow-hidden">
        
        {/* --- LEFT PANEL: Giữ nguyên các layer ảnh của bạn nhưng căn chỉnh vị trí thoáng hơn --- */}
        <div className={`absolute top-0 left-0 w-1/2 h-full bg-[#0F172A]/80 z-20 hidden lg:flex flex-col p-12 xl:p-16 overflow-hidden border-r border-white/5 transition-transform duration-700 ease-in-out
          ${role === 'Customer' ? 'translate-x-full' : 'translate-x-0'}`}>
          
          <div className="flex items-center gap-3 mb-10 relative z-50">
            <div className="p-3 bg-[#BDE8F5] rounded-2xl shadow-[0_0_20px_rgba(189,232,245,0.4)]">
              <Camera className="text-[#0F172A]" size={20} />
            </div>
            <span className="text-xs font-black tracking-[0.4em] text-white/40 italic uppercase">PeakFoto Studio</span>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <h2 className="absolute text-[10rem] xl:text-[12rem] font-black opacity-[0.02] select-none tracking-tighter">VUE</h2>

            {/* Các tấm ảnh giữ nguyên style cũ, chỉ nới lỏng tọa độ để cân bằng viewbox */}
         {/* --- ẢNH VỆ TINH TRÊN BÊN PHẢI --- */}
<div className="absolute top-4 right-10 w-32 h-48 xl:w-36 xl:h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 rotate-6 animate-float opacity-80 hover:opacity-100 transition-opacity duration-500">
  <img 
    src="https://images.unsplash.com/photo-1554080353-a576cf803bda?auto=format&fit=crop&q=80&w=400" 
    className="w-full h-full object-cover" 
    alt="Art" 
  />
</div>

{/* --- ẢNH VỆ TINH DƯỚI BÊN TRÁI --- */}
<div className="absolute bottom-10 left-6 w-40 h-56 xl:w-44 xl:h-60 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 -rotate-12 animate-float-delayed opacity-80 hover:opacity-100 transition-opacity duration-500">
  <img 
    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" 
    className="w-full h-full object-cover" 
    alt="Artist" 
  />
</div>

{/* --- TÂM ĐIỂM: ỐNG KÍNH (CENTRAL PIECE) --- */}
<div className="relative z-30 group transition-all duration-700 hover:scale-105">
  {/* Hào quang nền - Giảm độ gắt để làm nổi bật vật thể chính */}
  <div className="absolute inset-0 bg-[#BDE8F5] rounded-full blur-[70px] opacity-10 group-hover:opacity-20 transition-opacity animate-pulse" />
  
  <img 
    src="https://images.pexels.com/photos/32799725/pexels-photo-32799725.jpeg" 
    alt="3D Lens" 
    className="w-64 h-64 xl:w-80 xl:h-80 object-cover rounded-full border-4 border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative z-10" 
  />

  {/* Tag thông tin - Căn chỉnh lại khoảng cách để không bị dính vào ảnh */}
  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-2 shadow-2xl z-20 group-hover:border-[#BDE8F5]/30 transition-all">
    <div className="animate-spin-slow">
      <Sparkles size={12} className="text-[#BDE8F5]" />
    </div>
    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/80 group-hover:text-white transition-colors">
      Professional Glass
    </span>
  </div>
            </div>
          </div>

          <div className="relative z-50 mt-auto">
            <h2 className="text-6xl xl:text-7xl font-serif italic text-white leading-none">Khởi tạo</h2>
            <h3 className="text-4xl xl:text-5xl font-black uppercase tracking-tighter text-[#BDE8F5] leading-tight">TUYỆT TÁC CỦA BẠN</h3>
            <div className="h-1 w-20 bg-[#BDE8F5] mt-6 rounded-full" />
          </div>
        </div>

        {/* --- RIGHT PANEL: FORM --- */}
        <div className="flex w-full h-full">
          {/* 3. Căn chỉnh Form: Tăng Padding p-16 và max-w-md để nhìn bề thế hơn */}
          <div className={`w-full lg:w-1/2 flex items-center justify-center p-12 xl:p-20 transition-all duration-700 ease-in-out ${role === 'Customer' ? 'lg:translate-x-0' : 'lg:translate-x-full'}`}>
            <div className="w-full max-w-sm xl:max-w-md">
              <div className="mb-8 xl:mb-12 text-center lg:text-left">
                <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tighter italic mb-2">Gia nhập đội ngũ.</h2>
                <p className="text-white/40 text-xs tracking-widest uppercase font-bold">Cùng nhau tạo nên những khoảnh khắc</p>
              </div>

              {/* Tab Selector */}
              <div className="relative flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-8 xl:mb-10">
                <div 
                  className="absolute inset-y-1 bg-[#BDE8F5] rounded-xl shadow-lg transition-all duration-500"
                  style={{ left: role === 'Customer' ? '4px' : 'calc(50% - 2px)', width: 'calc(50% - 2px)' }}
                />
                <button onClick={() => setRole('Customer')} className={`relative z-10 flex-1 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${role === 'Customer' ? 'text-[#0F172A]' : 'text-white/40'}`}>Khách hàng</button>
                <button onClick={() => setRole('Photographer')} className={`relative z-10 flex-1 py-3 xl:py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${role === 'Photographer' ? 'text-[#0F172A]' : 'text-white/40'}`}>Thợ ảnh</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 xl:space-y-5">
                {[
                  { Icon: User, placeholder: "Tên đầy đủ", key: 'fullName', type: 'text' },
                  { Icon: Mail, placeholder: "Email liên hệ", key: 'email', type: 'email' },
                  { Icon: Phone, placeholder: "Số điện thoại", key: 'phoneNumber', type: 'text' },
                  { Icon: Lock, placeholder: "Mật khẩu", key: 'password', type: 'password' },
                ].map((f) => (
                  <div key={f.key} className="relative group">
                    <f.Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#BDE8F5] transition-colors" size={16} />
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4.5 xl:py-5 pl-14 pr-6 focus:outline-none focus:border-[#BDE8F5]/40 transition-all text-sm text-white placeholder:text-white/10"
                      onChange={(e) => setFormData({...formData, [f.key]: e.target.value})}
                      required
                    />
                  </div>
                ))}

                <button 
  type="submit" 
  disabled={loading} 
  className="w-full bg-[#BDE8F5] text-[#0F172A] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 mt-6 relative overflow-hidden group"
>
  {/* 1. Lớp Highlight chuyển động (Shine Effect) */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer z-10" />
  
  {/* 2. Lớp nền phủ khi hover (nếu bạn muốn nút đổi màu nền từ từ) */}
  <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-0" />

  {/* 3. Nội dung nút */}
  <div className="relative z-20 flex items-center gap-3">
    {loading ? (
      <Loader2 className="animate-spin" size={20} />
    ) : (
      <>
        <span>Hoàn tất đăng ký</span>
        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
      </>
    )}
  </div>
</button>
              </form>

              <div className="mt-10 xl:mt-12 text-center">
                <p className="text-white/30 text-[11px] uppercase tracking-[0.2em]">
                  Đã có tài khoản? <span onClick={() => navigate('/login')} className="text-[#BDE8F5] font-black cursor-pointer hover:underline ml-2 transition-all">Đăng nhập</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(6deg); } 50% { transform: translateY(-15px) rotate(8deg); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0) rotate(-12deg); } 50% { transform: translateY(15px) rotate(-10deg); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
      `}</style>
    </div>
  );
};

export default Register;