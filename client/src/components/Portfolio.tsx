
import React, { useState, useEffect, useMemo } from 'react';
import { MainView } from '../../types';
import { COLORS } from '../../constants';
import { PerformanceChart } from './PerformanceChart';

const PORTFOLIO_KEY = 'dak_tnt_portfolio_v2';
const WALLET_KEY = 'dak_tnt_wallet_v2';

// --- Helper Components ---

// 1. Donut Chart for Allocation
const DonutChart = ({ data, colorMap, title }: { data: { label: string, value: number }[], colorMap: Record<string, string>, title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                    {data.map((item, i) => {
                        const percent = item.value / total;
                        const dashArray = `${percent * 314} 314`;
                        const dashOffset = -cumulativePercent * 314;
                        cumulativePercent += percent;
                        
                        return (
                            <circle
                                key={i}
                                r="40" cx="50" cy="50"
                                fill="transparent"
                                stroke={colorMap[item.label] || '#2b3139'}
                                strokeWidth="12"
                                strokeDasharray={dashArray}
                                strokeDashoffset={dashOffset}
                                className="transition-all duration-500 hover:opacity-80"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-[#848e9c] uppercase">{title}</span>
                </div>
            </div>
            <div className="flex-1 space-y-2">
                {data.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMap[item.label] || '#848e9c' }}></span>
                            <span className="text-[#eaecef] font-bold">{item.label}</span>
                        </div>
                        <span className="text-[#848e9c] font-mono">{((item.value / total) * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 2. Risk Meter Component
const RiskMeter = ({ level }: { level: 'Low' | 'Medium' | 'High' }) => {
    const rotation = level === 'Low' ? -45 : level === 'Medium' ? 0 : 45;
    const color = level === 'Low' ? '#0ecb81' : level === 'Medium' ? '#f0b90b' : '#f6465d';
    
    return (
        <div className="relative w-32 h-16 overflow-hidden flex justify-center items-end mx-auto">
            <div className="absolute w-28 h-28 rounded-full border-[8px] border-[#2b3139] border-b-transparent border-l-transparent" style={{ transform: 'rotate(-45deg)', borderRadius: '50%' }}></div>
            <div className="absolute w-28 h-28 rounded-full border-[8px] border-transparent border-t-[#0ecb81]" style={{ transform: 'rotate(-45deg)' }}></div> 
            <div className="absolute w-28 h-28 rounded-full border-[8px] border-transparent border-r-[#f0b90b]" style={{ transform: 'rotate(-45deg)' }}></div>
            <div className="absolute w-28 h-28 rounded-full border-[8px] border-transparent border-b-[#f6465d]" style={{ transform: 'rotate(-45deg)' }}></div>
            
            {/* Needle */}
            <div className="absolute bottom-0 w-1 h-14 bg-[#eaecef] origin-bottom transition-all duration-700" style={{ transform: `rotate(${rotation}deg)` }}></div>
            <div className="absolute bottom-0 w-4 h-4 bg-[#eaecef] rounded-full"></div>
            
            <p className="absolute bottom-[-25px] font-black text-sm uppercase" style={{ color }}>{level}</p>
        </div>
    );
};

// 3. Performance Attribution Component
const AttributionBar = ({ label, value, maxVal, isPositive }: { label: string, value: number, maxVal: number, isPositive: boolean }) => {
    const widthPercent = (Math.abs(value) / maxVal) * 100;
    const color = isPositive ? '#0ecb81' : '#f6465d';
    const bgColor = isPositive ? 'rgba(14, 203, 129, 0.1)' : 'rgba(246, 70, 93, 0.1)';

    return (
        <div className="flex items-center gap-3 text-xs mb-2 group cursor-pointer">
            <span className="w-12 text-right font-bold text-[#eaecef]">{label}</span>
            <div className="flex-1 h-6 bg-[#0b0e11] rounded relative overflow-hidden flex items-center">
                 {/* Center Line */}
                 <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#2b3139] z-0"></div>
                 
                 {/* Bar */}
                 <div 
                    className="h-4 rounded-sm transition-all duration-500 relative z-10"
                    style={{ 
                        width: `${widthPercent / 2}%`, 
                        backgroundColor: color,
                        marginLeft: isPositive ? '50%' : `calc(50% - ${widthPercent / 2}%)`
                    }}
                 ></div>
                 
                 {/* Value Text */}
                 <span className={`absolute z-20 font-mono font-bold px-2 ${isPositive ? 'right-0' : 'left-0'}`} style={{ color }}>
                    {isPositive ? '+' : ''}{value.toLocaleString('vi-VN')}
                 </span>
            </div>
        </div>
    );
};


const Portfolio: React.FC<{ onNavigate?: (view: MainView) => void }> = ({ onNavigate }) => {
  // State
  const [positions, setPositions] = useState<any[]>([]);
  const [cash, setCash] = useState(0);
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | 'YTD' | '1Y'>('1M');
  const [attributionPeriod, setAttributionPeriod] = useState<'Today' | 'Period'>('Period');
  const [showBenchmark, setShowBenchmark] = useState(true);

  // Load Data
  const loadData = () => {
    const savedPortfolio = localStorage.getItem(PORTFOLIO_KEY);
    const savedWallet = localStorage.getItem(WALLET_KEY);
    
    if (savedPortfolio) setPositions(JSON.parse(savedPortfolio));
    if (savedWallet) setCash(JSON.parse(savedWallet).cash);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('dak_sync', loadData);
    return () => window.removeEventListener('dak_sync', loadData);
  }, []);

  // Calculation Logic
  const enrichedPositions = useMemo(() => {
    const marketPrices: Record<string, number> = { 'VNM': 72400, 'FPT': 128500, 'VCB': 94200, 'HPG': 28150, 'MWG': 48200 };
    return positions.map(pos => {
      const currentPrice = marketPrices[pos.symbol] || pos.avgPrice;
      const value = pos.quantity * currentPrice;
      const pnl = (currentPrice - pos.avgPrice) * pos.quantity;
      const pnlPercent = ((currentPrice / pos.avgPrice) - 1) * 100;
      
      // Mock daily change for "Today" attribution
      const dailyChangePercent = (Math.random() * 4 - 2); // -2% to +2%
      const dailyPnL = value * (dailyChangePercent / 100);

      // Mock Industry
      const sector = ['FPT', 'MWG'].includes(pos.symbol) ? 'Công nghệ & Bán lẻ' : pos.symbol === 'VCB' ? 'Ngân hàng' : 'Sản xuất';
      return { ...pos, currentPrice, value, pnl, pnlPercent, sector, dailyPnL };
    });
  }, [positions]);

  const totalStockValue = enrichedPositions.reduce((s, p) => s + p.value, 0);
  const totalNAV = totalStockValue + cash;
  const totalPnl = enrichedPositions.reduce((s, p) => s + p.pnl, 0);
  const totalPnlPercent = totalNAV > 0 ? (totalPnl / (totalNAV - totalPnl)) * 100 : 0;
  
  // Risk Analysis
  const riskLevel = useMemo(() => {
      const stockRatio = totalStockValue / (totalNAV || 1);
      if (stockRatio > 0.8) return 'High';
      if (stockRatio > 0.4) return 'Medium';
      return 'Low';
  }, [totalStockValue, totalNAV]);

  // Allocation Data
  const allocationByStock = useMemo(() => {
      const data = enrichedPositions.map(p => ({ label: p.symbol, value: p.value })).sort((a,b) => b.value - a.value);
      const top5 = data.slice(0, 4);
      const others = data.slice(4).reduce((sum, item) => sum + item.value, 0);
      if (others > 0) top5.push({ label: 'Others', value: others });
      return top5;
  }, [enrichedPositions]);

  const allocationBySector = useMemo(() => {
      const sectors: Record<string, number> = {};
      enrichedPositions.forEach(p => {
          sectors[p.sector] = (sectors[p.sector] || 0) + p.value;
      });
      return Object.entries(sectors).map(([label, value]) => ({ label, value })).sort((a,b) => b.value - a.value);
  }, [enrichedPositions]);

  // Color Mapping
  const stockColors: Record<string, string> = { 'FPT': '#f0b90b', 'VNM': '#3b82f6', 'VCB': '#0ecb81', 'HPG': '#f6465d', 'Others': '#848e9c' };
  const sectorColors: Record<string, string> = { 'Công nghệ & Bán lẻ': '#f0b90b', 'Ngân hàng': '#0ecb81', 'Sản xuất': '#3b82f6' };

  // Attribution Data
  const attributionData = useMemo(() => {
      const isToday = attributionPeriod === 'Today';
      const sorted = [...enrichedPositions].sort((a, b) => {
          const valA = isToday ? a.dailyPnL : a.pnl;
          const valB = isToday ? b.dailyPnL : b.pnl;
          return valB - valA;
      });

      const winners = sorted.filter(x => (isToday ? x.dailyPnL : x.pnl) > 0).slice(0, 3);
      const losers = sorted.filter(x => (isToday ? x.dailyPnL : x.pnl) < 0).reverse().slice(0, 3);
      
      // Calculate max value for bar scaling
      const maxVal = Math.max(
          ...winners.map(x => Math.abs(isToday ? x.dailyPnL : x.pnl)),
          ...losers.map(x => Math.abs(isToday ? x.dailyPnL : x.pnl)),
          1 // avoid div by zero
      );

      return { winners, losers, maxVal };
  }, [enrichedPositions, attributionPeriod]);

  // Generate Mock Chart Data based on timeRange
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

  const formatVND = (n: number) => '₫' + n.toLocaleString('vi-VN');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* 1. PORTFOLIO OVERVIEW HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] shadow-lg">
            <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-2">Tổng tài sản (NAV)</p>
            <h2 className="text-3xl font-black text-white">{formatVND(totalNAV)}</h2>
         </div>
         <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] shadow-lg">
            <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-2">Lãi/Lỗ tạm tính (Unrealized)</p>
            <h2 className={`text-2xl font-black ${totalPnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {totalPnl > 0 ? '+' : ''}{formatVND(totalPnl)}
            </h2>
            <div className={`text-xs font-bold mt-1 inline-flex items-center px-2 py-0.5 rounded ${totalPnl >= 0 ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 'bg-[#f6465d]/10 text-[#f6465d]'}`}>
                {totalPnlPercent.toFixed(2)}% All time
            </div>
         </div>
         <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] shadow-lg">
             <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-2">P/L Hôm nay</p>
             <h2 className="text-2xl font-black text-[#0ecb81]">+{formatVND(totalNAV * 0.012)}</h2>
             <p className="text-[10px] text-[#0ecb81] mt-1 font-bold">+1.2% (vs Yesterday)</p>
         </div>
         <div className="bg-[#1e2329] p-6 rounded-2xl border border-[#2b3139] shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i className="bi bi-wallet2 text-5xl"></i>
            </div>
            <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-2">Sức mua khả dụng</p>
            <h2 className="text-2xl font-black text-[#eaecef]">{formatVND(cash)}</h2>
            <button 
                onClick={() => onNavigate?.(MainView.TRADING)}
                className="mt-3 text-[10px] font-bold bg-[#f0b90b] text-[#0b0e11] px-3 py-1.5 rounded hover:scale-105 transition-transform"
            >
                GIAO DỊCH NGAY
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2. PERFORMANCE & ATTRIBUTION (MAIN COL) */}
        <div className="lg:col-span-2 space-y-6">
             {/* 2.1 Chart */}
             <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-xl">
                 <div className="flex flex-wrap justify-between items-center mb-6">
                     <div>
                         <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            Hiệu quả đầu tư
                            <span className="text-[10px] bg-[#2b3139] px-2 py-0.5 rounded text-[#848e9c] border border-[#474d57]">Return %</span>
                         </h3>
                     </div>
                     <div className="flex items-center gap-3">
                         <div className="bg-[#0b0e11] rounded-lg p-1 flex">
                            {['1W', '1M', '3M', 'YTD', '1Y'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setTimeRange(t as any)}
                                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${timeRange === t ? 'bg-[#2b3139] text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}
                                >
                                    {t}
                                </button>
                            ))}
                         </div>
                     </div>
                 </div>
                 <PerformanceChart data={chartData} timeRange={timeRange} showBenchmark={showBenchmark} />
             </div>

             {/* 2.2 PERFORMANCE ATTRIBUTION */}
             <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-xl">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#2b3139]">
                     <h4 className="font-black text-sm text-[#848e9c] uppercase tracking-widest flex items-center gap-2">
                        <i className="bi bi-bar-chart-steps"></i> Đóng góp hiệu suất (Attribution)
                     </h4>
                     <div className="flex gap-2">
                         {['Today', 'Period'].map(t => (
                             <button 
                                key={t}
                                onClick={() => setAttributionPeriod(t as any)}
                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${attributionPeriod === t ? 'bg-[#f0b90b] text-[#0b0e11]' : 'bg-[#2b3139] text-[#848e9c]'}`}
                             >
                                 {t === 'Today' ? 'Hôm nay' : 'Kỳ này'}
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Top Contributors */}
                     <div>
                         <p className="text-xs font-bold text-[#0ecb81] mb-4 flex items-center gap-2">
                             <i className="bi bi-arrow-up-circle-fill"></i> Kéo danh mục tăng (Top Contributors)
                         </p>
                         {attributionData.winners.length > 0 ? attributionData.winners.map((item, i) => (
                             <AttributionBar 
                                key={item.symbol} 
                                label={item.symbol} 
                                value={attributionPeriod === 'Today' ? item.dailyPnL : item.pnl} 
                                maxVal={attributionData.maxVal} 
                                isPositive={true} 
                             />
                         )) : (
                             <p className="text-xs text-[#848e9c] italic py-4">Chưa có mã tăng giá trong kỳ này.</p>
                         )}
                     </div>

                     {/* Top Detractors */}
                     <div>
                         <p className="text-xs font-bold text-[#f6465d] mb-4 flex items-center gap-2">
                             <i className="bi bi-arrow-down-circle-fill"></i> Kéo danh mục giảm (Top Detractors)
                         </p>
                         {attributionData.losers.length > 0 ? attributionData.losers.map((item, i) => (
                             <AttributionBar 
                                key={item.symbol} 
                                label={item.symbol} 
                                value={attributionPeriod === 'Today' ? item.dailyPnL : item.pnl} 
                                maxVal={attributionData.maxVal} 
                                isPositive={false} 
                             />
                         )) : (
                             <p className="text-xs text-[#848e9c] italic py-4">Tuyệt vời! Không có mã giảm giá.</p>
                         )}
                     </div>
                 </div>
             </div>
        </div>

        {/* 3. SIDEBAR (Allocation & Risk) */}
        <div className="flex flex-col gap-6">
            {/* ALLOCATION: Stock */}
            <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-xl">
                 <h4 className="font-black text-xs text-[#848e9c] uppercase mb-6 tracking-widest border-b border-[#2b3139] pb-2">
                     Cơ cấu theo Cổ phiếu
                 </h4>
                 <DonutChart data={allocationByStock} colorMap={stockColors} title="Holdings" />
            </div>

            {/* ALLOCATION: Sector */}
            <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-xl">
                 <h4 className="font-black text-xs text-[#848e9c] uppercase mb-6 tracking-widest border-b border-[#2b3139] pb-2">
                     Cơ cấu theo Ngành
                 </h4>
                 <DonutChart data={allocationBySector} colorMap={sectorColors} title="Sector" />
            </div>

            {/* Risk Meter */}
            <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-xl text-center">
                <h4 className="text-xs font-bold text-[#848e9c] uppercase mb-4 tracking-widest">Rủi ro danh mục</h4>
                <RiskMeter level={riskLevel} />
                <p className="text-[10px] text-[#848e9c] mt-4 px-4">
                    Danh mục hiện tại đang ở mức rủi ro <span className="text-[#eaecef] font-bold">{riskLevel === 'Low' ? 'Thấp' : riskLevel === 'Medium' ? 'Trung bình' : 'Cao'}</span> dựa trên tỷ trọng cổ phiếu/tiền mặt.
                </p>
            </div>
        </div>
      </div>

      {/* 4. HOLDINGS TABLE */}
      <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#2b3139] bg-[#2b3139]/30 flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#848e9c]">Danh mục tài sản (Holdings)</h3>
            <div className="flex gap-2">
                <button 
                  onClick={() => onNavigate?.(MainView.HISTORY)} 
                  className="text-[10px] font-bold bg-[#2b3139] border border-[#474d57] px-3 py-1.5 rounded hover:text-[#f0b90b] transition-colors"
                >
                    <i className="bi bi-clock-history mr-1"></i> Lịch sử
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2b3139] text-[10px] font-black text-[#848e9c] uppercase tracking-widest">
              <tr>
                <th className="p-5">Mã tài sản</th>
                <th className="p-5 text-right">Khối lượng</th>
                <th className="p-5 text-right">Giá vốn / Hiện tại</th>
                <th className="p-5 text-right">Giá trị thị trường</th>
                <th className="p-5 text-right">Lãi/Lỗ (Unrealized)</th>
                <th className="p-5 w-32">Tỷ trọng NAV</th>
                <th className="p-5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {enrichedPositions.map((pos) => {
                 const weight = (pos.value / totalNAV) * 100;
                 return (
                    <tr key={pos.symbol} className="hover:bg-[#2b3139]/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#2b3139] flex items-center justify-center font-bold text-[10px] border border-[#474d57]">
                                {pos.symbol[0]}
                            </div>
                            <div>
                                <div className="font-black text-white group-hover:text-[#f0b90b] text-sm">{pos.symbol}</div>
                                <div className="text-[10px] text-[#848e9c]">{pos.name}</div>
                            </div>
                        </div>
                      </td>
                      <td className="p-5 text-right font-black font-mono text-sm">{pos.quantity.toLocaleString()}</td>
                      <td className="p-5 text-right font-mono text-xs">
                        <div className="text-[#848e9c]">{pos.avgPrice.toLocaleString()}</div>
                        <div className="font-bold text-[#eaecef]">{pos.currentPrice.toLocaleString()}</div>
                      </td>
                      <td className="p-5 text-right font-black text-[#eaecef] font-mono text-sm">{formatVND(pos.value)}</td>
                      <td className="p-5 text-right font-mono">
                        <div className={`font-black text-sm ${pos.pnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {pos.pnl >= 0 ? '+' : ''}{formatVND(pos.pnl)}
                        </div>
                        <div className={`text-[10px] font-bold ${pos.pnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {pos.pnlPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-5">
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span className="text-[#848e9c]">{weight.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#0b0e11] rounded-full overflow-hidden">
                              <div className="h-full bg-[#f0b90b]" style={{ width: `${weight}%` }}></div>
                          </div>
                      </td>
                      <td className="p-5 text-center">
                          <div className="flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => onNavigate?.(MainView.TRADING)} className="p-1.5 bg-[#0ecb81]/10 text-[#0ecb81] rounded hover:bg-[#0ecb81] hover:text-[#0b0e11] transition-all" title="Mua thêm"><i className="bi bi-plus-lg"></i></button>
                              <button onClick={() => onNavigate?.(MainView.TRADING)} className="p-1.5 bg-[#f6465d]/10 text-[#f6465d] rounded hover:bg-[#f6465d] hover:text-white transition-all" title="Bán"><i className="bi bi-dash-lg"></i></button>
                          </div>
                      </td>
                    </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Portfolio;
