
import React, { useState, useMemo } from 'react';
import { COLORS } from '../constants';

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'1M' | '3M' | '6M' | 'YTD'>('1M');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Mock Raw Data for Cumulative calculation
  const rawData = [
    { date: '2024-04-01', nav: 26200000, index: 1180 },
    { date: '2024-04-08', nav: 26800000, index: 1185 },
    { date: '2024-04-15', nav: 27800000, index: 1175 },
    { date: '2024-04-22', nav: 28100000, index: 1190 },
    { date: '2024-05-01', nav: 28500000, index: 1210 },
    { date: '2024-05-08', nav: 29900000, index: 1225 },
    { date: '2024-05-15', nav: 30800000, index: 1235 },
    { date: '2024-05-18', nav: 31235000, index: 1245 },
  ];

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

  const renderCumulativeLineChart = () => {
    const width = 800;
    const height = 200;
    const padding = 30;
    
    const allValues = [...performanceData.map(d => d.portfolio), ...performanceData.map(d => d.index)];
    const maxVal = Math.max(...allValues, 2);
    const minVal = Math.min(...allValues, -1);
    const range = maxVal - minVal;

    const getX = (i: number) => (i / (performanceData.length - 1)) * (width - padding * 2) + padding;
    const getY = (val: number) => (height - padding) - ((val - minVal) / (range || 1)) * (height - padding * 2);

    const portfolioPoints = performanceData.map((d, i) => `${getX(i)},${getY(d.portfolio)}`).join(' ');
    const indexPoints = performanceData.map((d, i) => `${getX(i)},${getY(d.index)}`).join(' ');

    return (
      <div className="relative w-full h-full">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Y-Axis Grid Lines */}
          {[0, 0.5, 1].map((p, i) => {
            const val = minVal + p * range;
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#2b3139" strokeWidth="1" strokeDasharray="4 4" />
                <text x={padding - 5} y={y + 4} fill="#848e9c" fontSize="10" textAnchor="end">{val.toFixed(1)}%</text>
              </g>
            );
          })}

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

          {/* Interactive Points */}
          {performanceData.map((d, i) => (
            <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)}>
              <rect x={getX(i) - 15} y={0} width={30} height={height} fill="transparent" className="cursor-crosshair" />
              {hoveredPoint === i && (
                <g>
                  <line x1={getX(i)} y1={padding} x2={getX(i)} y2={height - padding} stroke="#f0b90b" strokeWidth="1" strokeDasharray="2 2" />
                  <circle cx={getX(i)} cy={getY(d.portfolio)} r="6" fill="#f0b90b" />
                  <foreignObject x={getX(i) > width / 2 ? getX(i) - 130 : getX(i) + 10} y={getY(d.portfolio) - 50} width="120" height="80">
                    <div className="bg-[#1e2329] border border-[#f0b90b] rounded p-2 text-[9px] shadow-2xl">
                      <p className="font-bold border-b border-[#2b3139] mb-1 pb-1">{d.date}</p>
                      <p className="text-[#0ecb81]">Tôi: +{d.portfolio.toFixed(2)}%</p>
                      <p className="text-[#848e9c]">Index: +{d.index.toFixed(2)}%</p>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Tổng tài sản', value: '₫31,235,000', change: '+14.3%', pos: true },
          { label: 'Lợi nhuận hôm nay', value: '₫325,000', change: '+1.05%', pos: true },
          { label: 'Số dư khả dụng', value: '₫9,500,000', change: 'Mô phỏng', pos: true },
          { label: 'Giá trị đầu tư', value: '₫21,735,000', change: '+18.2%', pos: true },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1e2329] p-6 rounded-xl border border-[#2b3139] hover:border-[#f0b90b] transition-all group">
            <p className="text-[#848e9c] text-xs font-bold uppercase mb-2 tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black mb-1 group-hover:text-white transition-colors">{stat.value}</h3>
            <div className="flex items-center gap-1">
               <span className={`text-xs font-bold ${stat.pos ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{stat.change}</span>
               <i className={`bi ${stat.pos ? 'bi-caret-up-fill' : 'bi-caret-down-fill'} text-[10px] ${stat.pos ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 flex flex-col shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h4 className="text-lg font-bold flex items-center gap-2">
                <i className="bi bi-graph-up text-[#f0b90b]"></i>
                Hiệu suất danh mục tích lũy (%)
              </h4>
              <p className="text-[10px] text-[#848e9c] uppercase font-bold tracking-widest mt-1">Lợi nhuận thực tế vs VN-Index</p>
            </div>
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
          
          <div className="flex-1 min-h-[220px]">
            {renderCumulativeLineChart()}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#2b3139] text-center">
            <div>
              <p className="text-[10px] text-[#848e9c] uppercase font-bold mb-1">Cá nhân</p>
              <p className="text-lg font-black text-[#0ecb81]">+{lastPoint.portfolio.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-[#848e9c] uppercase font-bold mb-1">VN-Index</p>
              <p className="text-lg font-black text-[#848e9c]">+{lastPoint.index.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-[#848e9c] uppercase font-bold mb-1">Alpha</p>
              <p className="text-lg font-black text-[#f0b90b]">+{lastPoint.alpha.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] p-6 shadow-xl flex flex-col">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="bi bi-lightning-charge-fill text-[#f0b90b]"></i>
            Hoạt động gần đây
          </h4>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {[
              { label: 'Mua VNM', detail: '100 CP • 72,400', time: '2h trước', type: 'buy', amount: '₫7,240k' },
              { label: 'Bán FPT', detail: '50 CP • 128,500', time: '5h trước', type: 'sell', amount: '₫6,425k' },
              { label: 'Nạp tiền', detail: 'Vốn mô phỏng', time: 'Hôm qua', type: 'deposit', amount: '₫5,000k' },
              { label: 'Mua HPG', detail: '200 CP • 28,150', time: '2 ngày trước', type: 'buy', amount: '₫5,630k' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[#0b0e11]/30 border border-[#2b3139]/50 hover:border-[#f0b90b]/30 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'buy' ? 'bg-[#0ecb81]/10 text-[#0ecb81]' : 
                  activity.type === 'sell' ? 'bg-[#f6465d]/10 text-[#f6465d]' : 
                  'bg-[#f0b90b]/10 text-[#f0b90b]'
                }`}>
                  <i className={`bi ${
                    activity.type === 'buy' ? 'bi-arrow-down-left' : 
                    activity.type === 'sell' ? 'bi-arrow-up-right' : 
                    'bi-plus-lg'
                  }`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[#eaecef] truncate group-hover:text-[#f0b90b] transition-colors">{activity.label}</p>
                  <p className="text-[10px] text-[#848e9c] truncate">{activity.detail} • {activity.time}</p>
                </div>
                <p className="font-black text-xs text-[#eaecef] whitespace-nowrap">{activity.amount}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 border border-[#2b3139] text-[#848e9c] text-xs font-bold rounded-xl hover:bg-[#2b3139] hover:text-white transition-all">
             Xem tất cả lịch sử
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
