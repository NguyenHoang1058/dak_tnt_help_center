
import React, { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../constants';

const WALLET_KEY = 'dak_tnt_wallet_v2';
const OPEN_ORDERS_KEY = 'dak_tnt_open_orders_v2';

// --- Types ---
interface TradeRecord {
  id: string;
  refId?: string;
  time: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  amount: number; // Total value
  fee: number;
  status: 'Filled';
  note: string;
}

interface OrderRecord {
  id: string;
  time: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET';
  price: number;
  quantity: number;
  filledQuantity: number;
  status: 'New' | 'Partially Filled' | 'Filled' | 'Canceled' | 'Rejected';
  averagePrice?: number;
}

type TabType = 'ORDERS' | 'TRADES';

const TransactionHistory: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<TabType>('ORDERS');
  
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const [orderRecords, setOrderRecords] = useState<OrderRecord[]>([]);
  
  const [selectedRecord, setSelectedRecord] = useState<TradeRecord | OrderRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [timeRange, setTimeRange] = useState<'Today' | '1W' | '1M' | '3M' | 'YTD' | 'All'>('1M');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [filterSide, setFilterSide] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL'); // Only for Orders
  const [searchQuery, setSearchQuery] = useState('');

  // --- Data Loading ---
  const loadData = () => {
    // 1. Load Trades (Lịch sử khớp)
    const savedWallet = localStorage.getItem(WALLET_KEY);
    let loadedTrades: TradeRecord[] = [];

    if (savedWallet) {
      const data = JSON.parse(savedWallet);
      loadedTrades = data.transactions
        .filter((tx: any) => tx.type === 'TRADE')
        .map((tx: any, idx: number) => {
            const parts = tx.note.split(' '); 
            const side = tx.note.includes('MUA') ? 'BUY' : 'SELL';
            const qty = parseInt(parts[3]) || 0;
            const symbol = parts[4] || 'UNKNOWN';
            const price = tx.amount / (qty || 1);
            const fee = tx.amount * 0.0015;

            return {
              id: `TRD-${Date.parse(tx.time)}-${idx}`,
              refId: `ORD-${Math.floor(Math.random() * 100000)}`,
              time: tx.time,
              symbol,
              side,
              quantity: qty,
              price: price,
              amount: tx.amount,
              fee: fee,
              status: 'Filled',
              note: tx.note
            };
        });
    }

    // Mock Trades if empty
    if (loadedTrades.length < 3) {
        const mockTrades: TradeRecord[] = [
           { id: 'TRD-MOCK-01', refId: 'ORD-9981', time: new Date().toISOString(), symbol: 'VCB', side: 'BUY', quantity: 50, price: 96096, amount: 4804800, fee: 7200, status: 'Filled', note: 'Khớp lệnh MUA 50 VCB' },
           { id: 'TRD-MOCK-02', refId: 'ORD-7721', time: new Date(Date.now() - 3600000).toISOString(), symbol: 'FPT', side: 'BUY', quantity: 100, price: 128500, amount: 12850000, fee: 19275, status: 'Filled', note: 'Khớp lệnh MUA 100 FPT' },
           { id: 'TRD-MOCK-03', refId: 'ORD-3321', time: new Date(Date.now() - 7200000).toISOString(), symbol: 'VNM', side: 'BUY', quantity: 150, price: 72400, amount: 10860000, fee: 16290, status: 'Filled', note: 'Khớp lệnh MUA 150 VNM' },
        ];
        loadedTrades = [...mockTrades, ...loadedTrades];
    }
    loadedTrades.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setTradeRecords(loadedTrades);

    // 2. Load/Mock Orders (Lịch sử đặt lệnh - Client Order History)
    // Since we don't have a real backend history for cancelled orders, we generate them based on trades + mock data
    
    // a. Convert Trades to Filled Orders
    const filledOrders: OrderRecord[] = loadedTrades.map(t => ({
        id: t.refId || `ORD-${t.id.split('-')[1]}`,
        time: t.time,
        symbol: t.symbol,
        side: t.side,
        type: 'LIMIT',
        price: t.price,
        quantity: t.quantity,
        filledQuantity: t.quantity,
        status: 'Filled',
        averagePrice: t.price
    }));

    // b. Mock Cancelled/New Orders
    const mockOrders: OrderRecord[] = [
        { id: 'ORD-CANCEL-1', time: new Date(Date.now() - 10000000).toISOString(), symbol: 'HPG', side: 'SELL', type: 'LIMIT', price: 29000, quantity: 1000, filledQuantity: 0, status: 'Canceled' },
        { id: 'ORD-OPEN-1', time: new Date().toISOString(), symbol: 'MWG', side: 'BUY', type: 'LIMIT', price: 47500, quantity: 500, filledQuantity: 0, status: 'New' },
        { id: 'ORD-PARTIAL-1', time: new Date(Date.now() - 5000000).toISOString(), symbol: 'TCB', side: 'BUY', type: 'MARKET', price: 0, quantity: 2000, filledQuantity: 500, status: 'Partially Filled', averagePrice: 34500 },
        { id: 'ORD-REJECT-1', time: new Date(Date.now() - 86400000).toISOString(), symbol: 'VNM', side: 'SELL', type: 'LIMIT', price: 75000, quantity: 100, filledQuantity: 0, status: 'Rejected' },
    ];

    // c. Merge and Sort Orders
    const allOrders = [...mockOrders, ...filledOrders].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setOrderRecords(allOrders);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('dak_sync', loadData);
    return () => window.removeEventListener('dak_sync', loadData);
  }, []);

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    let res: any[] = activeTab === 'TRADES' ? tradeRecords : orderRecords;

    // 1. Time Range
    const now = new Date();
    let startTime = new Date(0); 
    if (timeRange === 'Today') startTime = new Date(now.setHours(0,0,0,0));
    else if (timeRange === '1W') startTime = new Date(now.setDate(now.getDate() - 7));
    else if (timeRange === '1M') startTime = new Date(now.setMonth(now.getMonth() - 1));
    else if (timeRange === '3M') startTime = new Date(now.setMonth(now.getMonth() - 3));
    else if (timeRange === 'YTD') startTime = new Date(new Date().getFullYear(), 0, 1);
    
    res = res.filter(r => new Date(r.time) >= startTime);

    // 2. Symbol
    if (filterSymbol) {
        res = res.filter(r => r.symbol.toLowerCase().includes(filterSymbol.toLowerCase()));
    }

    // 3. Side
    if (filterSide !== 'ALL') {
        res = res.filter(r => r.side === filterSide);
    }

    // 4. Status (Orders Only)
    if (activeTab === 'ORDERS' && filterStatus !== 'ALL') {
        res = res.filter(r => r.status === filterStatus);
    }

    // 5. Text Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        res = res.filter(r => 
            r.id.toLowerCase().includes(q) || 
            (r.note && r.note.toLowerCase().includes(q))
        );
    }

    return res;
  }, [activeTab, tradeRecords, orderRecords, timeRange, filterSymbol, filterSide, filterStatus, searchQuery]);

  // --- Summary Calculation ---
  const summary = useMemo(() => {
    if (activeTab === 'TRADES') {
        const totalBuy = (filteredData as TradeRecord[]).filter(r => r.side === 'BUY').reduce((acc, r) => acc + r.amount, 0);
        const totalSell = (filteredData as TradeRecord[]).filter(r => r.side === 'SELL').reduce((acc, r) => acc + r.amount, 0);
        return { totalRecords: filteredData.length, label1: 'Giá trị Mua', val1: totalBuy, label2: 'Giá trị Bán', val2: totalSell };
    } else {
        const totalFilled = (filteredData as OrderRecord[]).filter(r => r.status === 'Filled').length;
        const totalOpen = (filteredData as OrderRecord[]).filter(r => r.status === 'New' || r.status === 'Partially Filled').length;
        return { totalRecords: filteredData.length, label1: 'Đã khớp', val1: totalFilled, label2: 'Đang chờ', val2: totalOpen };
    }
  }, [filteredData, activeTab]);


  // --- Helper Functions ---
  const formatVND = (num: number) => num.toLocaleString('vi-VN') + ' ₫';
  
  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedRecord(null), 300); 
  };

  return (
    <div className="relative h-full flex flex-col pb-10">
      
      {/* HEADER: Tab Navigation & Quick Stats */}
      <div className="mb-6 animate-in slide-in-from-top duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="flex gap-6 border-b border-[#2b3139] w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('ORDERS')}
                    className={`pb-3 text-lg font-black transition-all border-b-2 px-2 ${
                        activeTab === 'ORDERS' 
                        ? 'text-[#f0b90b] border-[#f0b90b]' 
                        : 'text-[#848e9c] border-transparent hover:text-[#eaecef]'
                    }`}
                >
                    Lịch sử đặt lệnh
                </button>
                <button 
                    onClick={() => setActiveTab('TRADES')}
                    className={`pb-3 text-lg font-black transition-all border-b-2 px-2 ${
                        activeTab === 'TRADES' 
                        ? 'text-[#f0b90b] border-[#f0b90b]' 
                        : 'text-[#848e9c] border-transparent hover:text-[#eaecef]'
                    }`}
                >
                    Lịch sử khớp lệnh
                </button>
            </div>
            
            <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-[#2b3139] hover:bg-[#474d57] rounded text-xs font-bold transition-colors">
                    <i className="bi bi-file-earmark-arrow-down mr-2"></i>Xuất Excel
                </button>
            </div>
        </div>

        {/* Dynamic Summary Dashboard */}
        <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-6 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
                <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-1">
                    {activeTab === 'TRADES' ? 'Tổng số khớp' : 'Tổng số lệnh đặt'}
                </p>
                <p className="text-xl font-black text-white">{summary.totalRecords}</p>
            </div>
            <div>
                <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-1">{summary.label1}</p>
                <p className="text-xl font-black text-[#0ecb81]">
                    {activeTab === 'TRADES' ? formatVND(summary.val1) : summary.val1}
                </p>
            </div>
             <div>
                <p className="text-[#848e9c] text-[10px] font-black uppercase tracking-widest mb-1">{summary.label2}</p>
                <p className="text-xl font-black text-[#f6465d]">
                     {activeTab === 'TRADES' ? formatVND(summary.val2) : summary.val2}
                </p>
            </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#1e2329] border border-[#2b3139] rounded-xl p-4 mb-4 shadow-md sticky top-[70px] z-20 space-y-4">
         <div className="flex flex-wrap items-center justify-between gap-4">
             <div className="flex bg-[#0b0e11] rounded-lg p-1 border border-[#2b3139]">
                {['Today', '1W', '1M', '3M', 'YTD', 'All'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTimeRange(t as any)}
                        className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                            timeRange === t ? 'bg-[#f0b90b] text-[#0b0e11]' : 'text-[#848e9c] hover:text-[#eaecef]'
                        }`}
                    >
                        {t}
                    </button>
                ))}
             </div>
             
             <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
                 {/* Status Filter for Orders Only */}
                 {activeTab === 'ORDERS' && (
                     <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#0b0e11] border border-[#2b3139] text-[#eaecef] text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-[#f0b90b]"
                     >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="Filled">Đã khớp (Filled)</option>
                        <option value="New">Đang chờ (New)</option>
                        <option value="Canceled">Đã hủy (Canceled)</option>
                        <option value="Partially Filled">Khớp một phần</option>
                     </select>
                 )}

                 <select 
                    value={filterSide}
                    onChange={(e) => setFilterSide(e.target.value as any)}
                    className="bg-[#0b0e11] border border-[#2b3139] text-[#eaecef] text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-[#f0b90b]"
                 >
                    <option value="ALL">Tất cả hướng</option>
                    <option value="BUY">Mua (Buy)</option>
                    <option value="SELL">Bán (Sell)</option>
                 </select>

                <div className="relative group">
                    <input 
                        type="text" 
                        placeholder="Lọc mã (VNM...)"
                        value={filterSymbol}
                        onChange={(e) => setFilterSymbol(e.target.value)}
                        className="bg-[#0b0e11] border border-[#2b3139] text-[#eaecef] text-xs font-bold rounded-lg px-3 py-2 w-28 outline-none focus:border-[#f0b90b] uppercase transition-all"
                    />
                </div>

                <div className="relative group">
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#848e9c]"></i>
                    <input 
                        type="text" 
                        placeholder="Tìm ID lệnh..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#0b0e11] border border-[#2b3139] text-[#eaecef] text-xs font-bold rounded-lg pl-9 pr-3 py-2 w-32 md:w-48 outline-none focus:border-[#f0b90b] transition-all"
                    />
                </div>
             </div>
         </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] overflow-hidden shadow-2xl flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0b0e11] text-[#848e9c] font-black text-[10px] uppercase tracking-widest sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 whitespace-nowrap">Thời gian</th>
                <th className="p-4 whitespace-nowrap">{activeTab === 'TRADES' ? 'Cặp/Mã' : 'Mã CP'}</th>
                {activeTab === 'ORDERS' && <th className="p-4 whitespace-nowrap">Loại lệnh</th>}
                <th className="p-4 whitespace-nowrap">Hướng</th>
                <th className="p-4 whitespace-nowrap text-right">{activeTab === 'TRADES' ? 'Giá khớp' : 'Giá đặt'}</th>
                <th className="p-4 whitespace-nowrap text-right">Số lượng</th>
                {activeTab === 'ORDERS' && <th className="p-4 whitespace-nowrap text-right">Đã khớp</th>}
                <th className="p-4 whitespace-nowrap text-right">{activeTab === 'TRADES' ? 'Tổng giá trị' : 'TB giá khớp'}</th>
                {activeTab === 'TRADES' && <th className="p-4 whitespace-nowrap text-right">Phí (Est.)</th>}
                <th className="p-4 whitespace-nowrap text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {filteredData.length > 0 ? filteredData.map((rec) => (
                <tr 
                    key={rec.id} 
                    onClick={() => handleRowClick(rec)}
                    className={`hover:bg-[#2b3139] transition-colors cursor-pointer group ${selectedRecord?.id === rec.id ? 'bg-[#2b3139] border-l-2 border-[#f0b90b]' : ''}`}
                >
                  <td className="p-4 text-[#848e9c] font-mono text-[11px] whitespace-nowrap">
                    {new Date(rec.time).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-4 font-black text-white text-xs">
                    {rec.symbol}
                  </td>
                  
                  {activeTab === 'ORDERS' && (
                     <td className="p-4 text-[#eaecef] text-xs font-bold">{(rec as OrderRecord).type}</td>
                  )}

                  <td className="p-4">
                     <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        rec.side === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'
                     }`}>
                        {rec.side === 'BUY' ? 'MUA' : 'BÁN'}
                     </span>
                  </td>

                  <td className="p-4 text-right font-mono text-[#eaecef] text-xs font-bold">
                    {rec.price === 0 && activeTab === 'ORDERS' ? 'Thị trường' : rec.price.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-mono text-[#eaecef] text-xs font-bold">
                    {rec.quantity.toLocaleString()}
                  </td>

                  {activeTab === 'ORDERS' && (
                     <td className="p-4 text-right font-mono text-[#eaecef] text-xs">
                         {(rec as OrderRecord).filledQuantity.toLocaleString()}
                     </td>
                  )}

                  <td className={`p-4 text-right font-mono text-xs ${activeTab === 'TRADES' ? 'font-black text-[#eaecef]' : 'text-[#848e9c]'}`}>
                    {activeTab === 'TRADES' 
                        ? formatVND((rec as TradeRecord).amount)
                        : (rec as OrderRecord).averagePrice ? (rec as OrderRecord).averagePrice?.toLocaleString() : '-'
                    }
                  </td>
                   
                  {activeTab === 'TRADES' && (
                     <td className="p-4 text-right font-mono text-[#848e9c] text-xs">
                        {(rec as TradeRecord).fee.toLocaleString()}
                     </td>
                  )}

                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-bold flex items-center justify-center gap-1 ${
                        rec.status === 'Filled' ? 'text-[#0ecb81]' :
                        rec.status === 'Canceled' || rec.status === 'Rejected' ? 'text-[#848e9c] line-through' :
                        'text-[#f0b90b]'
                    }`}>
                         {rec.status === 'Filled' ? <i className="bi bi-check-circle-fill"></i> : 
                          rec.status === 'New' ? <i className="bi bi-hourglass-split"></i> : 
                          <i className="bi bi-x-circle-fill"></i>} 
                         {rec.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={activeTab === 'ORDERS' ? 9 : 8} className="p-20 text-center">
                     <div className="flex flex-col items-center gap-3 text-[#474d57]">
                        <i className="bi bi-clipboard-x text-5xl opacity-50"></i>
                        <span className="text-sm font-bold">Không tìm thấy dữ liệu</span>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER */}
      {isDrawerOpen && selectedRecord && (
        <div className="fixed inset-0 z-[3000] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeDrawer}></div>
            
            <div className="relative w-full max-w-md h-full bg-[#1e2329] border-l border-[#2b3139] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                <div className="p-6 border-b border-[#2b3139] flex justify-between items-center bg-[#2b3139]/50">
                    <div>
                        <h2 className="text-xl font-black text-white">
                            {activeTab === 'TRADES' ? 'Chi tiết khớp lệnh' : 'Chi tiết lệnh đặt'}
                        </h2>
                        <p className="text-xs font-mono text-[#848e9c] mt-1">{selectedRecord.id}</p>
                    </div>
                    <button onClick={closeDrawer} className="w-8 h-8 rounded-full bg-[#2b3139] hover:bg-[#f6465d] hover:text-white transition-colors flex items-center justify-center">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="text-center space-y-2 mb-6">
                        <h3 className={`text-3xl font-black ${selectedRecord.side === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                             {selectedRecord.side === 'BUY' ? 'MUA' : 'BÁN'} {selectedRecord.symbol}
                        </h3>
                        <p className="text-[#848e9c] font-mono text-sm">{new Date(selectedRecord.time).toLocaleString('vi-VN')}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block mt-2 ${
                            selectedRecord.status === 'Filled' ? 'bg-[#0ecb81]/20 text-[#0ecb81]' : 
                            selectedRecord.status === 'New' ? 'bg-[#f0b90b]/20 text-[#f0b90b]' : 
                            'bg-[#848e9c]/20 text-[#848e9c]'
                        }`}>
                            {selectedRecord.status}
                        </span>
                    </div>

                    <div className="bg-[#0b0e11] rounded-xl p-5 border border-[#2b3139] space-y-4">
                        {'refId' in selectedRecord && selectedRecord.refId && (
                            <div className="flex justify-between items-center text-sm border-b border-[#2b3139]/50 pb-3">
                                <span className="text-[#848e9c]">Mã tham chiếu</span>
                                <span className="font-bold text-[#f0b90b] font-mono">{selectedRecord.refId}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#848e9c]">Giá {activeTab === 'TRADES' ? 'khớp' : 'đặt'}</span>
                            <span className="font-bold text-white font-mono">{selectedRecord.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#848e9c]">Khối lượng</span>
                            <span className="font-bold text-white font-mono">{selectedRecord.quantity.toLocaleString()}</span>
                        </div>
                        
                        {activeTab === 'TRADES' ? (
                            <>
                                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#2b3139]/50">
                                    <span className="text-[#848e9c]">Tổng giá trị</span>
                                    <span className="font-black text-[#eaecef] font-mono">{formatVND((selectedRecord as TradeRecord).amount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-[#848e9c]">Phí giao dịch</span>
                                    <span className="text-[#848e9c] font-mono">{formatVND((selectedRecord as TradeRecord).fee)}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#848e9c]">Đã khớp</span>
                                    <span className="font-bold text-[#f0b90b] font-mono">{(selectedRecord as OrderRecord).filledQuantity.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#848e9c]">Loại lệnh</span>
                                    <span className="font-bold text-white">{(selectedRecord as OrderRecord).type}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {'note' in selectedRecord && (selectedRecord as TradeRecord).note && (
                        <div className="bg-[#2b3139]/20 p-4 rounded-lg">
                            <p className="text-xs text-[#848e9c] font-bold uppercase mb-2">Ghi chú hệ thống</p>
                            <p className="text-sm text-[#eaecef]">{(selectedRecord as TradeRecord).note}</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#2b3139] bg-[#0b0e11]">
                    <button onClick={closeDrawer} className="w-full py-3 bg-[#2b3139] text-[#eaecef] font-bold rounded-lg hover:bg-[#474d57] transition-all">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
