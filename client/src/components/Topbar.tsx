
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, COLORS } from '../../constants';

interface TopbarProps {
  onHelpClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  onMenuToggle: () => void;
}

interface Notification {
  id: string;
  title: string;
  time: string;
  type: 'market' | 'ai' | 'system';
  isRead: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ onHelpClick, onProfileClick, onLogout, onMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications: Notification[] = [
    { id: '1', title: 'Danh mục của bạn vừa tăng 2.5% nhờ VNM 🚀', time: '5 phút trước', type: 'market', isRead: false },
    { id: '2', title: 'AI Advisor có gợi ý mới cho hồ sơ rủi ro của bạn', time: '1 giờ trước', type: 'ai', isRead: false },
    { id: '3', title: 'Thị trường mô phỏng đã mở cửa phiên sáng', time: '3 giờ trước', type: 'system', isRead: true },
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
    <header className="fixed top-0 right-0 left-0 lg:left-[260px] h-[70px] bg-[#1e2329]/95 backdrop-blur-md border-b border-[#2b3139] flex items-center justify-between px-4 md:px-8 z-[999] transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-[#848e9c] hover:text-[#f0b90b] transition-colors"
        >
          <i className="bi bi-list text-2xl"></i>
        </button>
        <h2 className="text-sm md:text-xl font-semibold truncate max-w-[150px] md:max-w-none">
          Xin chào, Nguyễn Văn A! 👋
        </h2>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        {/* Help Icon */}
        <button 
          onClick={onHelpClick}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#2b3139] flex items-center justify-center hover:bg-[#f0b90b] hover:text-[#0b0e11] transition-all"
          title="Trung tâm hỗ trợ"
        >
          <div className="scale-75 md:scale-100"><ICONS.Faq /></div>
        </button>

        {/* Notification Icon */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#2b3139] flex items-center justify-center transition-all ${showNotifications ? 'text-[#f0b90b]' : 'hover:bg-[#2b3139]/80'}`}
          >
            <i className="bi bi-bell text-lg md:text-xl"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 bg-[#f6465d] rounded-full text-[9px] md:text-[10px] flex items-center justify-center font-bold text-white border-2 border-[#1e2329]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 md:w-80 bg-[#1e2329] border border-[#2b3139] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="px-4 py-3 border-b border-[#2b3139] flex justify-between items-center">
                <span className="font-bold text-xs md:text-sm">Thông báo</span>
                <button className="text-[9px] md:text-[10px] text-[#f0b90b] hover:underline uppercase font-bold">Đánh dấu đã đọc</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 hover:bg-[#2b3139] cursor-pointer border-b border-[#2b3139]/50 flex gap-3">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${!n.isRead ? 'bg-[#f0b90b]' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-xs md:text-sm leading-snug">{n.title}</p>
                      <p className="text-[9px] md:text-[10px] text-[#848e9c] mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#f0b90b] to-[#ffd700] text-[#0b0e11] flex items-center justify-center font-bold cursor-pointer transition-transform hover:scale-110 shadow-lg text-xs md:text-sm ${showProfileMenu ? 'ring-2 ring-[#f0b90b]' : ''}`}
          >
            NA
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 md:w-56 bg-[#1e2329] border border-[#2b3139] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
              <div className="p-3 md:p-4 border-b border-[#2b3139] bg-[#2b3139]/30">
                <p className="text-xs md:text-sm font-bold truncate">Nguyễn Văn A</p>
                <p className="text-[10px] md:text-xs text-[#848e9c] truncate">vna.nguyen@example.com</p>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { onProfileClick(); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs md:text-sm text-[#eaecef] hover:bg-[#2b3139] transition-colors"
                >
                  <i className="bi bi-person-circle text-[#f0b90b]"></i>
                  <span>Hồ sơ</span>
                </button>
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs md:text-sm text-[#f6465d] hover:bg-[#f6465d]/10 transition-colors"
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
