
import React, { useState, useMemo } from 'react';
import { aiApi } from '../api/api';
import { TradeTransaction, MainView } from '../../types';
import { COLORS } from '../../constants';

interface AIAdvisorProps {
  onNavigate?: (view: MainView) => void;
}

const MOCK_TRADES: TradeTransaction[] = [
  { id: 'TX772188201', time: '2024-05-18 10:15:32', symbol: 'VNM', type: 'BUY', side: 'Lệnh thị trường', price: 72400, quantity: 100, total: 7240000, fee: 7240, status: 'Filled' },
  { id: 'TX772188202', time: '2024-05-17 14:20:11', symbol: 'FPT', type: 'SELL', side: 'Lệnh giới hạn', price: 128500, quantity: 50, total: 6425000, fee: 6425, status: 'Filled' },
  { id: 'TX772188203', time: '2024-05-16 09:30:05', symbol: 'VCB', type: 'BUY', side: 'Lệnh giới hạn', price: 94200, quantity: 200, total: 18840000, fee: 18840, status: 'Filled' },
  { id: 'TX772188204', time: '2024-05-16 09:35:12', symbol: 'HPG', type: 'SELL', side: 'Lệnh thị trường', price: 28150, quantity: 1000, total: 28150000, fee: 28150, status: 'Filled' },
];

