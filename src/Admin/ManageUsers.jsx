import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
// 🌟 Đã gọi lại exportToPDF từ file tiện ích
import { exportToExcel, exportToPDF } from '../utils/exportData'; 
import { 
  FileSpreadsheet, 
  FileType, 
  ShieldCheck, 
  ShieldX, 
  Key, 
  Loader2, 
  Search 
} from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
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
      const res = await axiosClient.post(`/Admin/users/${userId}/toggle-lock`);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, isActive: res.data.isActive, lockoutEnd: res.data.lockoutEnd } 
            : user
        )
      );
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xử lý");
    }
  };

  const handleResetPassword = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc muốn đặt lại mật khẩu cho "${userName}" về mặc định (Fotoz@123)?`)) return;
    try {
      const res = await axiosClient.post(`/Admin/users/${userId}/reset-password`);
      alert(`✅ ${res.data.message}`);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi reset mật khẩu");
    }
  };

  // Xuất Excel
  const handleExportExcel = () => {
    const dataToExport = users.map(u => {
      const isLocked = u.lockoutEnd && new Date(u.lockoutEnd) > new Date();
      return {
        "Họ Tên": u.fullName || "Chưa cập nhật",
        "Email": u.email,
        "Vai Trò": u.role,
        "Trạng Thái": isLocked ? "Đang khóa" : "Hoạt động"
      };
    });
    exportToExcel(dataToExport, "Danh_Sach_Nguoi_Dung_Fotoz");
  };

  // 🌟 Xuất PDF (Tạo bảng bằng dữ liệu thật, không chụp màn hình nữa)
  const handleExportPDF = async () => {
    const headers = ["Họ Tên", "Email", "Vai Trò", "Trạng Thái"];
    
    const data = users.map(u => {
      const isLocked = u.lockoutEnd && new Date(u.lockoutEnd) > new Date();
      return [
        u.fullName || "Chưa cập nhật", 
        u.email, 
        u.role, 
        isLocked ? "Đang khóa" : "Hoạt động"
      ];
    });
    
    // Gọi hàm từ file exportData.js
    await exportToPDF("BAO CAO NGUOI DUNG FOTOZ", headers, data, "Bao_Cao_User");
  };

  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-photo-gold" size={48} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Quản lý <span className="text-photo-gold">Người dùng</span>
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                Tổng cộng: {users.length} tài khoản
            </p>
            <div className="flex gap-2">
                <button onClick={handleExportExcel} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-all" title="Xuất Excel">
                    <FileSpreadsheet size={18} />
                </button>
                <button onClick={handleExportPDF} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Xuất PDF">
                    <FileType size={18} />
                </button>
            </div>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-xs focus:border-photo-gold outline-none text-white transition-all"
          />
        </div>
      </div>
      
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
            {filteredUsers.map(user => {
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
                      <span className="text-red-500 text-[9px] font-black uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Đang khóa</span>
                    ) : (
                      <span className="text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Hoạt động</span>
                    )}
                  </td>
                  <td className="py-5 text-right pr-4 flex justify-end gap-2">
                    <button 
                      onClick={() => handleResetPassword(user.id, user.fullName)}
                      title="Reset mật khẩu (Fotoz@123)"
                      className="p-2 rounded-xl transition-all hover:bg-yellow-500/20 group-hover:opacity-100 opacity-50"
                    >
                      <Key className="text-photo-gold" size={18}/>
                    </button>
                    <button 
                      onClick={() => handleToggleLock(user.id)}
                      title={isLocked ? "Mở khóa" : "Khóa tài khoản"}
                      className={`p-2 rounded-xl transition-all ${isLocked ? 'hover:bg-green-500/20' : 'hover:bg-red-500/20'}`}
                    >
                      {isLocked ? <ShieldCheck className="text-green-500" size={18}/> : <ShieldX className="text-red-500" size={18}/>}
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