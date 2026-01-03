
import React, { useState, useEffect, useMemo } from 'react';
import { PerformanceChart } from './PerformanceChart';

const WALLET_KEY = 'dak_tnt_wallet_v2';
const PORTFOLIO_KEY = 'dak_tnt_portfolio_v2';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ cash: 0, portfolioValue: 0 });
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | 'YTD' | '1Y'>('1M');
  const [showBenchmark, setShowBenchmark] = useState(true);

  const calculateNAV = () => {
    const wData = localStorage.getItem(WALLET_KEY);
    const pData = localStorage.getItem(PORTFOLIO_KEY);
    
    const wallet = wData ? JSON.parse(wData) : { cash: 0 };
    const portfolio = pData ? JSON.parse(pData) : [];
    
    // Giá thị trường giả định (khớp với Portfolio.tsx)
    const marketPrices: Record<string, number> = { 'VNM': 72400, 'FPT': 128500, 'VCB': 94200, 'HPG': 28150 };
    const pValue = portfolio.reduce((sum: number, pos: any) => sum + (pos.quantity * (marketPrices[pos.symbol] || pos.avgPrice)), 0);
    
    setStats({ cash: wallet.cash, portfolioValue: pValue });
  };

  useEffect(() => {
    calculateNAV();
    window.addEventListener('dak_sync', calculateNAV);
    return () => window.removeEventListener('dak_sync', calculateNAV);
  }, []);

  const totalNAV = stats.cash + stats.portfolioValue;
  const formatVND = (n: number) => '₫' + n.toLocaleString('vi-VN');

  // Generate Mock Chart Data (Duplicated logic from Portfolio for consistency)
  const chartData = useMemo(() => {
      const days = timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 180;
      const data = [];
      let currentPort = 0; // Cumulative Return
      let currentBench = 0;

      // Create a deterministic random walk based on seed
      for (let i = 0; i <= days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - i));
          
          // Slight upward trend for portfolio in demo
          const dailyVol = (Math.random() - 0.4) * 1.5; 
          const benchVol = (Math.random() - 0.45) * 1.2;

          currentPort += dailyVol;
          currentBench += benchVol;

          data.push({
              date: date.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}),
              portfolio: currentPort,
              benchmark: currentBench
          });
      }
      return data;
  }, [timeRange]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] hover:border-[#f0b90b] transition-all shadow-xl group">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-2 tracking-widest">Tổng tài sản ước tính (NAV)</p>
          <h3 className="text-2xl font-black text-white group-hover:text-[#f0b90b] transition-colors">{formatVND(totalNAV)}</h3>
          <p className="text-[10px] text-[#0ecb81] font-bold mt-1 uppercase">Sẵn sàng giao dịch</p>
        </div>
        <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] hover:border-[#f0b90b] transition-all shadow-xl">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-2 tracking-widest">Số dư tiền mặt</p>
          <h3 className="text-2xl font-black text-[#eaecef]">{formatVND(stats.cash)}</h3>
          <p className="text-[10px] text-[#848e9c] font-bold mt-1 uppercase">Available Cash</p>
        </div>
        <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] hover:border-[#f0b90b] transition-all shadow-xl">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-2 tracking-widest">Giá trị cổ phiếu</p>
          <h3 className="text-2xl font-black text-[#eaecef]">{formatVND(stats.portfolioValue)}</h3>
          <p className="text-[10px] text-[#848e9c] font-bold mt-1 uppercase">Holdings Value</p>
        </div>
        <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] hover:border-[#f0b90b] transition-all shadow-xl">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-2 tracking-widest">Tỷ trọng đầu tư</p>
          <h3 className="text-2xl font-black text-[#f0b90b]">{((stats.portfolioValue / totalNAV) * 100 || 0).toFixed(1)}%</h3>
          <p className="text-[10px] text-[#848e9c] font-bold mt-1 uppercase">Risk Allocation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-2xl">
           <div className="flex flex-wrap justify-between items-center mb-6">
                <div>
                     <h4 className="font-black text-sm text-[#848e9c] uppercase tracking-widest flex items-center gap-2">
                        Hiệu suất tài sản
                        <span className="text-[9px] bg-[#2b3139] px-1.5 py-0.5 rounded text-[#0ecb81] border border-[#474d57]/50">Live</span>
                     </h4>
                </div>
                <div className="flex items-center gap-2">
                     <div className="bg-[#0b0e11] rounded-lg p-1 flex">
                        {['1W', '1M', '3M', 'YTD', '1Y'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setTimeRange(t as any)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${timeRange === t ? 'bg-[#2b3139] text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}
                            >
                                {t}
                            </button>
                        ))}
                     </div>
                </div>
           </div>
           
           <PerformanceChart data={chartData} timeRange={timeRange} showBenchmark={showBenchmark} />
        </div>
        
        <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-7 shadow-xl">
           <h4 className="font-black text-sm text-[#848e9c] uppercase mb-8 tracking-widest border-b border-[#2b3139] pb-4">Phân bổ danh mục</h4>
           <div className="flex items-center justify-center py-6">
              <div className="w-48 h-48 rounded-full border-[18px] border-[#2b3139] flex items-center justify-center relative shadow-inner">
                 <div 
                    className="absolute inset-0 rounded-full border-[18px] border-[#f0b90b] border-l-transparent border-b-transparent transition-all duration-1000"
                    style={{ transform: `rotate(${((stats.portfolioValue / totalNAV) * 3.6 || 0)}deg)` }}
                 ></div>
                 <div className="text-center">
                    <p className="text-3xl font-black text-white">{((stats.portfolioValue / totalNAV) * 100 || 0).toFixed(0)}%</p>
                    <p className="text-[10px] text-[#848e9c] font-bold uppercase tracking-widest">Cổ phiếu</p>
                 </div>
              </div>
           </div>
           <div className="space-y-4 mt-8">
              <div className="flex justify-between items-center text-xs font-bold">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#f0b90b] rounded-sm shadow-sm"></div>
                    <span className="text-[#eaecef]">Tài sản rủi ro</span>
                 </div>
                 <span className="text-[#eaecef] font-mono">{formatVND(stats.portfolioValue)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#2b3139] rounded-sm shadow-sm"></div>
                    <span className="text-[#848e9c]">Tiền mặt</span>
                 </div>
                 <span className="text-[#848e9c] font-mono">{formatVND(stats.cash)}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
