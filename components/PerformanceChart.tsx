
import React, { useState, useRef, useEffect } from 'react';

export const PerformanceChart = ({ data, timeRange, showBenchmark }: { data: any[], timeRange: string, showBenchmark?: boolean }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = 300;
  const padding = 40;

  useEffect(() => {
    if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => containerRef.current && setWidth(containerRef.current.offsetWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (width === 0) return <div ref={containerRef} className="h-[300px] w-full bg-[#1e2329] animate-pulse rounded-xl"></div>;

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  // Scales
  const minVal = Math.min(...data.map(d => Math.min(d.portfolio, d.benchmark ?? d.portfolio))) * 0.98;
  const maxVal = Math.max(...data.map(d => Math.max(d.portfolio, d.benchmark ?? d.portfolio))) * 1.02;
  const range = maxVal - minVal;

  const getX = (index: number) => padding + (index / (data.length - 1)) * innerWidth;
  const getY = (val: number) => height - padding - ((val - minVal) / range) * innerHeight;

  // Path Generators
  const generatePath = (key: 'portfolio' | 'benchmark') => {
    return data.map((d, i) => 
      `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[key])}`
    ).join(' ');
  };

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];

  return (
    <div ref={containerRef} className="relative h-[300px] select-none" 
         onMouseLeave={() => setHoverIndex(null)}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => {
            const y = height - padding - t * innerHeight;
            const val = minVal + t * range;
            return (
                <g key={t}>
                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#2b3139" strokeDasharray="4 4" />
                    <text x={padding - 10} y={y + 4} fill="#848e9c" fontSize="10" textAnchor="end">{val.toFixed(1)}%</text>
                </g>
            );
        })}

        {/* Benchmark Line (VNINDEX) */}
        {showBenchmark && (
            <path d={generatePath('benchmark')} fill="none" stroke="#474d57" strokeWidth="2" opacity="0.6" />
        )}

        {/* Portfolio Line */}
        <path d={generatePath('portfolio')} fill="none" stroke="#f0b90b" strokeWidth="3" />
        
        {/* Area under Portfolio */}
        <path d={`${generatePath('portfolio')} L ${width-padding} ${height-padding} L ${padding} ${height-padding} Z`} fill="url(#gradientPortfolio)" opacity="0.2" />

        <defs>
            <linearGradient id="gradientPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0b90b" />
                <stop offset="100%" stopColor="#f0b90b" stopOpacity="0" />
            </linearGradient>
        </defs>

        {/* Interactive Layer */}
        {data.map((_, i) => (
            <rect 
                key={i} 
                x={getX(i) - (innerWidth / data.length / 2)} 
                y={0} 
                width={innerWidth / data.length} 
                height={height} 
                fill="transparent" 
                onMouseEnter={() => setHoverIndex(i)}
            />
        ))}

        {/* Active Tooltip Line */}
        {hoverIndex !== null && (
             <line x1={getX(hoverIndex)} y1={padding} x2={getX(hoverIndex)} y2={height - padding} stroke="#eaecef" strokeDasharray="2 2" opacity="0.5" />
        )}

        {/* Active Dots */}
        {hoverIndex !== null && (
            <>
                {showBenchmark && <circle cx={getX(hoverIndex)} cy={getY(data[hoverIndex].benchmark)} r="4" fill="#474d57" stroke="#0b0e11" strokeWidth="2" />}
                <circle cx={getX(hoverIndex)} cy={getY(data[hoverIndex].portfolio)} r="6" fill="#f0b90b" stroke="#0b0e11" strokeWidth="2" />
            </>
        )}
      </svg>

      {/* Floating Tooltip */}
      <div className="absolute top-0 right-0 bg-[#1e2329]/90 backdrop-blur border border-[#2b3139] p-3 rounded-lg shadow-xl text-xs z-10">
         <p className="text-[#848e9c] font-mono mb-2">{activePoint.date}</p>
         <div className="flex items-center justify-between gap-4 mb-1">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f0b90b]"></span> Portfolio</span>
            <span className={`font-bold ${activePoint.portfolio >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{activePoint.portfolio > 0 ? '+' : ''}{activePoint.portfolio.toFixed(2)}%</span>
         </div>
         {showBenchmark && (
             <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#474d57]"></span> VNINDEX</span>
                <span className={`font-bold ${activePoint.benchmark >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{activePoint.benchmark > 0 ? '+' : ''}{activePoint.benchmark.toFixed(2)}%</span>
             </div>
         )}
         {showBenchmark && (
             <div className="mt-2 pt-2 border-t border-[#474d57]/30 flex justify-between">
                 <span>Alpha</span>
                 <span className="text-[#f0b90b] font-bold">{(activePoint.portfolio - activePoint.benchmark) > 0 ? '+' : ''}{(activePoint.portfolio - activePoint.benchmark).toFixed(2)}%</span>
             </div>
         )}
      </div>
    </div>
  );
};
