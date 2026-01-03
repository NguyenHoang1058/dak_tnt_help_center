
import React, { useState } from 'react';
import { HelpView } from '../../types';
import { ICONS, COLORS } from '../../constants';
import BugReportForm from './BugReportForm';
import SupportRequest from './SupportRequest';
import FAQGuides from './FAQGuides';

interface HelpCenterProps {
  onClose: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState<HelpView>(HelpView.LANDING);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (currentView) {
      case HelpView.LANDING:
        return renderLanding();
      case HelpView.BUG_REPORT:
        return <BugReportForm onBack={() => setCurrentView(HelpView.LANDING)} />;
      case HelpView.SUPPORT_REQUEST:
      case HelpView.MY_TICKETS:
        return <SupportRequest onBack={() => setCurrentView(HelpView.LANDING)} initialView={currentView} />;
      case HelpView.FAQ:
      case HelpView.USER_GUIDE:
        return <FAQGuides onBack={() => setCurrentView(HelpView.LANDING)} type={currentView} />;
      default:
        return renderLanding();
    }
  };

  const renderLanding = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-300">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Chúng tôi có thể giúp gì cho bạn?</h2>
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#848e9c]">
            <ICONS.Search />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi, hướng dẫn, hoặc tính năng..."
            className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg py-4 pl-12 pr-4 focus:border-[#f0b90b] outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            id: HelpView.BUG_REPORT, 
            title: 'Báo cáo lỗi', 
            desc: 'Giúp chúng tôi cải thiện hệ thống tốt hơn.', 
            icon: <ICONS.Bug />, 
            color: '#f6465d' 
          },
          { 
            id: HelpView.SUPPORT_REQUEST, 
            title: 'Hỗ trợ kỹ thuật', 
            desc: 'Giải đáp thắc mắc về tài khoản & giao dịch.', 
            icon: <ICONS.Support />, 
            color: '#0ecb81' 
          },
          { 
            id: HelpView.FAQ, 
            title: 'Câu hỏi thường gặp', 
            desc: 'Những thắc mắc phổ biến nhất được giải đáp.', 
            icon: <ICONS.Faq />, 
            color: '#f0b90b' 
          },
          { 
            id: HelpView.USER_GUIDE, 
            title: 'Hướng dẫn sử dụng', 
            desc: 'Tìm hiểu cách sử dụng DAK.TNT từ A-Z.', 
            icon: <ICONS.Guide />, 
            color: '#3b82f6' 
          },
        ].map((card) => (
          <button
            key={card.id}
            onClick={() => setCurrentView(card.id as HelpView)}
            className="group flex flex-col items-start p-6 bg-[#1e2329] border border-[#2b3139] rounded-xl hover:border-[#f0b90b] transition-all text-left"
          >
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${card.color}20`, color: card.color }}
            >
              {card.icon}
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-[#f0b90b]">{card.title}</h3>
            <p className="text-sm text-[#848e9c] line-clamp-2">{card.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-6">
        <h4 className="text-lg font-bold mb-4">Bài viết nổi bật</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Làm thế nào để bắt đầu giao dịch đầu tiên?',
            'Cách AI đề xuất danh mục đầu tư cho tôi?',
            'Bảo mật tài khoản 2 lớp (2FA)',
            'Hiểu về các chỉ số cơ bản trong chứng khoán',
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#2b3139] rounded-lg hover:text-[#f0b90b] cursor-pointer group transition-all">
              <span className="font-medium">{item}</span>
              <ICONS.ChevronRight />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0b0e11] w-full max-w-6xl h-[85vh] rounded-2xl border border-[#2b3139] shadow-2xl overflow-hidden flex flex-col">
        {/* Help Center Header */}
        <div className="px-8 py-5 border-b border-[#2b3139] flex items-center justify-between bg-[#1e2329]">
          <div className="flex items-center gap-4">
            {currentView !== HelpView.LANDING && (
              <button 
                onClick={() => setCurrentView(HelpView.LANDING)}
                className="p-2 hover:bg-[#2b3139] rounded-full transition-colors"
              >
                <ICONS.Back />
              </button>
            )}
            <h1 className="text-xl font-bold">Trung tâm hỗ trợ DAK.TNT</h1>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#2b3139] rounded-full transition-colors"
          >
            <ICONS.Close />
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-[#1e2329]/50 to-[#0b0e11]">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#2b3139] bg-[#1e2329] text-center text-xs text-[#848e9c]">
          &copy; 2024 DAK.TNT - Hệ thống học tập & giao dịch mô phỏng dành cho giới trẻ Việt Nam.
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
