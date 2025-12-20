
import React, { useState } from 'react';
import { ICONS, COLORS } from '../../constants';
import { FeedItem, Mission } from '../../types';

const Feed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  
  const mockFeeds: FeedItem[] = [
    {
      id: 'f1',
      title: 'VNM: Phân tích kỹ thuật và triển vọng tăng trưởng Q3',
      summary: 'Dựa trên dữ liệu thị trường mới nhất, VNM đang hình thành mô hình cốc tay cầm. AI Advisor khuyến nghị theo dõi vùng giá 72.x...',
      category: 'AI Insight',
      author: 'DAK.TNT AI',
      time: '10 phút trước',
      reward: 5000,
      read: false
    },
    {
      id: 'f2',
      title: 'Thị trường chứng khoán Việt Nam đón nhận dòng vốn ngoại mạnh mẽ',
      summary: 'Khối ngoại quay trở lại mua ròng hơn 500 tỷ đồng trong phiên sáng, tập trung vào nhóm VN30 và các cổ phiếu ngành ngân hàng.',
      category: 'Tin tức',
      author: 'Ban Tin Tài Chính',
      time: '45 phút trước',
      reward: 2000,
      read: true
    },
    {
      id: 'f3',
      title: 'Hướng dẫn: Cách quản lý rủi ro khi thị trường biến động',
      summary: 'Việc đặt lệnh Stop-loss là cực kỳ quan trọng trong giai đoạn này. Hãy tìm hiểu cách AI giúp bạn tối ưu hóa điểm cắt lỗ.',
      category: 'Hệ thống',
      author: 'Admin DAK.TNT',
      time: '2 giờ trước',
      reward: 10000,
      read: false
    }
  ];

  const mockMissions: Mission[] = [
    {
      id: 'm1',
      level: 1,
      category: 'Tiền tệ',
      title: 'Tiền đến từ đâu?',
      description: 'Khám phá lịch sử của tiền tệ và cách các sàn giao dịch hiện đại vận hành.',
      moneyReward: 50000,
      xpReward: 100,
      progress: 100,
      status: 'Completed'
    },
    {
      id: 'm2',
      level: 2,
      category: 'Tiết kiệm',
      title: 'Sức mạnh của Lãi suất kép',
      description: 'Tại sao Albert Einstein gọi đây là kỳ quan thứ 8 của thế giới?',
      moneyReward: 100000,
      xpReward: 250,
      progress: 45,
      status: 'InProgress'
    },
    {
      id: 'm3',
      level: 3,
      category: 'Đầu tư',
      title: 'Cổ phiếu là gì?',
      description: 'Học cách sở hữu một phần của các tập đoàn lớn nhất thế giới.',
      moneyReward: 200000,
      xpReward: 500,
      progress: 0,
      status: 'Available'
    },
    {
      id: 'm4',
      level: 4,
      category: 'Giao dịch',
      title: 'Đọc hiểu biểu đồ Nến Nhật',
      description: 'Ngôn ngữ bí mật của các nhà giao dịch chuyên nghiệp.',
      moneyReward: 500000,
      xpReward: 1000,
      progress: 0,
      status: 'Locked'
    }
  ];

  const filters = ['Tất cả', 'Tin tức', 'Phân tích', 'AI Insight', 'Học tập', 'Hệ thống'];

  const renderMissions = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-r from-[#f0b90b]/20 to-transparent p-6 rounded-2xl border border-[#f0b90b]/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#f0b90b] mb-1">Học Viện Tài Chính 🏆</h2>
            <p className="text-[#848e9c] text-sm">Hoàn thành bài học để nhận thêm vốn mô phỏng và mở khóa tính năng mới.</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[10px] text-[#848e9c] uppercase font-bold">Cấp độ</p>
              <p className="text-xl font-bold">Lvl 1</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-[#848e9c] uppercase font-bold">Kinh nghiệm</p>
              <p className="text-xl font-bold">1,250 XP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMissions.map((mission) => (
          <div 
            key={mission.id}
            className={`relative overflow-hidden bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 transition-all ${
              mission.status === 'Locked' ? 'opacity-60 grayscale' : 'hover:border-[#f0b90b] cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2b3139] flex items-center justify-center text-[#f0b90b] font-bold">
                  {mission.level}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#848e9c] uppercase">{mission.category}</span>
                  <h4 className="font-bold text-lg">{mission.title}</h4>
                </div>
              </div>
              {mission.status === 'Locked' ? (
                <i className="bi bi-lock-fill text-[#848e9c]"></i>
              ) : mission.status === 'Completed' ? (
                <i className="bi bi-patch-check-fill text-[#0ecb81]"></i>
              ) : null}
            </div>

            <p className="text-[#848e9c] text-sm mb-6 line-clamp-2">{mission.description}</p>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-[#848e9c]">Tiến độ</span>
                <span className="text-[#f0b90b]">{mission.progress}%</span>
              </div>
              <div className="w-full bg-[#2b3139] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#f0b90b] h-full transition-all duration-1000" 
                  style={{ width: `${mission.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-3">
                  <span className="text-[11px] font-bold text-[#0ecb81]">
                    <i className="bi bi-coin"></i> +₫{mission.moneyReward.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#3b82f6]">
                    <i className="bi bi-lightning-fill"></i> +{mission.xpReward} XP
                  </span>
                </div>
                <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mission.status === 'Completed' 
                    ? 'bg-[#0ecb81]/20 text-[#0ecb81] cursor-default'
                    : 'bg-[#f0b90b] text-[#0b0e11] hover:scale-105'
                }`}>
                  {mission.status === 'Completed' ? 'Đã hoàn thành' : mission.status === 'InProgress' ? 'Tiếp tục' : 'Bắt đầu'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-right duration-500">
      {/* Main Feed Section */}
      <div className="lg:col-span-3 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-[#f0b90b] text-[#0b0e11]' 
                  : 'bg-[#1e2329] text-[#848e9c] hover:bg-[#2b3139] border border-[#2b3139]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {activeFilter === 'Học tập' ? (
          renderMissions()
        ) : (
          <div className="space-y-4">
            {mockFeeds
              .filter(f => activeFilter === 'Tất cả' || f.category === activeFilter)
              .map(item => (
              <div 
                key={item.id} 
                className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-6 hover:border-[#f0b90b] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.category === 'AI Insight' ? 'bg-[#f0b90b]/20 text-[#f0b90b]' :
                      item.category === 'Tin tức' ? 'bg-[#0ecb81]/20 text-[#0ecb81]' :
                      'bg-[#3b82f6]/20 text-[#3b82f6]'
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-[#848e9c]">{item.time} • {item.author}</span>
                  </div>
                  {!item.read && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#f0b90b] bg-[#f0b90b]/10 px-2 py-1 rounded-full animate-pulse">
                      <i className="bi bi-coin"></i> +₫{item.reward.toLocaleString()}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#f0b90b] transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[#848e9c] text-sm leading-relaxed line-clamp-3 mb-4">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#2b3139]">
                  <div className="flex items-center gap-4 text-[#848e9c]">
                    <span className="flex items-center gap-1.5 text-xs hover:text-[#eaecef]"><i className="bi bi-hand-thumbs-up"></i> 1.2k</span>
                    <span className="flex items-center gap-1.5 text-xs hover:text-[#eaecef]"><i className="bi bi-chat-text"></i> 84</span>
                    <span className="flex items-center gap-1.5 text-xs hover:text-[#eaecef]"><i className="bi bi-share"></i> Chia sẻ</span>
                  </div>
                  <button className="text-[#f0b90b] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Đọc ngay <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar Widgets */}
      <div className="space-y-6">
        {/* Mission Widget */}
        <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-5">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <i className="bi bi-trophy text-[#f0b90b]"></i>
            Nhiệm vụ hàng ngày
          </h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#848e9c]">Đọc tin tức (3/5)</span>
                <span className="text-[#f0b90b] font-bold">60%</span>
              </div>
              <div className="w-full bg-[#2b3139] h-2 rounded-full overflow-hidden">
                <div className="bg-[#f0b90b] h-full w-[60%]"></div>
              </div>
            </div>
            <p className="text-[11px] text-[#848e9c]">Đọc thêm 2 bài tin để nhận ₫50,000 vốn mô phỏng.</p>
            <button className="w-full py-2 bg-[#2b3139] hover:bg-[#3b3e44] text-xs font-bold rounded-lg transition-colors">
              Nhận thưởng ngay
            </button>
          </div>
        </div>

        {/* Trending Stocks */}
        <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-5">
          <h4 className="font-bold mb-4">🔥 Đang được quan tâm</h4>
          <div className="space-y-3">
            {[
              { symbol: 'VNM', price: '72,400', change: '+1.2%', up: true },
              { symbol: 'VCB', price: '94,200', change: '-0.5%', up: false },
              { symbol: 'FPT', price: '128,500', change: '+2.8%', up: true },
              { symbol: 'HPG', price: '28,150', change: '+0.1%', up: true },
            ].map((stock, i) => (
              <div key={i} className="flex justify-between items-center p-2 hover:bg-[#2b3139] rounded-lg transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-sm">{stock.symbol}</p>
                  <p className="text-[10px] text-[#848e9c]">Hose • Cổ phiếu</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{stock.price}</p>
                  <p className={`text-xs ${stock.up ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{stock.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Advisor Tip */}
        <div className="bg-gradient-to-br from-[#f0b90b]/10 to-transparent border border-[#f0b90b]/20 rounded-xl p-5">
          <div className="flex items-center gap-2 text-[#f0b90b] mb-2">
            <i className="bi bi-robot"></i>
            <span className="text-xs font-bold uppercase">AI Tip</span>
          </div>
          <p className="text-xs italic text-[#eaecef] leading-relaxed">
            "Bạn nên đọc các bài phân tích về ngành Bán lẻ trong sáng nay, có nhiều biến động tích cực từ chỉ số tiêu dùng."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feed;