const AIAdvisor: React.FC<AIAdvisorProps> = ({ onNavigate }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  // Phân tích khẩu vị dựa trên dữ liệu mock
  const profileStats = useMemo(() => {
    const buyTrades = MOCK_TRADES.filter(t => t.type === 'BUY').length;
    const sellTrades = MOCK_TRADES.filter(t => t.type === 'SELL').length;
    
    const appetite = buyTrades + sellTrades > 3 ? 'Aggressive (Tấn công)' : 'Conservative (Phòng thủ)';
    const horizon = buyTrades / (sellTrades || 1) > 1.5 ? 'Trung và dài hạn' : 'Ngắn hạn / Swing';

    return { appetite, horizon };
  }, []);

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const portfolioPayload = {
        profile: {
            appetite: profileStats.appetite,
            horizon: profileStats.horizon
        },
        recentTrades: MOCK_TRADES.map(t => `${t.type} ${t.symbol} giá ${t.price}`),
        marketContext: "VN-Index tăng nhẹ, Công nghệ (FPT) và Thép (HPG) đang sóng mạnh."
      };

      const res = await aiApi.getAdvice(portfolioPayload);

      if(res.data && res.data.success){
        setAiAnalysis(res.data.data);
      }else{
        setAiAnalysis("Không nhận được phản hồi hợp lệ từ server.");
    }

    } catch (error) {
      console.error(error);
      setAiAnalysis("Không thể kết nối với trí tuệ nhân tạo. Vui lòng kiểm tra lại cấu hình API.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black flex items-center gap-3">
            <span className="text-[#f0b90b]"><i className="bi bi-stars"></i></span>
            AI Advisor - Cố vấn Chiến lược
          </h1>
          <p className="text-[#848e9c] text-sm font-medium">
            Phân tích dữ liệu giao dịch để tối ưu hóa lợi nhuận theo phong cách cá nhân của bạn.
          </p>
        </div>
        <button 
          onClick={handleStartAnalysis}
          disabled={isAnalyzing}
          className="px-8 py-3 bg-[#f0b90b] text-[#0b0e11] rounded-xl font-black text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#f0b90b]/10 disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? (
            <span className="w-5 h-5 border-2 border-[#0b0e11] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <i className="bi bi-cpu-fill"></i>
          )}
          {aiAnalysis ? 'CẬP NHẬT PHÂN TÍCH' : 'PHÂN TÍCH DANH MỤC'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Appetite Card */}
        <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 relative overflow-hidden group shadow-xl">
          <h4 className="text-xs font-bold text-[#848e9c] uppercase mb-6 tracking-widest border-b border-[#2b3139] pb-2">Hồ sơ nhà đầu tư</h4>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-[#848e9c] uppercase font-bold mb-1">Khẩu vị rủi ro</p>
                <p className="text-xl font-black text-[#f0b90b]">{profileStats.appetite}</p>
              </div>
              <i className="bi bi-shield-shaded text-3xl text-[#2b3139] group-hover:text-[#f0b90b]/20 transition-colors"></i>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#848e9c]">Mức độ chấp nhận rủi ro</span>
                  <span className="text-[#0ecb81]">75%</span>
               </div>
               <div className="w-full h-1.5 bg-[#2b3139] rounded-full overflow-hidden">
                  <div className="bg-[#0ecb81] h-full w-3/4"></div>
               </div>
            </div>
            <div>
               <p className="text-[10px] text-[#848e9c] uppercase font-bold mb-1">Tầm nhìn đầu tư</p>
               <p className="text-sm font-bold text-[#eaecef]">{profileStats.horizon}</p>
            </div>
          </div>
        </div>

        {/* AI Analysis Insight Area */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1e2329] to-[#0b0e11] border border-[#2b3139] rounded-2xl p-8 relative min-h-[300px] shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <i className="bi bi-robot text-[120px]"></i>
          </div>
          
          <div className="relative z-10">
            <h4 className="text-sm font-bold text-[#f0b90b] uppercase mb-4 flex items-center gap-2">
               <i className="bi bi-chat-left-dots-fill"></i>
               Nhận định từ Trí tuệ nhân tạo
            </h4>
            
            {!aiAnalysis && !isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#2b3139] flex items-center justify-center text-[#848e9c]">
                   <i className="bi bi-search text-2xl"></i>
                </div>
                <p className="text-[#848e9c] text-sm italic">
                  Chưa có dữ liệu phân tích. Nhấn nút "Phân tích danh mục" để AI bắt đầu quét dữ liệu giao dịch của bạn.
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-[#2b3139] rounded w-3/4"></div>
                <div className="h-4 bg-[#2b3139] rounded w-full"></div>
                <div className="h-4 bg-[#2b3139] rounded w-5/6"></div>
                <div className="h-20 bg-[#2b3139] rounded w-full"></div>
                <p className="text-center text-[10px] text-[#f0b90b] font-bold uppercase tracking-widest mt-8">Đang đồng bộ hóa dữ liệu thị trường...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <div className="text-[#eaecef] leading-relaxed text-sm whitespace-pre-wrap">
                  {aiAnalysis}
                </div>
                <div className="mt-8 pt-6 border-t border-[#2b3139] flex items-center gap-2">
                  <span className="text-[10px] text-[#848e9c] font-bold uppercase tracking-widest">Độ tin cậy của thuật toán:</span>
                  <div className="flex gap-1">
                     {[1,2,3,4,5].map(s => <i key={s} className="bi bi-star-fill text-[#f0b90b] text-[8px]"></i>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Watchlist / Sector Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-[#1e2329] border border-[#2b3139] rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-[#2b3139] bg-[#2b3139]/30 flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
               <i className="bi bi-lightning-fill text-[#f0b90b]"></i>
               Cổ phiếu AI gợi ý cho bạn
            </h3>
            <span className="text-[10px] text-[#848e9c] font-bold uppercase">Cập nhật theo thị trường</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#2b3139]/50 text-[#848e9c] text-xs font-bold uppercase">
                <tr>
                  <th className="p-4">Mã CP</th>
                  <th className="p-4">Xếp hạng AI</th>
                  <th className="p-4">Giá mục tiêu</th>
                  <th className="p-4">Return kỳ vọng</th>
                  <th className="p-4">Lý do chính</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b3139]">
                {[
                  { symbol: 'FPT', rating: 'Strong Buy', target: '145,000', return: '+12.8%', reason: 'Tăng trưởng AI đột biến', color: '#0ecb81' },
                  { symbol: 'HPG', rating: 'Buy', target: '32,500', return: '+15.4%', reason: 'Giá thép hồi phục', color: '#0ecb81' },
                  { symbol: 'MWG', rating: 'Hold', target: '65,000', return: '+4.2%', reason: 'Tiêu dùng hồi phục chậm', color: '#f0b90b' },
                  { symbol: 'VIC', rating: 'Sell', target: '40,000', return: '-8.5%', reason: 'Nợ ngắn hạn tăng cao', color: '#f6465d' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-[#2b3139]/30 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <div className="font-bold text-white group-hover:text-[#f0b90b] transition-colors">{item.symbol}</div>
                      <div className="text-[10px] text-[#848e9c]">VN30 Index</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-lg text-[10px] font-black uppercase" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                         {item.rating}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-sm text-[#eaecef]">{item.target}</td>
                    <td className="p-4">
                       <span className={`font-bold text-sm ${item.color === '#f6465d' ? 'text-[#f6465d]' : 'text-[#0ecb81]'}`}>{item.return}</span>
                    </td>
                    <td className="p-4 text-xs text-[#848e9c] max-w-[200px] truncate">{item.reason}</td>
                    <td className="p-4 text-right">
                       <button 
                        onClick={() => onNavigate?.(MainView.TRADING)}
                        className="px-3 py-1 bg-[#2b3139] border border-[#474d57] text-[10px] font-bold rounded-lg hover:border-[#f0b90b] transition-all"
                       >
                        GIAO DỊCH
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 shadow-xl">
             <h4 className="text-xs font-bold text-[#848e9c] uppercase mb-6 tracking-widest border-b border-[#2b3139] pb-2">Ưu tiên nhóm ngành</h4>
             <div className="space-y-4">
                {[
                  { name: 'Công nghệ', weight: 45, color: '#3b82f6' },
                  { name: 'Thép', weight: 30, color: '#f0b90b' },
                  { name: 'Bán lẻ', weight: 25, color: '#0ecb81' },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-2">
                     <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#eaecef]">{s.name}</span>
                        <span className="text-[#848e9c]">{s.weight}%</span>
                     </div>
                     <div className="w-full h-1 bg-[#2b3139] rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${s.weight}%`, backgroundColor: s.color }}></div>
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

export default AIAdvisor;
