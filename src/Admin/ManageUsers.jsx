import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { exportToExcel, exportToPDF } from '../utils/exportData'; 
import { 
  FileSpreadsheet, 
  FileType, 
  ShieldCheck, 
  ShieldX, 
  Key, 
  Loader2, 
  Search,
  BellRing, 
  CheckCircle2
} from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetRequests, setResetRequests] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchResetRequests();
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

  const fetchResetRequests = async () => {
    try {
      const res = await axiosClient.get('/Admin/reset-requests');
      setResetRequests(res.data);
    } catch (error) {
      console.error("Lỗi tải thông báo", error);
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
    if (!window.confirm(`Bạn có chắc muốn đặt lại mật khẩu cho "${userName}" về mặc định (Fotoz@123)?`)) return false;
    try {
      const res = await axiosClient.post(`/Admin/users/${userId}/reset-password`);
      alert(`✅ ${res.data.message}`);
      return true; 
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi reset mật khẩu");
      return false;
    }
  };

  // 🌟 ĐÃ TỐI ƯU: Xử lý nhanh từ Bảng thông báo không sợ lỗi gạch tìm kiếm
  const handleQuickReset = async (email, requestId) => {
    // Tìm kiếm trong bộ mảng tổng gốc đề phòng Admin đang lọc ô Search
    const userToReset = users.find(u => u.email?.toLowerCase() === email?.toLowerCase());
    
    if (!userToReset) {
      if (!window.confirm(`⚠️ Tài khoản này hiện không hiển thị trên danh sách lọc. Bạn có muốn Admin ép hệ thống Reset mật khẩu trực tiếp cho Email: ${email}?`)) return;
      
      try {
        // Nếu không có ID sẵn, ta gửi request kèm query email để Backend xử lý map
        await axiosClient.post(`/Admin/users/reset-by-email`, { email: email });
        alert(`✅ Đã xử lý reset mật khẩu thành công cho ${email}`);
        setResetRequests(prev => prev.filter(r => r.id !== requestId));
        fetchUsers(); // Tải lại danh sách cập nhật
      } catch (err) {
        alert(err.response?.data?.message || "Không thể thực hiện reset nhanh. Vui lòng tìm thủ công ở bảng dưới.");
      }
      return;
    }

    // Nếu tìm thấy User ngay trên State, chạy hàm reset chuẩn
    const isSuccess = await handleResetPassword(userToReset.id, userToReset.fullName);
    if (isSuccess) {
      setResetRequests(prev => prev.filter(r => r.id !== requestId));
      fetchUsers(); // Sync lại dữ liệu bảng dưới cho đồng bộ trạng thái mới
    }
  };

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
      
      {/* 🌟 KHU VỰC THÔNG BÁO QUÊN MẬT KHẨU */}
      {resetRequests.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[32px] p-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <div className="flex items-center gap-3 text-red-400 mb-4 border-b border-red-500/20 pb-4">
            <BellRing size={24} className="animate-bounce" />
            <h3 className="font-black text-lg uppercase tracking-tight">Yêu cầu khôi phục mật khẩu ({resetRequests.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resetRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-red-500/10">
                <div>
                  <p className="text-white font-bold text-sm">{req.email}</p>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">{req.time}</p>
                </div>
                <button 
                  onClick={() => handleQuickReset(req.email, req.id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20"
                >
                  <Key size={14} /> Reset Ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEADER QUẢN LÝ */}
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
      
      {/* BẢNG NGƯỜI DÙNG */}
      <div className="glass p-6 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
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
    </div>
  );
};

export default ManageUsers;