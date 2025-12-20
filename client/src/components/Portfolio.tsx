
import React, { useState, useMemo } from 'react';
import { PortfolioPosition, EquityPoint } from '../../types';
import { COLORS, ICONS } from '../../constants';

const Portfolio: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<PortfolioPosition | null>(null);
  const [timeFilter, setTimeFilter] = useState<'1M' | '3M' | '6M' | 'YTD'>('3M');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const mockPositions: PortfolioPosition[] = [
    { symbol: 'VNM', name: 'Sữa Việt Nam', quantity: 150, avgPrice: 68500, currentPrice: 72400, pnl: 585000, pnlPercent: 5.69, value: 10860000, weight: 35.5, sector: 'Tiêu dùng' },
    { symbol: 'FPT', name: 'FPT Corp', quantity: 100, avgPrice: 115000, currentPrice: 128500, pnl: 1350000, pnlPercent: 11.74, value: 12850000, weight: 42.1, sector: 'Công nghệ' },
    { symbol: 'VCB', name: 'Vietcombank', quantity: 50, avgPrice: 96000, currentPrice: 94200, pnl: -90000, pnlPercent: -1.87, value: 4710000, weight: 15.4, sector: 'Ngân hàng' },
    { symbol: 'HPG', name: 'Hòa Phát', quantity: 100, avgPrice: 27500, currentPrice: 28150, pnl: 65000, pnlPercent: 2.36, value: 2815000, weight: 7.0, sector: 'Thép' },
  ];

  // Mock Raw Data for Cumulative calculation
  // In real app, this would be fetched based on timeFilter
  const rawData = [
    { date: '2024-03-01', nav: 25000000, index: 1150 },
    { date: '2024-03-15', nav: 25500000, index: 1165 },
    { date: '2024-04-01', nav: 26200000, index: 1180 },
    { date: '2024-04-15', nav: 27800000, index: 1175 },
    { date: '2024-05-01', nav: 28500000, index: 1210 },
    { date: '2024-05-10', nav: 29900000, index: 1225 },
    { date: '2024-05-18', nav: 31235000, index: 1245 },
  ];

  // Derived equity data for charts
  const equityData = rawData.map(d => ({ date: d.date, value: d.nav }));

  // Calculate Cumulative Returns based on the first point in the series
  const performanceData = useMemo(() => {
    const baseNav = rawData[0].nav;
    const baseIndex = rawData[0].index;

    return rawData.map(d => {
      const pReturn = ((d.nav / baseNav) - 1) * 100;
      const iReturn = ((d.index / baseIndex) - 1) * 100;
      return {
        date: d.date,
        portfolio: pReturn,
        index: iReturn,
        alpha: pReturn - iReturn
      };
    });
  }, [timeFilter]);

  const lastPoint = performanceData[performanceData.length - 1];

  const performanceStats = {
    winRate: 68.5,
    totalTrades: 42,
    profitFactor: 2.4,
    avgProfit: 850000,
    avgLoss: 350000,
  };

  const totalValue = mockPositions.reduce((sum, p) => sum + p.value, 0);
  const totalPnl = mockPositions.reduce((sum, p) => sum + p.pnl, 0);
  const avgPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const renderCumulativeChart = () => {
    const width = 800;
    const height = 220;
    const padding = 40;
    
    const allValues = [...performanceData.map(d => d.portfolio), ...performanceData.map(d => d.index)];
    const maxVal = Math.max(...allValues, 5);
    const minVal = Math.min(...allValues, -2);
    const range = maxVal - minVal;

    const getX = (i: number) => (i / (performanceData.length - 1)) * (width - padding * 2) + padding;
    const getY = (val: number) => (height - padding) - ((val - minVal) / range) * (height - padding * 2);

    const portfolioPoints = performanceData.map((d, i) => `${getX(i)},${getY(d.portfolio)}`).join(' ');
    const indexPoints = performanceData.map((d, i) => `${getX(i)},${getY(d.index)}`).join(' ');

    return (
      <div className="relative w-full h-full">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible group/svg">
          {/* Y-Axis Labels & Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
            const val = minVal + p * range;
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4" />
                <text x={padding - 5} y={y + 4} fill="#848e9c" fontSize="10" textAnchor="end">{val.toFixed(1)}%</text>
              </g>
            );
          })}

          {/* Zero Line */}
          {minVal < 0 && maxVal > 0 && (
            <line x1={padding} y1={getY(0)} x2={width - padding} y2={getY(0)} stroke="#474d57" strokeWidth="1" opacity="0.5" />
          )}

          {/* VN-Index Line (Benchmark) */}
          <polyline
            fill="none"
            stroke="#474d57"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={indexPoints}
            className="transition-all duration-500"
          />
          
          {/* Portfolio Line (Main) */}
          <polyline
            fill="none"
            stroke="#f0b90b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={portfolioPoints}
            className="transition-all duration-500"
          />

          {/* Hover Guides & Interactive Points */}
          {performanceData.map((d, i) => (
            <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
              {/* Invisible touch target */}
              <rect 
                x={getX(i) - 20} y={0} width={40} height={height} 
                fill="transparent" className="cursor-crosshair"
              />
              {/* Portfolio Marker */}
              <circle cx={getX(i)} cy={getY(d.portfolio)} r={hoveredPoint === i ? "6" : "4"} fill="#f0b90b" className="transition-all" />
              
              {/* Tooltip on Hover */}
              {hoveredPoint === i && (
                <g className="pointer-events-none">
                  <line x1={getX(i)} y1={padding} x2={getX(i)} y2={height - padding} stroke="#f0b90b" strokeWidth="1" strokeDasharray="2 2" />
                  <foreignObject x={getX(i) > width / 2 ? getX(i) - 160 : getX(i) + 10} y={getY(d.portfolio) - 40} width="150" height="100">
                    <div className="bg-[#1e2329] border border-[#f0b90b] rounded p-2 shadow-2xl text-[10px]">
                      <p className="font-bold text-[#f0b90b] mb-1 border-b border-[#2b3139] pb-1">{d.date}</p>
                      <div className="flex justify-between"><span>Danh mục:</span> <span className="text-[#0ecb81]">+{d.portfolio.toFixed(2)}%</span></div>
                      <div className="flex justify-between"><span>VN-Index:</span> <span className="text-[#848e9c]">+{d.index.toFixed(2)}%</span></div>
                      <div className="flex justify-between font-bold pt-1 border-t border-[#2b3139] mt-1"><span>Alpha:</span> <span className="text-[#f0b90b]">+{d.alpha.toFixed(2)}%</span></div>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          ))}

          {/* X-Axis Dates */}
          <text x={padding} y={height - 5} fill="#848e9c" fontSize="10">{performanceData[0].date}</text>
          <text x={width - padding} y={height - 5} fill="#848e9c" fontSize="10" textAnchor="end">Hôm nay</text>
        </svg>
      </div>
    );
  };

  const renderEquityChart = () => {
    const maxVal = Math.max(...equityData.map(d => d.value));
    const minVal = Math.min(...equityData.map(d => d.value));
    const range = maxVal - minVal;
    const width = 400;
    const height = 100;

    const points = equityData.map((d, i) => {
      const x = (i / (equityData.length - 1)) * width;
      const y = height - ((d.value - minVal) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="120" viewBox={`0 0 ${width} ${height + 20}`} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.yellow} stopOpacity="0.4" />
            <stop offset="100%" stopColor={COLORS.yellow} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={COLORS.yellow}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <path
          d={`M0,${height} ${points} V${height} H0 Z`}
          fill="url(#chartGradient)"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Portfolio Header Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e2329] border border-[#2b3139] rounded-2xl p-8 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <p className="text-[#848e9c] text-sm font-medium uppercase tracking-wider">Tổng giá trị tài sản mô phỏng</p>
              <h2 className="text-4xl font-black text-white">{formatVND(totalValue)}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${totalPnl >= 0 ? 'bg-[#0ecb81]/20 text-[#0ecb81]' : 'bg-[#f6465d]/20 text-[#f6465d]'}`}>
                  {totalPnl >= 0 ? '+' : ''}{formatVND(totalPnl)} ({avgPnlPercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-[#848e9c]">Tổng lãi/lỗ</span>
              </div>
            </div>
            <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-[#848e9c]">Mức độ rủi ro</span>
                    <span className="text-[#f0b90b] font-bold">TRUNG BÌNH</span>
                </div>
                <div className="w-full h-2 bg-[#2b3139] rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0ecb81] via-[#f0b90b] to-[#f6465d] w-full h-full opacity-20"></div>
                    <div className="absolute top-0 bottom-0 w-1 bg-white left-[45%] shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                </div>
                <p className="text-[10px] text-[#848e9c] italic">"Danh mục của bạn đang cân bằng tốt giữa tăng trưởng và an toàn."</p>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <i className="bi bi-pie-chart-fill text-9xl"></i>
          </div>
        </div>

        <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-[#848e9c] uppercase mb-4">Biến động 7 ngày</h4>
          {renderEquityChart()}
          <div className="flex justify-between text-[10px] text-[#848e9c] mt-2">
            <span>{equityData[0].date}</span>
            <span>Hôm nay</span>
          </div>
        </div>
      </div>

      {/* Trading Performance Section */}
      <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <i className="bi bi-graph-up-arrow text-[#f0b90b] text-xl"></i>
              <h3 className="text-lg font-bold">Hiệu suất lợi nhuận tích lũy (%)</h3>
            </div>
            <p className="text-[10px] text-[#848e9c] uppercase font-bold tracking-widest">So sánh với Benchmark VN-Index</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             {/* Legend */}
             <div className="flex gap-4 mr-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[#f0b90b]"></div>
                  <span className="text-[9px] text-[#848e9c] font-bold uppercase">Danh mục của tôi</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[#474d57]"></div>
                  <span className="text-[9px] text-[#848e9c] font-bold uppercase">VN-Index</span>
               </div>
             </div>
             {/* Filters */}
             <div className="flex bg-[#0b0e11] rounded-lg p-1 border border-[#2b3139]">
                {['1M', '3M', '6M', 'YTD'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setTimeFilter(f as any)}
                    className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${timeFilter === f ? 'bg-[#2b3139] text-[#f0b90b]' : 'text-[#848e9c] hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Win Rate Circle */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#2b3139" strokeWidth="12" fill="transparent" />
                <circle cx="64" cy="64" r="56" stroke="#0ecb81" strokeWidth="12" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 56} 
                        strokeDashoffset={2 * Math.PI * 56 * (1 - performanceStats.winRate / 100)} 
                        strokeLinecap="round" />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black block">{performanceStats.winRate}%</span>
                <span className="text-[9px] text-[#848e9c] uppercase font-bold tracking-widest">Win Rate</span>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-2 px-2">
              <div className="bg-[#0b0e11]/30 p-2 rounded-lg border border-[#2b3139] text-center">
                <p className="text-[8px] text-[#848e9c] uppercase mb-1">Profit Factor</p>
                <p className="text-xs font-black text-[#f0b90b]">{performanceStats.profitFactor}</p>
              </div>
              <div className="bg-[#0b0e11]/30 p-2 rounded-lg border border-[#2b3139] text-center">
                <p className="text-[8px] text-[#848e9c] uppercase mb-1">Tổng lệnh</p>
                <p className="text-xs font-black">{performanceStats.totalTrades}</p>
              </div>
            </div>
          </div>

          {/* Line Chart Area */}
          <div className="lg:col-span-2 bg-[#0b0e11]/20 rounded-2xl p-4 border border-[#2b3139]/50 min-h-[250px] flex flex-col justify-between overflow-hidden">
             <div className="flex-1 min-h-[180px]">
                {renderCumulativeChart()}
             </div>
             <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#2b3139]/50 text-center">
                <div>
                   <p className="text-[9px] text-[#848e9c] uppercase font-bold mb-1">Lợi nhuận tích lũy</p>
                   <p className={`text-lg font-black ${lastPoint.portfolio >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {lastPoint.portfolio >= 0 ? '+' : ''}{lastPoint.portfolio.toFixed(2)}%
                   </p>
                </div>
                <div>
                   <p className="text-[9px] text-[#848e9c] uppercase font-bold mb-1">VN-Index</p>
                   <p className="text-lg font-black text-[#848e9c]">+{lastPoint.index.toFixed(2)}%</p>
                </div>
                <div>
                   <p className="text-[9px] text-[#848e9c] uppercase font-bold mb-1">Chênh lệch Alpha</p>
                   <p className="text-lg font-black text-[#f0b90b]">+{lastPoint.alpha.toFixed(2)}%</p>
                </div>
             </div>
          </div>

          {/* Average Gains/Losses & Insight */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-[#0ecb81]/5 rounded-xl border border-[#0ecb81]/10 flex justify-between items-center hover:bg-[#0ecb81]/10 transition-all">
                <div>
                  <p className="text-[10px] text-[#0ecb81] font-bold uppercase mb-1">Lợi nhuận TB</p>
                  <p className="text-sm font-bold">{formatVND(performanceStats.avgProfit)}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#0ecb81]/20 flex items-center justify-center text-[#0ecb81]">
                  <i className="bi bi-caret-up-fill"></i>
                </div>
              </div>
              <div className="p-4 bg-[#f6465d]/5 rounded-xl border border-[#f6465d]/10 flex justify-between items-center hover:bg-[#f6465d]/10 transition-all">
                <div>
                  <p className="text-[10px] text-[#f6465d] font-bold uppercase mb-1">Thua lỗ TB</p>
                  <p className="text-sm font-bold">{formatVND(performanceStats.avgLoss)}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f6465d]/20 flex items-center justify-center text-[#f6465d]">
                  <i className="bi bi-caret-down-fill"></i>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#f0b90b]/10 to-transparent p-4 rounded-xl border border-[#f0b90b]/20">
              <div className="flex items-center gap-2 text-[#f0b90b] mb-2">
                <i className="bi bi-stars"></i>
                <span className="text-[9px] font-bold uppercase tracking-widest">AI Performance Insight</span>
              </div>
              <p className="text-[10px] text-[#eaecef] leading-relaxed italic">
                "Khả năng tạo Alpha của bạn trong {timeFilter} là rất ấn tượng (+{lastPoint.alpha.toFixed(1)}%). 
                Điều này chủ yếu đến từ việc nắm giữ FPT (+11.7%) bất chấp biến động VN-Index."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Holdings vs Allocation */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left: Holdings List */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-[#2b3139] flex justify-between items-center bg-[#2b3139]/30">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <i className="bi bi-collection-fill text-[#f0b90b]"></i>
                Vị thế đang nắm giữ
              </h3>
              <div className="flex gap-2">
                 <button className="px-3 py-1 bg-[#2b3139] text-xs font-bold rounded-lg border border-[#474d57] hover:border-[#f0b90b] transition-all">Tất cả</button>
                 <button className="px-3 py-1 text-xs text-[#848e9c] hover:text-white font-medium">Đang lãi</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#2b3139]/50 text-[#848e9c] text-xs font-bold uppercase">
                  <tr>
                    <th className="p-4">Mã CP</th>
                    <th className="p-4">Giá vốn / Hiện tại</th>
                    <th className="p-4">Khối lượng</th>
                    <th className="p-4">Giá trị / Tỷ trọng</th>
                    <th className="p-4">Lãi/Lỗ</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b3139]">
                  {mockPositions.map((pos) => (
                    <tr key={pos.symbol} className="hover:bg-[#2b3139]/30 transition-colors cursor-pointer group" onClick={() => setSelectedPosition(pos)}>
                      <td className="p-4">
                        <div className="font-bold text-white group-hover:text-[#f0b90b] transition-colors">{pos.symbol}</div>
                        <div className="text-[10px] text-[#848e9c]">{pos.name}</div>
                      </td>
                      <td className="p-4 font-mono text-sm">
                        <div className="text-[#848e9c] line-through decoration-[#f6465d]/50 decoration-1">{pos.avgPrice.toLocaleString()}</div>
                        <div className="font-bold text-[#eaecef]">{pos.currentPrice.toLocaleString()}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#eaecef]">{pos.quantity.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-[#eaecef]">{formatVND(pos.value)}</div>
                        <div className="w-16 h-1 bg-[#2b3139] rounded-full mt-1.5 overflow-hidden">
                           <div className="bg-[#f0b90b] h-full" style={{ width: `${pos.weight}%` }}></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`font-bold text-sm ${pos.pnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {pos.pnl >= 0 ? '+' : ''}{formatVND(pos.pnl)}
                        </div>
                        <div className={`text-[11px] font-bold ${pos.pnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {pos.pnl >= 0 ? '▲' : '▼'} {pos.pnlPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 rounded-full hover:bg-[#2b3139] text-[#848e9c] hover:text-[#f0b90b] transition-all">
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Diversification & Risk */}
        <div className="space-y-6">
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl p-6 shadow-xl">
            <h4 className="text-xs font-bold text-[#848e9c] uppercase mb-6 tracking-widest border-b border-[#2b3139] pb-2">Phân bổ ngành</h4>
            <div className="space-y-5">
              {[
                { label: 'Công nghệ', value: 42.1, color: '#3b82f6' },
                { label: 'Tiêu dùng', value: 35.5, color: '#f0b90b' },
                { label: 'Ngân hàng', value: 15.4, color: '#0ecb81' },
                { label: 'Thép', value: 7.0, color: '#f6465d' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#eaecef]">{item.label}</span>
                    <span style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#2b3139] rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#f0b90b]/10 to-transparent border border-[#f0b90b]/20 rounded-2xl p-6 shadow-lg">
             <div className="flex items-center gap-2 text-[#f0b90b] mb-4">
                <i className="bi bi-shield-lock-fill"></i>
                <h4 className="text-xs font-bold uppercase tracking-wider">Risk Analysis</h4>
             </div>
             <div className="space-y-4">
                <div className="flex gap-3 items-start">
                   <div className="w-2 h-2 rounded-full bg-[#0ecb81] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(14,203,129,0.5)]"></div>
                   <p className="text-[11px] text-[#848e9c] leading-snug">Độ phân tán ổn định: Bạn đang phân bổ vốn trên {mockPositions.length} ngành kinh tế mũi nhọn.</p>
                </div>
                <div className="flex gap-3 items-start">
                   <div className="w-2 h-2 rounded-full bg-[#f6465d] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(246,70,93,0.5)]"></div>
                   <p className="text-[11px] text-[#848e9c] leading-snug">Cảnh báo: Concentration Risk ở cổ phiếu FPT (42.1%) đang cao hơn mức khuyến nghị 30%.</p>
                </div>
             </div>
             <button className="w-full mt-6 py-3 bg-[#f0b90b] text-[#0b0e11] text-xs font-black rounded-xl hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#f0b90b]/10">
                TỐI ƯU DANH MỤC VỚI AI
             </button>
          </div>
        </div>
      </div>

      {/* Position Detail Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-[#2b3139] flex justify-between items-center bg-[#2b3139]/30">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-[#f0b90b] text-[#0b0e11] flex items-center justify-center font-black text-xl shadow-lg shadow-[#f0b90b]/10">
                    {selectedPosition.symbol[0]}
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-[#eaecef]">{selectedPosition.symbol}</h3>
                    <p className="text-sm text-[#848e9c] font-medium">{selectedPosition.name}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedPosition(null)} className="p-2 hover:bg-[#2b3139] rounded-full transition-colors text-[#848e9c] hover:text-white">
                <ICONS.Close />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                    <p className="text-xs text-[#848e9c] uppercase font-bold mb-3 tracking-widest">Position Summary</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0b0e11] p-4 rounded-xl border border-[#2b3139] hover:border-[#f0b90b]/30 transition-all">
                            <p className="text-[9px] text-[#848e9c] font-bold uppercase mb-1">Giá vốn TB</p>
                            <p className="font-black font-mono text-sm">{selectedPosition.avgPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0b0e11] p-4 rounded-xl border border-[#2b3139] hover:border-[#f0b90b]/30 transition-all">
                            <p className="text-[9px] text-[#848e9c] font-bold uppercase mb-1">Giá hiện tại</p>
                            <p className="font-black font-mono text-sm text-[#0ecb81]">{selectedPosition.currentPrice.toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0b0e11] p-4 rounded-xl border border-[#2b3139] hover:border-[#f0b90b]/30 transition-all">
                            <p className="text-[9px] text-[#848e9c] font-bold uppercase mb-1">Khối lượng</p>
                            <p className="font-black font-mono text-sm">{selectedPosition.quantity.toLocaleString()}</p>
                        </div>
                        <div className="bg-[#0b0e11] p-4 rounded-xl border border-[#2b3139] hover:border-[#f0b90b]/30 transition-all">
                            <p className="text-[9px] text-[#848e9c] font-bold uppercase mb-1">Tỷ trọng NAV</p>
                            <p className="font-black font-mono text-sm text-[#f0b90b]">{selectedPosition.weight}%</p>
                        </div>
                    </div>
                  </div>

                  <div className="bg-[#0b0e11] p-6 rounded-2xl border border-[#2b3139] space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-[#848e9c] font-medium">Lãi/Lỗ tạm tính</span>
                        <span className={`text-lg font-black ${selectedPosition.pnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                            {selectedPosition.pnl >= 0 ? '+' : ''}{formatVND(selectedPosition.pnl)}
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-[#848e9c] font-medium">Hiệu suất (%)</span>
                        <div className={`px-2 py-0.5 rounded-lg text-xs font-black ${selectedPosition.pnl >= 0 ? 'bg-[#0ecb81]/20 text-[#0ecb81]' : 'bg-[#f6465d]/20 text-[#f6465d]'}`}>
                            {selectedPosition.pnl >= 0 ? '▲' : '▼'} {selectedPosition.pnlPercent}%
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                     <p className="text-xs text-[#848e9c] uppercase font-bold mb-3 tracking-widest">Giao dịch nhanh</p>
                     <button className="w-full py-4 bg-[#0ecb81] text-[#0b0e11] rounded-2xl font-black hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-[#0ecb81]/10">
                        <i className="bi bi-cart-plus-fill text-xl"></i> MUA THÊM
                     </button>
                     <button className="w-full py-4 bg-[#f6465d] text-white rounded-2xl font-black hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-[#f6465d]/10">
                        <i className="bi bi-cart-dash-fill text-xl"></i> BÁN BỚT
                     </button>
                     <button className="w-full py-4 border border-[#2b3139] text-[#eaecef] rounded-2xl font-bold hover:bg-[#2b3139] transition-all flex items-center justify-center gap-3">
                        <i className="bi bi-bell-fill text-[#f0b90b]"></i> CẢNH BÁO GIÁ
                     </button>
                  </div>
               </div>
            </div>
            
            <div className="p-8 bg-[#0b0e11]/50 border-t border-[#2b3139] text-center">
                <p className="text-[10px] text-[#848e9c] flex items-center justify-center gap-2">
                    <i className="bi bi-info-circle text-[#f0b90b]"></i>
                    Dữ liệu cập nhật dựa trên giá đóng cửa HOSE ngày {new Date().toLocaleDateString('vi-VN')}.
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
