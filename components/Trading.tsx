
import React, { useState, useEffect } from 'react';
import { OrderSide, OrderType, Order } from '../types';

const WALLET_KEY = 'dak_tnt_wallet_v2';
const PORTFOLIO_KEY = 'dak_tnt_portfolio_v2';
const OPEN_ORDERS_KEY = 'dak_tnt_open_orders_v2';

const Trading: React.FC = () => {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [symbol, setSymbol] = useState('VNM');
  const [price, setPrice] = useState('72400');
  const [quantity, setQuantity] = useState('100');
  const [showSymbols, setShowSymbols] = useState(false);
  const [availableCash, setAvailableCash] = useState(0);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'HISTORY'>('OPEN');

  // Modal State
  const [activeModal, setActiveModal] = useState<'EDIT' | 'CANCEL' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  const symbols = [
    { name: 'VNM', fullName: 'Vinamilk', price: 72400, change: '+1.19%', high: 73500, low: 71200, vol: '2.5M' },
    { name: 'FPT', fullName: 'FPT Corp', price: 128500, change: '+2.85%', high: 129000, low: 124500, vol: '1.2M' },
    { name: 'VCB', fullName: 'Vietcombank', price: 94200, change: '-0.42%', high: 95500, low: 93800, vol: '0.8M' },
    { name: 'HPG', fullName: 'Hoa Phat Group', price: 28150, change: '+0.10%', high: 28500, low: 27900, vol: '15.4M' },
    { name: 'MWG', fullName: 'Mobile World', price: 48200, change: '-1.10%', high: 49000, low: 47800, vol: '3.1M' },
  ];

  const currentSymbolInfo = symbols.find(s => s.name === symbol) || symbols[0];

  const syncData = () => {
    const savedWallet = localStorage.getItem(WALLET_KEY);
    if (savedWallet) setAvailableCash(JSON.parse(savedWallet).cash);

    const savedOpen = localStorage.getItem(OPEN_ORDERS_KEY);
    if (savedOpen) {
      setOpenOrders(JSON.parse(savedOpen));
    } else {
      // Demo orders for visual check
      const demoOrders: Order[] = [
        {
          id: 'ORD-8821',
          symbol: 'VNM',
          side: 'BUY',
          type: 'LIMIT',
          price: 71500,
          quantity: 200,
          filledQuantity: 50,
          status: 'Partially Filled',
          time: '09:15:22',
          tif: 'GTC'
        },
        {
          id: 'ORD-9932',
          symbol: 'FPT',
          side: 'SELL',
          type: 'LIMIT',
          price: 135000,
          quantity: 50,
          filledQuantity: 0,
          status: 'New',
          time: '10:05:45',
          tif: 'GTC'
        }
      ];
      setOpenOrders(demoOrders);
      localStorage.setItem(OPEN_ORDERS_KEY, JSON.stringify(demoOrders));
    }

    const savedHistory = localStorage.getItem(WALLET_KEY);
    let historyList: any[] = [];
    
    if (savedHistory) {
      const data = JSON.parse(savedHistory);
      historyList = data.transactions.filter((tx: any) => tx.type === 'TRADE').reverse();
    }

    // Inject Demo Data as requested if list is empty or small
    if (historyList.length < 3) {
        const demoTrades = [
            { time: new Date().toISOString(), type: 'TRADE', note: 'Khớp lệnh MUA 50 VCB giá 96,096', amount: 4804800 },
            { time: new Date(Date.now() - 1800000).toISOString(), type: 'TRADE', note: 'Khớp lệnh MUA 100 FPT giá 128,500', amount: 12850000 },
            { time: new Date(Date.now() - 3600000).toISOString(), type: 'TRADE', note: 'Khớp lệnh MUA 150 VNM giá 72,400', amount: 10860000 },
        ];
        // Combine demo trades with existing history
        historyList = [...demoTrades, ...historyList];
    }
    setOrderHistory(historyList);
  };

  useEffect(() => {
    syncData();
    window.addEventListener('dak_sync', syncData);
    return () => window.removeEventListener('dak_sync', syncData);
  }, []);

  const executeTrade = () => {
    const p = parseFloat(price);
    const q = parseInt(quantity);
    if (!p || !q || q <= 0) return;

    if (orderType === 'LIMIT') {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        symbol,
        side,
        type: 'LIMIT',
        price: p,
        quantity: q,
        filledQuantity: 0,
        status: 'New',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        tif: 'GTC'
      };
      const updatedOpen = [...openOrders, newOrder];
      setOpenOrders(updatedOpen);
      localStorage.setItem(OPEN_ORDERS_KEY, JSON.stringify(updatedOpen));
    } else {
      processFill(symbol, side, p, q);
    }
    window.dispatchEvent(new Event('dak_sync'));
  };

  const processFill = (sym: string, s: OrderSide, p: number, q: number) => {
    const total = p * q;
    const fee = total * 0.001;
    const impact = s === 'BUY' ? (total + fee) : (total - fee);

    const walletData = JSON.parse(localStorage.getItem(WALLET_KEY) || '{}');
    if (s === 'BUY' && walletData.cash < impact) {
      alert("Số dư không đủ!");
      return;
    }

    walletData.cash = s === 'BUY' ? walletData.cash - impact : walletData.cash + impact;
    walletData.transactions.push({
      time: new Date().toISOString(),
      type: 'TRADE',
      note: `Khớp lệnh ${s === 'BUY' ? 'MUA' : 'BÁN'} ${q} ${sym} giá ${p.toLocaleString()}`,
      amount: impact,
      balanceAfter: walletData.cash
    });
    localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));

    let portfolio = JSON.parse(localStorage.getItem(PORTFOLIO_KEY) || '[]');
    const posIdx = portfolio.findIndex((pos: any) => pos.symbol === sym);
    if (s === 'BUY') {
      if (posIdx > -1) {
        portfolio[posIdx].avgPrice = ((portfolio[posIdx].avgPrice * portfolio[posIdx].quantity) + (p * q)) / (portfolio[posIdx].quantity + q);
        portfolio[posIdx].quantity += q;
      } else {
        portfolio.push({ symbol: sym, name: sym, quantity: q, avgPrice: p });
      }
    } else {
      if (posIdx > -1 && portfolio[posIdx].quantity >= q) {
        portfolio[posIdx].quantity -= q;
        if (portfolio[posIdx].quantity === 0) portfolio.splice(posIdx, 1);
      } else {
        alert("Không đủ số lượng!");
        return;
      }
    }
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  };

  // Modal Handlers
  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setEditPrice(order.price.toString());
    setEditQuantity(order.quantity.toString());
    setActiveModal('EDIT');
  };

  const openCancelModal = (order: Order) => {
    setSelectedOrder(order);
    setActiveModal('CANCEL');
  };

  const confirmCancel = () => {
    if (!selectedOrder) return;
    const updated = openOrders.filter(o => o.id !== selectedOrder.id);
    setOpenOrders(updated);
    localStorage.setItem(OPEN_ORDERS_KEY, JSON.stringify(updated));
    setActiveModal(null);
    window.dispatchEvent(new Event('dak_sync'));
  };

  const confirmEdit = () => {
    if (!selectedOrder) return;
    const p = parseFloat(editPrice);
    const q = parseInt(editQuantity);
    if (!p || !q || q <= 0) return;

    const updated = openOrders.map(o => {
      if (o.id === selectedOrder.id) {
        return { ...o, price: p, quantity: q };
      }
      return o;
    });

    setOpenOrders(updated);
    localStorage.setItem(OPEN_ORDERS_KEY, JSON.stringify(updated));
    setActiveModal(null);
    window.dispatchEvent(new Event('dak_sync'));
  };

  const handlePriceClick = (newPrice: number) => {
    setPrice(newPrice.toString());
  };

  const formatVND = (num: number) => num.toLocaleString('vi-VN');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full bg-[#0b0e11] pb-10">
      {/* Cột trái: Biểu đồ và Bảng Lệnh */}
      <div className="md:col-span-8 flex flex-col gap-4">
        {/* Header Thông tin Symbol & OHLCV */}
        <div className="bg-[#1e2329] p-4 rounded-xl border border-[#2b3139] shadow-lg relative z-20">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="relative">
              <div 
                className="flex items-center gap-4 cursor-pointer group shrink-0" 
                onClick={() => setShowSymbols(!showSymbols)}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white group-hover:text-[#f0b90b] transition-colors uppercase">{symbol}</h2>
                    <span className="text-xs text-[#848e9c]">/ VND</span>
                  </div>
                  <span className="text-[10px] text-[#848e9c] font-bold">{currentSymbolInfo.fullName}</span>
                </div>
                <i className={`bi bi-chevron-down text-[#848e9c] text-xs transition-transform ${showSymbols ? 'rotate-180' : ''}`}></i>
              </div>
              
              {showSymbols && (
                <div className="absolute top-14 left-0 w-[320px] bg-[#1e2329] border border-[#2b3139] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 border-b border-[#2b3139]">
                    <div className="relative">
                      <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#848e9c]"></i>
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm mã..." 
                        className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg py-2 pl-9 pr-3 text-sm outline-none focus:border-[#f0b90b]"
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="flex justify-between px-4 py-2 text-[10px] font-bold text-[#848e9c] uppercase bg-[#2b3139]/50">
                      <span>Mã / Volume</span>
                      <span>Giá / Thay đổi</span>
                    </div>
                    {symbols.map(s => (
                      <div 
                        key={s.name} 
                        className={`px-4 py-3 hover:bg-[#2b3139] cursor-pointer flex justify-between items-center transition-colors border-b border-[#2b3139]/30 ${symbol === s.name ? 'bg-[#2b3139]' : ''}`} 
                        onClick={() => { setSymbol(s.name); setPrice(s.price.toString()); setShowSymbols(false); }}
                      >
                        <div className="flex items-center gap-2">
                          <i className={`bi ${symbol === s.name ? 'bi-star-fill text-[#f0b90b]' : 'bi-star text-[#474d57] hover:text-[#f0b90b]'} text-xs`}></i>
                          <div>
                            <p className={`font-bold text-sm ${symbol === s.name ? 'text-[#f0b90b]' : 'text-[#eaecef]'}`}>{s.name}</p>
                            <p className="text-[10px] text-[#848e9c]">{s.vol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-[#eaecef]">{s.price.toLocaleString()}</p>
                          <p className={`text-[10px] font-bold ${s.change.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{s.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-[11px] font-bold overflow-x-auto scrollbar-hide">
               <div className="flex flex-col">
                  <span className="text-[#848e9c] text-[10px] uppercase">Giá hiện tại</span>
                  <span className={`text-lg font-mono font-black ${currentSymbolInfo.change.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {currentSymbolInfo.price.toLocaleString()}
                  </span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[#848e9c] text-[10px] uppercase">Biến động 24h</span>
                  <span className={`font-mono ${currentSymbolInfo.change.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {currentSymbolInfo.change}
                  </span>
               </div>
               <div className="hidden sm:flex flex-col">
                  <span className="text-[#848e9c] text-[10px] uppercase">Cao 24h</span>
                  <span className="text-[#eaecef] font-mono">{currentSymbolInfo.high.toLocaleString()}</span>
               </div>
               <div className="hidden sm:flex flex-col">
                  <span className="text-[#848e9c] text-[10px] uppercase">Thấp 24h</span>
                  <span className="text-[#eaecef] font-mono">{currentSymbolInfo.low.toLocaleString()}</span>
               </div>
               <div className="hidden lg:flex flex-col">
                  <span className="text-[#848e9c] text-[10px] uppercase">Khối lượng (24h)</span>
                  <span className="text-[#eaecef] font-mono">{currentSymbolInfo.vol} VND</span>
               </div>
            </div>
          </div>
        </div>

        {/* Khu vực Biểu đồ */}
        <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] flex items-center justify-center p-10 min-h-[420px] relative overflow-hidden shadow-inner">
           <div className="absolute top-4 left-4 flex gap-1 z-10">
              {['Thời gian', '1m', '15m', '1H', '4H', '1D'].map(t => (
                <button key={t} className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${t === '1D' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}>{t}</button>
              ))}
           </div>
           <div className="text-center opacity-5">
              <i className="bi bi-graph-up-arrow text-[180px] text-[#f0b90b] mb-4 block"></i>
              <p className="font-black uppercase tracking-[1em] text-[12px]">TradingView Chart Integration</p>
           </div>
        </div>

        {/* Bảng Lệnh - Redesigned */}
        <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden shadow-xl flex-1 flex flex-col min-h-[400px]">
          <div className="flex border-b border-[#2b3139] bg-[#2b3139]/30 sticky top-0 z-10">
            <button 
              onClick={() => setActiveTab('OPEN')}
              className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'OPEN' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-[#2b3139]'}`}
            >
              Lệnh chờ khớp ({openOrders.length})
              {activeTab === 'OPEN' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0b90b]"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('HISTORY')}
              className={`px-6 py-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'HISTORY' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-[#2b3139]'}`}
            >
              Lịch sử khớp lệnh
              {activeTab === 'HISTORY' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0b90b]"></div>}
            </button>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead className="bg-[#0b0e11] text-[#848e9c] font-bold uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 whitespace-nowrap">Thời gian</th>
                  <th className="p-4 whitespace-nowrap">Mã</th>
                  <th className="p-4 whitespace-nowrap">Loại</th>
                  <th className="p-4 whitespace-nowrap">Hướng</th>
                  <th className="p-4 text-right whitespace-nowrap">Giá</th>
                  <th className="p-4 text-right whitespace-nowrap">Số lượng</th>
                  <th className="p-4 text-right whitespace-nowrap">{activeTab === 'OPEN' ? 'Đã khớp' : 'Tổng giá trị'}</th>
                  <th className="p-4 text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b3139]">
                {activeTab === 'OPEN' ? (
                  openOrders.length > 0 ? openOrders.map(order => {
                    const fillPercent = (order.filledQuantity / order.quantity) * 100;
                    return (
                      <tr key={order.id} className="hover:bg-[#2b3139]/40 transition-colors group">
                        <td className="p-4 text-[#eaecef] font-mono">{order.time}</td>
                        <td className="p-4 font-black text-white">{order.symbol}</td>
                        <td className="p-4 text-[#eaecef]">{order.type}</td>
                        <td className={`p-4 font-black ${order.side === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {order.side === 'BUY' ? 'MUA' : 'BÁN'}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-[#eaecef]">{order.price.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono font-bold text-[#eaecef]">{order.quantity.toLocaleString()}</td>
                        <td className="p-4 text-right align-middle">
                          <div className="w-24 ml-auto">
                             <div className="flex justify-between text-[9px] mb-1">
                                <span className="font-mono text-[#eaecef]">{order.filledQuantity}</span>
                                <span className="font-mono text-[#848e9c]">{fillPercent.toFixed(1)}%</span>
                             </div>
                             <div className="h-1 bg-[#2b3139] rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${order.side === 'BUY' ? 'bg-[#0ecb81]' : 'bg-[#f6465d]'}`} 
                                  style={{ width: `${fillPercent}%` }}
                                ></div>
                             </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => openEditModal(order)} className="text-[#f0b90b] hover:bg-[#f0b90b]/10 p-1.5 rounded transition-colors" title="Sửa">
                                <i className="bi bi-pencil-square"></i>
                             </button>
                             <button onClick={() => openCancelModal(order)} className="text-[#f6465d] hover:bg-[#f6465d]/10 p-1.5 rounded transition-colors" title="Hủy">
                                <i className="bi bi-trash3-fill"></i>
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={8} className="p-16 text-center">
                         <div className="flex flex-col items-center gap-3 text-[#474d57]">
                            <i className="bi bi-inbox text-4xl opacity-50"></i>
                            <span className="text-xs font-medium">Không có lệnh mở</span>
                         </div>
                      </td>
                    </tr>
                  )
                ) : (
                  orderHistory.length > 0 ? orderHistory.map((tx, idx) => {
                    const parts = tx.note.split(' ');
                    const sym = parts[4] || 'UNKNOWN';
                    const qty = parts[3] || '0';
                    const prc = tx.amount / (parseInt(qty) || 1);
                    const isBuy = tx.note.includes('MUA');
                    return (
                      <tr key={idx} className="hover:bg-[#2b3139]/40 transition-colors">
                        <td className="p-4 text-[#848e9c] font-mono">{new Date(tx.time).toLocaleTimeString()}</td>
                        <td className="p-4 font-black text-white">{sym}</td>
                        <td className="p-4 text-[#eaecef]">LIMIT</td>
                        <td className={`p-4 font-black ${isBuy ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                          {isBuy ? 'MUA' : 'BÁN'}
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-[#eaecef]">{prc.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono font-bold text-[#eaecef]">{qty}</td>
                        <td className="p-4 text-right font-mono font-bold text-[#f0b90b]">{tx.amount.toLocaleString()}</td>
                        <td className="p-4 text-center">
                          <span className="text-[10px] text-[#eaecef] font-bold">Đã khớp</span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                       <td colSpan={8} className="p-16 text-center">
                         <div className="flex flex-col items-center gap-3 text-[#474d57]">
                            <i className="bi bi-clock-history text-4xl opacity-50"></i>
                            <span className="text-xs font-medium">Chưa có lịch sử giao dịch</span>
                         </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cột phải: Panel Đặt Lệnh & Sổ Lệnh */}
      <div className="md:col-span-4 flex flex-col gap-4">
        {/* Form Đặt Lệnh */}
        <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden shadow-2xl shrink-0">
          <div className="grid grid-cols-2">
            <button onClick={() => setSide('BUY')} className={`py-4 font-black text-xs transition-all tracking-widest ${side === 'BUY' ? 'bg-[#0ecb81] text-[#0b0e11]' : 'bg-[#2b3139] text-[#848e9c] hover:text-white'}`}>MUA</button>
            <button onClick={() => setSide('SELL')} className={`py-4 font-black text-xs transition-all tracking-widest ${side === 'SELL' ? 'bg-[#f6465d] text-white' : 'bg-[#2b3139] text-[#848e9c] hover:text-white'}`}>BÁN</button>
          </div>
          <div className="p-5 space-y-4">
             <div className="flex items-center gap-4 border-b border-[#2b3139] pb-3">
                <button onClick={() => setOrderType('LIMIT')} className={`text-[10px] font-black uppercase tracking-wider ${orderType === 'LIMIT' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}>Giới hạn</button>
                <button onClick={() => setOrderType('MARKET')} className={`text-[10px] font-black uppercase tracking-wider ${orderType === 'MARKET' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}>Thị trường</button>
             </div>
             
             <div className="flex justify-between text-[10px] font-black uppercase text-[#848e9c] px-1">
                <span>Khả dụng</span>
                <span className="text-white font-mono">{formatVND(availableCash)}</span>
             </div>
             
             <div className="space-y-3">
                <div className="relative group">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#848e9c] font-black uppercase">Giá</span>
                   <input 
                      type="text" 
                      value={orderType === 'MARKET' ? 'Giá thị trường' : price} 
                      disabled={orderType === 'MARKET'}
                      onChange={e => setPrice(e.target.value)} 
                      className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 text-right text-sm font-black outline-none focus:border-[#f0b90b] font-mono disabled:opacity-50 transition-all" 
                   />
                   <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] text-[#474d57] font-bold">VND</span>
                </div>
                <div className="relative group">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#848e9c] font-black uppercase">S.Lượng</span>
                   <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 text-right text-sm font-black outline-none focus:border-[#f0b90b] font-mono transition-all" />
                </div>
             </div>
             
             <div className="pt-2">
               <div className="flex justify-between text-[10px] text-[#848e9c] mb-2 font-bold">
                 <span>Ước tính:</span>
                 <span className="text-[#eaecef] font-mono">
                    {orderType === 'MARKET' ? 'Thị trường' : formatVND(parseFloat(price || '0') * parseInt(quantity || '0'))}
                 </span>
               </div>
               
               <button 
                  onClick={executeTrade}
                  className={`w-full py-4 rounded-xl font-black text-sm transition-all shadow-lg active:scale-[0.98] ${
                    side === 'BUY' 
                      ? 'bg-[#0ecb81] text-[#0b0e11] hover:bg-[#0ecb81]/90 shadow-[#0ecb81]/20' 
                      : 'bg-[#f6465d] text-white hover:bg-[#f6465d]/90 shadow-[#f6465d]/20'
                  }`}
               >
                  {side === 'BUY' ? 'MUA' : 'BÁN'} {symbol}
               </button>
             </div>
          </div>
        </div>

        {/* Order Book & Market Trades - Combined Container */}
        <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden shadow-xl flex-1 flex flex-col">
             {/* ORDER BOOK SECTION */}
             <div className="p-4 pb-2">
                 <div className="flex justify-between items-center mb-2">
                     <h4 className="text-[10px] text-[#848e9c] font-black uppercase tracking-widest">Sổ lệnh</h4>
                     <span className="text-[10px] text-[#848e9c]">Bước giá: 100</span>
                 </div>

                 {/* New Header for horizontal layout */}
                 <div className="grid grid-cols-4 gap-1 text-[9px] text-[#848e9c] font-bold mb-1 px-1 text-center">
                     <span className="text-right">KL Mua</span>
                     <span className="text-right">Giá Mua</span>
                     <span className="text-left">Giá Bán</span>
                     <span className="text-left">KL Bán</span>
                 </div>

                 <div className="space-y-0.5">
                    {[1, 2, 3].map(i => {
                        const bidPrice = currentSymbolInfo.price - i*100;
                        const askPrice = currentSymbolInfo.price + i*100;
                        const bidVol = (Math.random() * 5000 + 100).toFixed(0);
                        const askVol = (Math.random() * 5000 + 100).toFixed(0);

                        return (
                            <div key={i} className="grid grid-cols-4 gap-1 text-[11px] font-mono relative hover:bg-[#2b3139] cursor-pointer py-1">
                                {/* Bid Side */}
                                <div className="text-right text-[#eaecef] relative pr-2">
                                     <div className="absolute top-0 right-0 bottom-0 bg-[#0ecb81]/10 z-0" style={{ width: `${Math.random() * 100}%` }}></div>
                                     <span className="relative z-10">{bidVol}</span>
                                </div>
                                <div className="text-right text-[#0ecb81] font-bold cursor-pointer" onClick={() => handlePriceClick(bidPrice)}>
                                    {bidPrice.toLocaleString()}
                                </div>

                                {/* Ask Side */}
                                <div className="text-left text-[#f6465d] font-bold cursor-pointer pl-2" onClick={() => handlePriceClick(askPrice)}>
                                    {askPrice.toLocaleString()}
                                </div>
                                <div className="text-left text-[#eaecef] relative pl-2">
                                     <div className="absolute top-0 left-0 bottom-0 bg-[#f6465d]/10 z-0" style={{ width: `${Math.random() * 100}%` }}></div>
                                     <span className="relative z-10">{askVol}</span>
                                </div>
                            </div>
                        )
                    })}
                 </div>
                 
                 {/* Current Price Indicator */}
                 <div className="py-2 flex items-center justify-center gap-2 border-t border-[#2b3139]/30 mt-2">
                     <span className={`text-sm font-black font-mono ${currentSymbolInfo.change.startsWith('+') ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                        Giá khớp: {currentSymbolInfo.price.toLocaleString()}
                     </span>
                 </div>
             </div>

             {/* MARKET TRADES SECTION */}
             <div className="flex-1 flex flex-col border-t border-[#2b3139]">
                 <div className="p-3 border-b border-[#2b3139] bg-[#2b3139]/20">
                     <h4 className="text-[10px] text-[#848e9c] font-black uppercase tracking-widest">Khớp lệnh thị trường</h4>
                 </div>
                 <div className="flex justify-between px-4 py-2 text-[9px] text-[#848e9c] font-bold">
                     <span>Giá</span>
                     <span>KL</span>
                     <span>Thời gian</span>
                 </div>
                 <div className="overflow-y-auto flex-1 h-0 scrollbar-thin">
                     {[...Array(15)].map((_, i) => {
                         const isBuy = Math.random() > 0.5;
                         const p = currentSymbolInfo.price + (Math.floor(Math.random() * 5) - 2) * 100;
                         return (
                             <div key={i} className="flex justify-between px-4 py-1.5 text-[10px] font-mono hover:bg-[#2b3139]/50 cursor-default">
                                 <span className={isBuy ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>{p.toLocaleString()}</span>
                                 <span className="text-[#eaecef]">{(Math.random() * 2000 + 10).toFixed(0)}</span>
                                 <span className="text-[#848e9c]">{new Date(Date.now() - i * 5000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                             </div>
                         )
                     })}
                 </div>
             </div>
        </div>
      </div>

      {/* Edit Modal */}
      {activeModal === 'EDIT' && selectedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-200">
               <h3 className="text-lg font-bold mb-4">Chỉnh sửa lệnh</h3>
               <div className="space-y-4">
                  <div>
                     <label className="text-xs text-[#848e9c] font-bold block mb-1">Giá đặt</label>
                     <input type="text" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 font-mono font-bold" />
                  </div>
                  <div>
                     <label className="text-xs text-[#848e9c] font-bold block mb-1">Số lượng</label>
                     <input type="text" value={editQuantity} onChange={e => setEditQuantity(e.target.value)} className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 font-mono font-bold" />
                  </div>
                  <div className="flex gap-3 pt-2">
                     <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-[#2b3139] rounded-lg font-bold hover:bg-[#2b3139]">Hủy</button>
                     <button onClick={confirmEdit} className="flex-1 py-3 bg-[#f0b90b] text-[#0b0e11] rounded-lg font-bold">Xác nhận</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Cancel Modal */}
      {activeModal === 'CANCEL' && selectedOrder && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-200 text-center">
               <div className="w-16 h-16 rounded-full bg-[#f6465d]/20 text-[#f6465d] flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-exclamation-lg text-3xl"></i>
               </div>
               <h3 className="text-lg font-bold mb-2">Hủy lệnh chờ?</h3>
               <p className="text-sm text-[#848e9c] mb-6">Bạn có chắc chắn muốn hủy lệnh {selectedOrder.side === 'BUY' ? 'MUA' : 'BÁN'} {selectedOrder.quantity} {selectedOrder.symbol} không?</p>
               <div className="flex gap-3">
                  <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-[#2b3139] rounded-lg font-bold hover:bg-[#2b3139]">Không</button>
                  <button onClick={confirmCancel} className="flex-1 py-3 bg-[#f6465d] text-white rounded-lg font-bold">Hủy lệnh</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Trading;
