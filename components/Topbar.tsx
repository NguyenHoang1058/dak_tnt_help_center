
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, COLORS } from '../constants';

interface TopbarProps {
  onHelpClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'market' | 'ai' | 'system';
  isRead: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ onHelpClick, onProfileClick, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = [
    { id: '1', title: 'Danh mục của bạn vừa tăng 2.5% nhờ VNM 🚀', time: '5 phút trước', type: 'market', isRead: false },
    { id: '2', title: 'AI Advisor có gợi ý mới cho hồ sơ rủi ro của bạn', time: '1 giờ trước', type: 'ai', isRead: false },
    { id: '3', title: 'Thị trường mô phỏng đã mở cửa phiên sáng', time: '3 giờ trước', type: 'system', isRead: true },
    { id: '4', title: 'Đã hoàn thành nhiệm vụ ngày. Hãy vào nhận thưởng ngay!', time: '1 ngày trước', type: 'system', isRead: true },
    { id: '5', title: 'Cảnh báo: Danh mục đang lệch chuẩn an toàn', time: '2 ngày trước', type: 'ai', isRead: true },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Xử lý đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      onLogout();
    }
  };

  return (
    <header className="fixed top-0 right-0 left-[260px] h-[70px] bg-[#1e2329]/95 backdrop-blur-md border-b border-[#2b3139] flex items-center justify-between px-8 z-[999]">
      <h2 className="text-xl font-semibold">Xin chào, Nguyễn Văn A! 👋</h2>
      
      <div className="flex items-center gap-6">
        {/* Help Icon */}
        <button 
          onClick={onHelpClick}
          className="w-10 h-10 rounded-full bg-[#2b3139] flex items-center justify-center hover:bg-[#f0b90b] hover:text-[#0b0e11] transition-all topbar-icon"
          title="Trung tâm hỗ trợ"
        >
          <ICONS.Faq />
        </button>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-10 h-10 rounded-full bg-[#2b3139] flex items-center justify-center cursor-pointer transition-all topbar-icon ${showNotifications ? 'text-[#f0b90b] bg-[#2b3139]' : 'hover:bg-[#2b3139]/80'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f6465d] rounded-full text-[10px] flex items-center justify-center font-bold text-white border-2 border-[#1e2329]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#1e2329] border border-[#2b3139] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="px-4 py-3 border-b border-[#2b3139] flex justify-between items-center">
                <span className="font-bold">Thông báo</span>
                <button className="text-[10px] text-[#f0b90b] hover:underline uppercase font-bold">Đánh dấu đã đọc</button>
              </div>
              <div className="max-h-[350px] overflow-y-auto">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`px-4 py-3 hover:bg-[#2b3139] cursor-pointer border-b border-[#2b3139]/50 transition-colors flex gap-3 ${!n.isRead ? 'bg-[#2b3139]/30' : ''}`}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-[#f0b90b]' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm leading-snug ${!n.isRead ? 'text-[#eaecef] font-medium' : 'text-[#848e9c]'}`}>
                        {n.title}
                      </p>
                      <p className="text-[10px] text-[#848e9c] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 text-center border-t border-[#2b3139]">
                <button className="text-xs text-[#f0b90b] font-medium hover:underline">Xem tất cả thông báo</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#f0b90b] to-[#ffd700] text-[#0b0e11] flex items-center justify-center font-bold cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-lg ${showProfileMenu ? 'ring-2 ring-[#f0b90b] ring-offset-2 ring-offset-[#1e2329]' : ''}`}
            title="Tài khoản"
          >
            NA
          </div>

          {/* Profile Dropdown Panel */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-[#1e2329] border border-[#2b3139] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="p-4 border-b border-[#2b3139] bg-[#2b3139]/30">
                <p className="text-sm font-bold">Nguyễn Văn A</p>
                <p className="text-xs text-[#848e9c]">vna.nguyen@example.com</p>
              </div>
              <div className="py-2">
                <button 
                  onClick={() => {
                    onProfileClick();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#eaecef] hover:bg-[#2b3139] transition-colors text-left"
                >
                  <i className="bi bi-person-circle text-[#f0b90b]"></i>
                  <span>Thông tin tài khoản</span>
                </button>
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f6465d] hover:bg-[#f6465d]/10 transition-colors text-left"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
