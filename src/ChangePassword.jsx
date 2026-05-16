import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axiosClient from './utils/axiosClient';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Kiểm tra mật khẩu nhập lại
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp!' });
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không được trùng với mật khẩu cũ!' });
      return;
    }

    setLoading(true);
    try {
      // Gọi API đổi mật khẩu (Token tự động đính kèm qua axiosClient)
      const res = await axiosClient.post('/Auth/change-password', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      setMessage({ type: 'success', text: res.data.message || 'Đổi mật khẩu thành công!' });
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Mật khẩu cũ không chính xác!';
      setMessage({ type: 'error', text: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 glass rounded-[3rem] border border-white/5 shadow-2xl mt-10 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 rounded-2xl mb-4 border border-white/10 text-[#BDE8F5]">
          <Lock size={28} />
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Đổi Mật Khẩu</h2>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-1">Bảo mật tài khoản FOTOZ của bạn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {message.text && (
          <div className={`flex items-center gap-2 p-4 rounded-2xl border text-xs font-bold uppercase tracking-wide ${
            message.type === 'success' 
              ? 'bg-green-500/5 border-green-500/20 text-green-400' 
              : 'bg-red-500/5 border-red-500/20 text-red-500'
          }`}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <p className="flex-1 text-center">{message.text}</p>
          </div>
        )}

        {/* 1. Mật khẩu cũ */}
        <div className="relative group">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#BDE8F5] transition-colors" size={18} />
          <input 
            type={showPass.old ? "text" : "password"}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            placeholder="Mật khẩu hiện tại" 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:border-[#BDE8F5]/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
          />
          <button type="button" onClick={() => setShowPass({ ...showPass, old: !showPass.old })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
            {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* 2. Mật khẩu mới */}
        <div className="relative group">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#BDE8F5] transition-colors" size={18} />
          <input 
            type={showPass.new ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            placeholder="Mật khẩu mới (Tối thiểu 6 ký tự)" 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:border-[#BDE8F5]/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
          />
          <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
            {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* 3. Xác nhận mật khẩu mới */}
        <div className="relative group">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#BDE8F5] transition-colors" size={18} />
          <input 
            type={showPass.confirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Xác nhận mật khẩu mới" 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:border-[#BDE8F5]/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-gray-700 text-white text-sm" 
          />
          <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
            {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Nút Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#BDE8F5] text-[#0F172A] font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.01] transition-all active:scale-[0.98] shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Cập nhật mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;