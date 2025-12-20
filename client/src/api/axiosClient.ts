import axios from 'axios';

//Tạo một instance của axios với cấu hình mặc định
const axiosClient = axios.create({
    //Địa chỉ của backend server
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type':'application/json',
    },
});

//Thêm interceptor để xử lý token nếu làm thêm chức năng đăng nhập
axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //Xử lý lỗi chung
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
);

export default axiosClient;