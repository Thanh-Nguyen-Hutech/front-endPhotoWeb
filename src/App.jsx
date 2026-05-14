import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import MyHistory from './MyHistory';
import CreatePost from './CreatePost';
import PostDetail from './PostDetail';
import PhotographerProfile from './PhotographerProfile';
import PhotographerDashboard from './PhotographerDashboard';
import BookingManager from './BookingManager';
import ReportBug from './components/ReportBug';
import PaymentResult from './components/PaymentResult';

// Import Admin Components
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/AdminDashboard'; 
import ManageUsers from './Admin/ManageUsers';
import ManagePosts from './Admin/ManagePosts'; 
import ManageReports from './Admin/ManageReports';

function App() {
  const [authTick, setAuthTick] = useState(0);

  const refreshNavbar = () => {
    setAuthTick(prev => prev + 1);
  };

  // Lấy role để bảo vệ Route
  const userRole = localStorage.getItem('role')?.toLowerCase();

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 🛡️ LUỒNG ADMIN: Tách biệt hoàn toàn */}
        <Route 
          path="/admin" 
          element={userRole === 'admin' ? <AdminLayout /> : <Navigate to="/login" />}
        >
          {/* Các trang con của Admin */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="posts" element={<ManagePosts />} /> 
          <Route path="reports" element={<ManageReports />} />
        </Route>

        {/* 🏠 LUỒNG NGƯỜI DÙNG & NHIẾP ẢNH GIA */}
        <Route
          path="/*"
          element={
            <>
              {/* Navbar chung */}
              <Navbar key={authTick} />
              
              <div className="pt-24 min-h-screen bg-[#0a0a0a]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login onLoginSuccess={refreshNavbar} />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/booking-list" element={<BookingList />} />
                  <Route path="/book-now" element={<BookingForm />} />
                  <Route path="/create-post" element={<CreatePost />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/profile/:id" element={<PhotographerProfile />} />
                  <Route path="/dashboard" element={<PhotographerDashboard />} />
                  <Route path="/booking-manager" element={<BookingManager />} />
                  <Route path="/my-history" element={<MyHistory />} />
                  <Route path="/payment-result" element={<PaymentResult />} />
                  {/* Trang lỗi/Không tìm thấy */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>

              {/* 🌟 QUAN TRỌNG: Gọi Component ra đây để nó nổi lên trên mọi trang Khách */}
              <ReportBug />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;