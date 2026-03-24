import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      {/* Navbar cố định ở trên cùng */}
      <Navbar /> 

      {/* Phần nội dung chính:
          - pt-24: Tạo khoảng trống để không bị Navbar đè lên nội dung trang.
          - min-h-screen: Đảm bảo nền màu tối luôn phủ kín màn hình.
      */}
      <div className="pt-24 min-h-screen bg-[#0a0a0a]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking-list" element={<BookingList />} />
          <Route path="/book-now" element={<BookingForm />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/profile/:name" element={<PhotographerProfile />} />
          <Route path="/dashboard" element={<PhotographerDashboard />} />
          <Route path="/booking-manager" element={<BookingManager />} />
          <Route path="/my-history" element={<MyHistory />} />
          
          {/* Chuyển hướng các đường dẫn lạ về Trang chủ */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;