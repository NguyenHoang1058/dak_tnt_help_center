
import React, { useState } from 'react';
import { ICONS, COLORS } from '../../constants';
import { FeedItem, Mission } from '../../types';

const Feed: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  
  // Dữ liệu cấp độ và phần thưởng theo yêu cầu
  const userLevel = {
    current: 3,
    balanceReceived: 30000000,
    nextLevelReward: 10000000,
    currentXp: 4200,
    nextLevelXp: 5000
  };

  const xpPercentage = (userLevel.currentXp / userLevel.nextLevelXp) * 100;

  const mockFeeds: FeedItem[] = [
    {
      id: 'f1',
      title: 'Phân tích kỹ thuật VNM: Vùng hỗ trợ mạnh quanh 72.000đ',
      summary: 'Sau chuỗi ngày điều chỉnh, VNM đang cho thấy tín hiệu đảo chiều tích cực tại đường MA50. Các chuyên gia dự báo đây là vùng tích lũy lý tưởng cho chu kỳ Q3...',
      category: 'Phân tích',
      author: 'DAK Research',
      time: '15 phút trước',
      reward: 5000,
      read: false
    },
    {
      id: 'f2',
      title: 'Tin tức thị trường: VN-Index bùng nổ thanh khoản phiên sáng',
      summary: 'Dòng tiền từ khối nội tiếp tục là động lực chính giúp chỉ số vượt ngưỡng kháng cự tâm lý. Nhóm ngân hàng và thép dẫn dắt đà tăng toàn thị trường...',
      category: 'Tin tức',
      author: 'Ban Tin Tài Chính',
      time: '1 giờ trước',
      reward: 2000,
      read: true
    },
    {
      id: 'f3',
      title: 'Phân tích ngành Thép: Triển vọng phục hồi từ thị trường bất động sản',
      summary: 'Giá thép xây dựng có dấu hiệu ấm lại tại thị trường Trung Quốc và Việt Nam. HPG được kỳ vọng sẽ ghi nhận biên lợi nhuận cải thiện rõ rệt trong nửa cuối năm...',
      category: 'Phân tích',
      author: 'Strategy Team',
      time: '3 giờ trước',
      reward: 5000,
      read: false
    },
    {
      id: 'f4',
      title: 'Tin quốc tế: Fed giữ nguyên lãi suất, thị trường vàng dậy sóng',
      summary: 'Tuyên báo mới nhất của Chủ tịch Fed đã đẩy giá vàng thế giới lập đỉnh mới. Nhà đầu tư đang dồn sự chú ý vào báo cáo việc làm phi nông nghiệp Mỹ sắp tới...',
      category: 'Tin tức',
      author: 'World Finance',
      time: '5 giờ trước',
      reward: 2000,
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
      title: 'Thế giới của Phái sinh',
      description: 'Tìm hiểu về hợp đồng tương lai và cách sử dụng đòn bẩy tài chính một cách an toàn.',
      moneyReward: 500000,
      xpReward: 1000,
      progress: 0,
      status: 'Locked'
    }
  ];

  const filters = ['Tất cả', 'Tin tức', 'Phân tích', 'Học tập'];

  const renderLevelDashboard = () => (
    <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 shadow-2xl relative overflow-hidden group mb-6">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
        <i className="bi bi-award-fill text-[120px] text-[#f0b90b]"></i>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Cấp độ & Số dư */}
        <div className="flex items-center gap-5 border-r border-[#2b3139]/50 pr-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f0b90b] to-[#ffd700] p-0.5 shadow-lg shadow-[#f0b90b]/10">
            <div className="w-full h-full bg-[#1e2329] rounded-[14px] flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-[#848e9c] uppercase tracking-tighter">Cấp độ</span>
              <span className="text-3xl font-black text-[#f0b90b] leading-none">{userLevel.current}</span>
            </div>
          </div>
          <div>
            <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-1">Số dư đã nhận hiện tại</p>
            <h2 className="text-2xl font-black text-[#eaecef]">₫{userLevel.balanceReceived.toLocaleString()}</h2>
          </div>
        </div>

        {/* Thanh cấp độ tiếp theo */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black text-[#848e9c] uppercase tracking-widest">Tiến trình lên Lvl {userLevel.current + 1}</span>
            <span className="text-xs font-mono font-bold text-[#f0b90b]">{userLevel.currentXp} / {userLevel.nextLevelXp} XP</span>
          </div>
          <div className="w-full h-3 bg-[#0b0e11] rounded-full overflow-hidden border border-[#2b3139]">
            <div 
              className="h-full bg-gradient-to-r from-[#f0b90b] to-[#ffd700] rounded-full shadow-[0_0_12px_rgba(240,185,11,0.4)] transition-all duration-1000 ease-out"
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Mục tiêu nhận thưởng */}
        <div className="bg-[#0b0e11]/40 border border-[#2b3139] rounded-xl p-4 text-center">
          <p className="text-[10px] font-black text-[#848e9c] uppercase tracking-widest mb-1">Mục tiêu nhận khi đạt Lvl {userLevel.current + 1}</p>
          <div className="flex items-center justify-center gap-2">
            <i className="bi bi-gift-fill text-[#f0b90b] text-xl"></i>
            <span className="text-xl font-black text-[#0ecb81]">₫{userLevel.nextLevelReward.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMissions = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockMissions.map((mission) => (
          <div 
            key={mission.id}
            className={`relative overflow-hidden bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 transition-all duration-300 ${
              mission.status === 'Locked' ? 'opacity-60 grayscale' : 'hover:border-[#f0b90b] shadow-xl'
            }`}
          >
            {mission.status === 'Locked' && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                <div className="bg-[#0b0e11] w-12 h-12 rounded-full border border-[#2b3139] flex items-center justify-center text-[#848e9c]">
                  <i className="bi bi-lock-fill text-xl"></i>
                </div>
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0b0e11] border border-[#2b3139] flex items-center justify-center text-[#f0b90b] font-black text-xl">
                  {mission.level}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#848e9c] uppercase tracking-widest">{mission.category}</span>
                  <h4 className="font-bold text-lg text-[#eaecef]">{mission.title}</h4>
                </div>
              </div>
              {mission.status === 'Completed' && (
                <i className="bi bi-patch-check-fill text-[#0ecb81] text-xl"></i>
              )}
            </div>

            <p className="text-[#848e9c] text-sm mb-6 line-clamp-2 leading-relaxed">{mission.description}</p>

            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#848e9c] uppercase tracking-wider">Tiến độ hoàn thành</span>
                <span className="text-[#f0b90b]">{mission.progress}%</span>
              </div>
              <div className="w-full bg-[#0b0e11] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#f0b90b] h-full" style={{ width: `${mission.progress}%` }}></div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-4">
                  <span className="text-[11px] font-bold text-[#0ecb81] flex items-center gap-1.5">
                    <i className="bi bi-coin"></i> +₫{mission.moneyReward.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#3b82f6] flex items-center gap-1.5">
                    <i className="bi bi-lightning-fill"></i> +{mission.xpReward} XP
                  </span>
                </div>
                <button 
                  disabled={mission.status === 'Locked'}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                    mission.status === 'Completed' 
                      ? 'bg-[#0ecb81]/10 text-[#0ecb81]' 
                      : mission.status === 'Locked'
                        ? 'bg-[#2b3139] text-[#474d57] cursor-not-allowed'
                        : 'bg-[#f0b90b] text-[#0b0e11] hover:scale-105'
                  }`}
                >
                  {mission.status === 'Completed' 
                    ? 'ĐÃ XONG' 
                    : mission.status === 'Locked' 
                      ? 'CHƯA MỞ KHÓA' 
                      : 'BẮT ĐẦU'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-right duration-500">
      
      {/* Level Dashboard - Constant Header */}
      {renderLevelDashboard()}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Feed Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Navigation Tabs - Pill Style */}
          <div className="flex items-center gap-1 p-1 bg-[#1e2329] border border-[#2b3139] rounded-2xl w-fit">
            {filters.map(filter => (
              <button
                key={filter}
                // FIX: Use the correct state setter 'setActiveFilter' instead of undefined 'setFilter'
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeFilter === filter 
                    ? 'bg-[#f0b90b] text-[#0b0e11] shadow-lg' 
                    : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-[#2b3139]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Dynamic Content List */}
          {activeFilter === 'Học tập' ? (
            renderMissions()
          ) : (
            <div className="space-y-4">
              {mockFeeds
                .filter(f => activeFilter === 'Tất cả' || f.category === activeFilter)
                .map(item => (
                <div 
                  key={item.id} 
                  className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 hover:border-[#f0b90b]/30 transition-all cursor-pointer group shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        item.category === 'Tin tức' ? 'bg-[#0ecb81]/15 text-[#0ecb81]' : 'bg-[#3b82f6]/15 text-[#3b82f6]'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-[11px] text-[#848e9c] font-bold uppercase">{item.time} • {item.author}</span>
                    </div>
                    {!item.read && (
                      <span className="flex items-center gap-1.5 text-[11px] font-black text-[#f0b90b] bg-[#f0b90b]/10 px-3 py-1.5 rounded-full border border-[#f0b90b]/20">
                        <i className="bi bi-gift-fill"></i> +₫{item.reward.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black mb-3 group-hover:text-[#f0b90b] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#848e9c] text-sm leading-relaxed line-clamp-3 mb-6">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between pt-5 border-t border-[#2b3139]">
                    <div className="flex items-center gap-6 text-[#848e9c]">
                      <span className="flex items-center gap-2 text-xs hover:text-[#0ecb81] transition-colors"><i className="bi bi-hand-thumbs-up"></i> 1.2k</span>
                      <span className="flex items-center gap-2 text-xs hover:text-[#3b82f6] transition-colors"><i className="bi bi-chat-text"></i> 84</span>
                    </div>
                    <button className="text-[#f0b90b] text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      {item.category === 'Phân tích' ? 'Xem phân tích' : 'Đọc ngay'} 
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Widgets */}
        <div className="space-y-6">
          {/* Achievement Widget */}
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 shadow-2xl">
            <h4 className="font-black text-xs text-[#848e9c] uppercase mb-6 tracking-widest flex items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-[#f0b90b]"></i>
              Tóm tắt học tập
            </h4>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#eaecef]">Kiến thức cơ bản</span>
                  <span className="text-[#f0b90b]">60%</span>
                </div>
                <div className="w-full bg-[#0b0e11] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#f0b90b] h-full w-[60%]"></div>
                </div>
              </div>
              <p className="text-[11px] text-[#848e9c] leading-relaxed italic">"Đạt mốc Lvl {userLevel.current + 1} để nhận thêm ₫{userLevel.nextLevelReward.toLocaleString()} vào vốn giao dịch."</p>
              <button 
                onClick={() => setActiveFilter('Học tập')}
                className="w-full py-3 bg-[#f0b90b] text-[#0b0e11] text-xs font-black rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
              >
                TIẾP TỤC HỌC
              </button>
            </div>
          </div>

          {/* Trending Widget */}
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 shadow-2xl">
            <h4 className="font-black text-xs text-[#848e9c] uppercase mb-6 tracking-widest flex items-center gap-2">
              <i className="bi bi-fire text-[#f6465d]"></i>
              Đang thịnh hành
            </h4>
            <div className="space-y-4">
              {[
                { s: 'VNM', p: '72,400', c: '+1.2%', u: true },
                { s: 'FPT', p: '128,500', c: '+2.8%', u: true },
                { s: 'VCB', p: '94,200', c: '-0.5%', u: false },
              ].map((stock, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="font-black text-sm group-hover:text-[#f0b90b] transition-colors">{stock.s}</span>
                  <div className="text-right">
                    <p className="text-sm font-black font-mono">{stock.p}</p>
                    <p className={`text-xs font-bold ${stock.u ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{stock.c}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
