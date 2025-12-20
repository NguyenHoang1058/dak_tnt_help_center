
import React, { useState, useEffect } from 'react';
import { OrderSide, OrderType, Order, TradeTransaction } from '../../types';
import { COLORS } from '../../constants';
import { tradeApi } from '../api/api';

const Trading: React.FC = () => {
  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [symbol, setSymbol] = useState('VNM');
  const [price, setPrice] = useState<string>('72400');
  const [quantity, setQuantity] = useState<string>('100');
  const [tif, setTif] = useState<'GTC' | 'DAY'>('GTC');
  const [tradingTab, setTradingTab] = useState<'OPEN_ORDERS' | 'ORDER_HISTORY' | 'TRADE_HISTORY'>('OPEN_ORDERS');
  
  const [openOrders, setOpenOrders] = useState<Order[]>([
    { id: 'ORD-123456', symbol: 'VNM', side: 'BUY', type: 'LIMIT', price: 71500, quantity: 500, filledQuantity: 0, status: 'New', time: '2024-05-18 10:20:00', tif: 'GTC' },
    { id: 'ORD-123457', symbol: 'FPT', side: 'SELL', type: 'LIMIT', price: 130000, quantity: 200, filledQuantity: 50, status: 'Partially Filled', time: '2024-05-18 09:15:22', tif: 'GTC' },
  ]);

  const mockTradeHistory: TradeTransaction[] = [
    { id: 'TX772188201', time: '2024-05-18 10:15:32', symbol: 'VNM', type: 'BUY', side: 'Lệnh thị trường', price: 72400, quantity: 100, total: 7240000, fee: 7240, status: 'Filled' },
    { id: 'TX772188202', time: '2024-05-17 14:20:11', symbol: 'FPT', type: 'SELL', side: 'Lệnh giới hạn', price: 128500, quantity: 50, total: 6425000, fee: 6425, status: 'Filled' },
    { id: 'TX772188203', time: '2024-05-16 09:30:05', symbol: 'VCB', type: 'BUY', side: 'Lệnh giới hạn', price: 94200, quantity: 200, total: 18840000, fee: 18840, status: 'Filled' },
  ];

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Mock Order Book Data
  const orderBook = {
    asks: [
      { price: 72600, qty: 15400, depth: 85 },
      { price: 72550, qty: 8200, depth: 65 },
      { price: 72500, qty: 12100, depth: 45 },
      { price: 72450, qty: 4500, depth: 25 },
      { price: 72400, qty: 2100, depth: 10 },
    ],
    bids: [
      { price: 72350, qty: 3200, depth: 15 },
      { price: 72300, qty: 9800, depth: 35 },
      { price: 72250, qty: 14500, depth: 55 },
      { price: 72200, qty: 6700, depth: 75 },
      { price: 72150, qty: 22100, depth: 95 },
    ]
  };

  const handlePriceClick = (p: number) => {
    if (orderType === 'LIMIT') setPrice(p.toString());
  };

  const handlePlaceOrder = async() => {
    try {
        const response = await tradeApi.buyStock({
          userId: 'user123', // Hardcoded for testing
          symbol: symbol,
          quantity: parseInt(quantity),
          price: parseFloat(price)
        });

        alert("Đặt lệnh thành công!");
    } catch (error: any){
      alert("Lỗi đặt lệnh: " + error.response?.data?.message);
    }
  };
  //   const handlePlaceOrder = () => {
  //   const newOrder: Order = {
  //     id: `ORD-${Math.floor(Math.random() * 1000000)}`,
  //     symbol,
  //     side,
  //     type: orderType,
  //     price: parseFloat(price),
  //     quantity: parseFloat(quantity),
  //     filledQuantity: 0,
  //     status: 'New',
  //     time: new Date().toLocaleString(),
  //     tif
  //   };
  //   setOpenOrders([newOrder, ...openOrders]);
  // };

  const cancelOrder = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn hủy lệnh này?')) {
      setOpenOrders(openOrders.filter(o => o.id !== id));
    }
  };

  const totalValue = parseFloat(price) * parseFloat(quantity) || 0;
  const buyingPower = 15000000;

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="grid grid-cols-12 gap-2 h-full min-h-[calc(100vh-100px)] animate-in fade-in duration-500">
      {/* Column 1: Order Book & Recent Trades */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
        <div className="bg-[#1e2329] rounded-lg p-3 flex-1 flex flex-col border border-[#2b3139]">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-xs font-bold text-[#848e9c] uppercase">Sổ lệnh</h3>
            <div className="flex gap-1 text-[#848e9c]">
               <i className="bi bi-justify text-lg cursor-pointer hover:text-white"></i>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col-reverse">
              {orderBook.asks.map((ask, i) => (
                <div 
                  key={i} 
                  className="relative group cursor-pointer h-6 flex items-center justify-between text-xs px-2 hover:bg-[#2b3139]"
                  onClick={() => handlePriceClick(ask.price)}
                >
                  <div className="absolute right-0 h-full bg-[#f6465d]/10 transition-all duration-300" style={{ width: `${ask.depth}%` }}></div>
                  <span className="text-[#f6465d] font-mono z-10">{ask.price.toLocaleString()}</span>
                  <span className="text-[#eaecef] font-mono z-10">{ask.qty.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="py-2 my-1 border-y border-[#2b3139] flex flex-col items-center justify-center bg-[#0b0e11]/30">
                <div className="text-lg font-bold text-[#0ecb81]">72,400 <i className="bi bi-arrow-up"></i></div>
                <div className="text-[10px] text-[#848e9c]">≈ ₫72.4k</div>
            </div>

            <div className="flex flex-col">
              {orderBook.bids.map((bid, i) => (
                <div 
                  key={i} 
                  className="relative group cursor-pointer h-6 flex items-center justify-between text-xs px-2 hover:bg-[#2b3139]"
                  onClick={() => handlePriceClick(bid.price)}
                >
                  <div className="absolute right-0 h-full bg-[#0ecb81]/10 transition-all duration-300" style={{ width: `${bid.depth}%` }}></div>
                  <span className="text-[#0ecb81] font-mono z-10">{bid.price.toLocaleString()}</span>
                  <span className="text-[#eaecef] font-mono z-10">{bid.qty.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#1e2329] rounded-lg p-3 h-64 border border-[#2b3139]">
          <h3 className="text-xs font-bold text-[#848e9c] uppercase mb-4 px-2">Khớp lệnh thị trường</h3>
          <div className="space-y-1 overflow-y-auto max-h-[180px] scrollbar-hide">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex justify-between text-[11px] px-2">
                <span className={i % 3 === 0 ? 'text-[#f6465d]' : 'text-[#0ecb81]'}>72,{400 - i * 5}</span>
                <span className="text-[#eaecef]">{Math.floor(Math.random() * 5000)}</span>
                <span className="text-[#848e9c]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Chart & Open Orders / History */}
      <div className="col-span-12 lg:col-span-6 flex flex-col gap-2">
        <div className="bg-[#1e2329] rounded-lg p-4 flex-1 border border-[#2b3139] flex flex-col min-h-[400px]">
           <div className="flex items-center gap-6 mb-4 pb-4 border-b border-[#2b3139]">
              <div className="flex items-center gap-2">
                 <h2 className="text-xl font-black">{symbol}/VND</h2>
                 <i className="bi bi-chevron-down text-[#848e9c] text-xs"></i>
              </div>
              <div className="flex gap-4">
                 <div><p className="text-[10px] text-[#848e9c]">Thay đổi</p><p className="text-xs text-[#0ecb81]">+1.19%</p></div>
                 <div><p className="text-[10px] text-[#848e9c]">24h Cao</p><p className="text-xs">73,200</p></div>
                 <div><p className="text-[10px] text-[#848e9c]">24h Thấp</p><p className="text-xs">71,800</p></div>
              </div>
           </div>
           <div className="flex-1 bg-[#0b0e11]/50 rounded border border-dashed border-[#2b3139] flex items-center justify-center relative overflow-hidden">
              <span className="text-[#848e9c] z-10">K-Line Chart Visualization</span>
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <svg width="100%" height="100%">
                    <polyline points="0,250 50,230 100,240 150,200 200,210 250,150 300,160 350,100 400,120 450,80 500,90 600,50" fill="none" stroke={COLORS.yellow} strokeWidth="2" />
                 </svg>
              </div>
           </div>
        </div>

        {/* Orders & History Tabs */}
        <div className="bg-[#1e2329] rounded-lg border border-[#2b3139] h-[350px] overflow-hidden flex flex-col shadow-2xl">
           <div className="flex border-b border-[#2b3139] bg-[#1e2329]">
              <button 
                onClick={() => setTradingTab('OPEN_ORDERS')}
                className={`px-6 py-3 text-xs font-bold transition-all relative ${tradingTab === 'OPEN_ORDERS' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}
              >
                Lệnh mở ({openOrders.length})
                {tradingTab === 'OPEN_ORDERS' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0b90b]"></div>}
              </button>
              <button 
                onClick={() => setTradingTab('TRADE_HISTORY')}
                className={`px-6 py-3 text-xs font-bold transition-all relative ${tradingTab === 'TRADE_HISTORY' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}
              >
                Lịch sử giao dịch
                {tradingTab === 'TRADE_HISTORY' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f0b90b]"></div>}
              </button>
           </div>
           
           <div className="flex-1 overflow-x-auto scrollbar-hide">
              {tradingTab === 'OPEN_ORDERS' ? (
                <table className="w-full text-left text-[11px]">
                   <thead className="text-[#848e9c] bg-[#2b3139]/30 border-b border-[#2b3139]">
                      <tr>
                         <th className="p-3">Thời gian</th>
                         <th className="p-3">Mã</th>
                         <th className="p-3">Loại</th>
                         <th className="p-3">Hướng</th>
                         <th className="p-3 text-right">Giá đặt</th>
                         <th className="p-3 text-right">Số lượng</th>
                         <th className="p-3 text-right">Đã khớp</th>
                         <th className="p-3 text-right">Thao tác</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2b3139]">
                      {openOrders.map(order => (
                        <tr key={order.id} className="hover:bg-[#2b3139]/50 transition-colors">
                           <td className="p-3 text-[#848e9c] whitespace-nowrap">{order.time}</td>
                           <td className="p-3 font-bold">{order.symbol}</td>
                           <td className="p-3">{order.type}</td>
                           <td className={`p-3 font-bold ${order.side === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{order.side}</td>
                           <td className="p-3 font-mono text-right">{order.price.toLocaleString()}</td>
                           <td className="p-3 font-mono text-right">{order.quantity.toLocaleString()}</td>
                           <td className="p-3 font-mono text-right">{((order.filledQuantity / order.quantity) * 100).toFixed(0)}%</td>
                           <td className="p-3 text-right">
                              <button onClick={() => cancelOrder(order.id)} className="text-[#f6465d] hover:text-[#f6465d]/80 font-bold">Hủy</button>
                           </td>
                        </tr>
                      ))}
                      {openOrders.length === 0 && (
                        <tr><td colSpan={8} className="p-20 text-center text-[#848e9c]">Không có lệnh mở</td></tr>
                      )}
                   </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-[11px]">
                   <thead className="text-[#848e9c] bg-[#2b3139]/30 border-b border-[#2b3139]">
                      <tr>
                         <th className="p-3">Thời gian</th>
                         <th className="p-3">Mã</th>
                         <th className="p-3">Loại</th>
                         <th className="p-3 text-right">Giá khớp</th>
                         <th className="p-3 text-right">Số lượng</th>
                         <th className="p-3 text-right">Tổng (VND)</th>
                         <th className="p-3 text-right">Phí</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#2b3139]">
                      {mockTradeHistory.map(tx => (
                        <tr key={tx.id} className="hover:bg-[#2b3139]/50 transition-colors">
                           <td className="p-3 text-[#848e9c] whitespace-nowrap">{tx.time}</td>
                           <td className="p-3 font-bold">
                              {tx.symbol}
                              <span className={`ml-2 text-[9px] ${tx.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>{tx.type}</span>
                           </td>
                           <td className="p-3 text-[#848e9c]">{tx.side}</td>
                           <td className="p-3 font-mono text-right">{tx.price.toLocaleString()}</td>
                           <td className="p-3 font-mono text-right">{tx.quantity.toLocaleString()}</td>
                           <td className="p-3 font-black text-right">{tx.total.toLocaleString()}</td>
                           <td className="p-3 text-right text-[#f6465d]">{tx.fee.toLocaleString()}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              )}
           </div>
        </div>
      </div>

      {/* Column 3: Trading Form */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
        <div className="bg-[#1e2329] rounded-lg border border-[#2b3139] flex flex-col h-full overflow-hidden shadow-xl">
           <div className="grid grid-cols-2">
              <button 
                onClick={() => setSide('BUY')}
                className={`py-4 font-black text-sm transition-all relative ${side === 'BUY' ? 'bg-[#0ecb81] text-[#0b0e11]' : 'bg-[#2b3139] text-[#848e9c]'}`}
              >
                MUA
                {side === 'BUY' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10"></div>}
              </button>
              <button 
                onClick={() => setSide('SELL')}
                className={`py-4 font-black text-sm transition-all relative ${side === 'SELL' ? 'bg-[#f6465d] text-white' : 'bg-[#2b3139] text-[#848e9c]'}`}
              >
                BÁN
                {side === 'SELL' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10"></div>}
              </button>
           </div>

           <div className="p-4 flex-1 space-y-5">
              <div className="flex gap-1 bg-[#0b0e11] p-1 rounded-lg">
                 <button onClick={() => setOrderType('LIMIT')} className={`flex-1 py-1.5 text-[10px] rounded transition-all ${orderType === 'LIMIT' ? 'bg-[#2b3139] text-[#f0b90b] font-bold' : 'text-[#848e9c]'}`}>Giới hạn</button>
                 <button onClick={() => setOrderType('MARKET')} className={`flex-1 py-1.5 text-[10px] rounded transition-all ${orderType === 'MARKET' ? 'bg-[#2b3139] text-[#f0b90b] font-bold' : 'text-[#848e9c]'}`}>Thị trường</button>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] text-[#848e9c]">
                    <span>Khả dụng:</span>
                    <span className="font-bold text-[#eaecef]">{formatVND(buyingPower)}</span>
                 </div>

                 {orderType === 'LIMIT' && (
                    <div className="relative group">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-[#848e9c] uppercase font-bold">Giá</span>
                       <input 
                          type="text" 
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full bg-[#0b0e11] border border-[#2b3139] group-hover:border-[#f0b90b] focus:border-[#f0b90b] rounded-lg p-3 text-right font-mono text-sm outline-none transition-all" 
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#848e9c]">VND</span>
                    </div>
                 )}

                 <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-[#848e9c] uppercase font-bold">Số lượng</span>
                    <input 
                       type="text" 
                       value={quantity}
                       onChange={(e) => setQuantity(e.target.value)}
                       className="w-full bg-[#0b0e11] border border-[#2b3139] group-hover:border-[#f0b90b] focus:border-[#f0b90b] rounded-lg p-3 text-right font-mono text-sm outline-none transition-all" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#848e9c]">{symbol}</span>
                 </div>

                 <div className="flex justify-between gap-1">
                    {[25, 50, 75, 100].map(pct => (
                      <button key={pct} className="flex-1 py-1 bg-[#2b3139] hover:bg-[#3b3e44] text-[9px] font-bold rounded transition-colors">{pct}%</button>
                    ))}
                 </div>

                 <div className="pt-2 border-t border-[#2b3139] space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-[#848e9c]">Tổng cộng:</span>
                       <span className="font-bold text-[#f0b90b]">{formatVND(totalValue)}</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-4 bg-[#2b3139]/30">
              <button 
                onClick={handlePlaceOrder}
                className={`w-full py-4 rounded-xl font-black text-sm shadow-lg hover:opacity-90 transition-all active:scale-[0.98] ${side === 'BUY' ? 'bg-[#0ecb81] text-[#0b0e11]' : 'bg-[#f6465d] text-white'}`}
              >
                {side === 'BUY' ? 'MUA' : 'BÁN'} {symbol}
              </button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-[#848e9c] italic">
                 <i className="bi bi-info-circle text-[#f0b90b]"></i>
                 <span>Giao dịch mô phỏng - Tài khoản học tập.</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
