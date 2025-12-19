
import React, { useState } from 'react';
import { ICONS, COLORS } from '../constants';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Giả lập gọi API
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isLogin) {
      if (formData.email && formData.password) {
        onLoginSuccess({ email: formData.email, name: 'Nguyễn Văn A' });
      } else {
        setError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
      } else if (formData.email && formData.password && formData.fullName) {
        setIsLogin(true);
        setError('Đăng ký thành công! Vui lòng đăng nhập.');
      } else {
        setError('Vui lòng điền đầy đủ tất cả các trường.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#f0b90b]/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#f0b90b]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-[450px] bg-[#1e2329] border border-[#2b3139] rounded-3xl p-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 text-3xl font-bold mb-4" style={{ color: COLORS.yellow }}>
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
            DAK.TNT
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Đăng nhập' : 'Tạo tài khoản miễn phí'}
          </h2>
          <p className="text-[#848e9c] mt-2 text-sm">
            {isLogin ? 'Chào mừng bạn quay lại với hệ thống trading mô phỏng.' : 'Bắt đầu hành trình chinh phục thị trường tài chính ngay hôm nay.'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-3 rounded-lg text-xs font-bold flex items-center gap-2 ${error.includes('thành công') ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 'bg-[#f6465d]/10 text-[#f6465d]'}`}>
            <i className={`bi ${error.includes('thành công') ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#848e9c] uppercase">Họ và tên</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="fullName"
                  required
                  placeholder="Nhập họ tên của bạn"
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-4 outline-none focus:border-[#f0b90b] transition-all"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#848e9c] uppercase">Email / Số điện thoại</label>
            <div className="relative">
              <input 
                type="text" 
                name="email"
                required
                placeholder="Nhập email hoặc SĐT"
                className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-4 outline-none focus:border-[#f0b90b] transition-all"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#848e9c] uppercase">Mật khẩu</label>
              {isLogin && <button type="button" className="text-[10px] text-[#f0b90b] hover:underline font-bold">Quên mật khẩu?</button>}
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                required
                placeholder="Nhập mật khẩu"
                className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-4 outline-none focus:border-[#f0b90b] transition-all pr-12"
                onChange={handleInputChange}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848e9c] hover:text-[#eaecef]"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#848e9c] uppercase">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                name="confirmPassword"
                required
                placeholder="Nhập lại mật khẩu"
                className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-xl py-3 px-4 outline-none focus:border-[#f0b90b] transition-all"
                onChange={handleInputChange}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#f0b90b] text-[#0b0e11] py-4 rounded-xl font-black text-sm hover:bg-[#f0b90b]/90 transition-all active:scale-[0.98] shadow-lg shadow-[#f0b90b]/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-[#0b0e11] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#2b3139] text-center">
          <p className="text-sm text-[#848e9c]">
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 text-[#f0b90b] font-bold hover:underline"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay'}
            </button>
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
           <p className="text-[10px] text-[#848e9c] uppercase font-bold tracking-widest">Hoặc tiếp tục với</p>
           <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-[#2b3139] flex items-center justify-center hover:bg-[#2b3139] transition-all text-xl">
                <i className="bi bi-google"></i>
              </button>
              <button className="w-12 h-12 rounded-full border border-[#2b3139] flex items-center justify-center hover:bg-[#2b3139] transition-all text-xl">
                <i className="bi bi-apple"></i>
              </button>
              <button className="w-12 h-12 rounded-full border border-[#2b3139] flex items-center justify-center hover:bg-[#2b3139] transition-all text-xl">
                <i className="bi bi-facebook"></i>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
