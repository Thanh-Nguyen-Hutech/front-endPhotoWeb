import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { ShieldCheck, ShieldX, Loader2 } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Đảm bảo đường dẫn có /api/ nếu axiosClient chưa cấu hình
      const res = await axiosClient.get('/Admin/users'); 
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLock = async (userId) => {
    if (!window.confirm("Xác nhận thay đổi trạng thái tài khoản này?")) return;

    try {
      // Gọi đúng route /api/Admin/users/...
      const res = await axiosClient.post(`/Admin/users/${userId}/toggle-lock`);
      
      // ✅ CẬP NHẬT STATE TẠI CHỖ (Không cần load lại trang)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, isActive: res.data.isActive, lockoutEnd: res.data.lockoutEnd } 
            : user
        )
      );

      alert(`✅ ${res.data.message}`);
    } catch (err) {
      alert(err.response?.data || "Lỗi khi xử lý");
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
        Quản lý <span className="text-photo-gold">Người dùng</span>
      </h2>
      
      <div className="glass p-6 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase text-gray-500 border-b border-white/5">
              <th className="pb-4 pl-4">Họ và tên</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Vai trò</th>
              <th className="pb-4 text-center">Trạng thái</th>
              <th className="pb-4 text-right pr-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => {
              const isLocked = user.lockoutEnd && new Date(user.lockoutEnd) > new Date();
              
              return (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="py-5 pl-4 font-bold text-sm text-white">{user.fullName}</td>
                  <td className="py-5 text-gray-400 text-xs">{user.email}</td>
                  <td className="py-5">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-5 text-center">
                    {isLocked ? (
                      <span className="text-red-500 text-[9px] font-black uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        Đang khóa
                      </span>
                    ) : (
                      <span className="text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        Hoạt động
                      </span>
                    )}
                  </td>
                  <td className="py-5 text-right pr-4">
                    <button 
                      onClick={() => handleToggleLock(user.id)}
                      title={isLocked ? "Mở khóa" : "Khóa tài khoản"}
                      className={`p-2 rounded-xl transition-all ${isLocked ? 'hover:bg-green-500/20' : 'hover:bg-red-500/20'}`}
                    >
                      {isLocked ? (
                        <ShieldCheck className="text-green-500" size={20}/>
                      ) : (
                        <ShieldX className="text-red-500" size={20}/>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;