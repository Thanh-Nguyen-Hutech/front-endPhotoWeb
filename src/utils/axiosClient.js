import axios from 'axios';

// Tạo một "đường ống" kết nối mặc định tới Backend của bạn
const axiosClient = axios.create({
  baseURL: 'https://localhost:7275/api', // Nhớ kiểm tra lại đúng cổng 7275 trên Swagger chưa nhé
});

// "Người gác cổng": Tự động lấy Token từ localStorage và gắn vào trước khi gửi đi
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;