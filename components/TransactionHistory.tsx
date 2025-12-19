
import React, { useState, useMemo } from 'react';
import { TradeTransaction } from '../types';
import { ICONS } from '../constants';

const MOCK_TRADES: TradeTransaction[] = [
  { id: 'TX772188201', time: '2024-05-18 10:15:32', symbol: 'VNM', type: 'BUY', side: 'Lệnh thị trường', price: 72400, quantity: 100, total: 7240000, fee: 7240, status: 'Filled' },
  { id: 'TX772188202', time: '2024-05-17 14:20:11', symbol: 'FPT', type: 'SELL', side: 'Lệnh giới hạn', price: 128500, quantity: 50, total: 6425000, fee: 6425, status: 'Filled' },
  { id: 'TX772188203', time: '2024-05-16 09:30:05', symbol: 'VCB', type: 'BUY', side: 'Lệnh giới hạn', price: 94200, quantity: 200, total: 18840000, fee: 18840, status: 'Filled' },
  { id: 'TX772188204', time: '2024-05-16 09:35:12', symbol: 'HPG', type: 'SELL', side: 'Lệnh thị trường', price: 28150, quantity: 1000, total: 28150000, fee: 28150, status: 'Filled' },
  { id: 'TX772188205', time: '2024-05-15 15:45:59', symbol: 'VNM', type: 'BUY', side: 'Lệnh giới hạn', price: 71800, quantity: 500, total: 35900000, fee: 35900, status: 'Cancelled' },
  { id: 'TX772188206', time: '2024-05-14 11:10:22', symbol: 'SSI', type: 'BUY', side: 'Lệnh thị trường', price: 35200, quantity: 300, total: 10560000, fee: 10560, status: 'Filled' },
];

const TransactionHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [selectedTrade, setSelectedTrade] = useState<TradeTransaction | null>(null);
  const [activeTab, setActiveTab] = useState<'TRADES' | 'ORDERS'>('TRADES');

  const filteredTrades = useMemo(() => {
    return MOCK_TRADES.filter(trade => {
      const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            trade.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || trade.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  const formatVND = (num: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lịch sử giao dịch</h1>
          <p className="text-[#848e9c]">Theo dõi và quản lý tất cả các lệnh khớp của bạn trên thị trường.</p>
        </div>

        <div className="flex border-b border-[#2b3139]">
          <button 
            onClick={() => setActiveTab('TRADES')}
            className={`px-6 py-3 font-bold transition-all relative ${activeTab === 'TRADES' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}
          >
            Lịch sử khớp lệnh
            {activeTab === 'TRADES' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f0b90b] rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`px-6 py-3 font-bold transition-all relative ${activeTab === 'ORDERS' ? 'text-[#f0b90b]' : 'text-[#848e9c] hover:text-[#eaecef]'}`}
          >
            Lịch sử lệnh đặt
            {activeTab === 'ORDERS' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f0b90b] rounded-t-full"></div>}
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1e2329] p-4 rounded-xl border border-[#2b3139] flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#848e9c]">
            <ICONS.Search />
          </div>
          <input 
            type="text" 
            placeholder="Tìm theo mã CP hoặc ID giao dịch..." 
            className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg py-2 pl-10 pr-4 outline-none focus:border-[#f0b90b] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#848e9c]">Loại:</span>
          <select 
            className="bg-[#0b0e11] border border-[#2b3139] rounded-lg px-3 py-2 outline-none focus:border-[#f0b90b]"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="ALL">Tất cả</option>
            <option value="BUY">Mua</option>
            <option value="SELL">Bán</option>
          </select>
        </div>

        <button 
          onClick={() => {setSearchTerm(''); setFilterType('ALL');}}
          className="text-sm text-[#f0b90b] hover:underline px-2"
        >
          Đặt lại bộ lọc
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#2b3139] text-[#848e9c] font-medium">
              <tr>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Cặp/Mã</th>
                <th className="p-4">Loại</th>
                <th className="p-4">Giá khớp</th>
                <th className="p-4">Số lượng</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {filteredTrades.length > 0 ? filteredTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-[#2b3139]/40 transition-colors group">
                  <td className="p-4 text-[#848e9c] font-mono whitespace-nowrap">{trade.time}</td>
                  <td className="p-4 font-bold">{trade.symbol}</td>
                  <td className="p-4">
                    <span className={`font-bold ${trade.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                      {trade.type === 'BUY' ? 'MUA' : 'BÁN'}
                    </span>
                    <div className="text-[10px] text-[#848e9c] uppercase">{trade.side}</div>
                  </td>
                  <td className="p-4 font-mono">{formatVND(trade.price)}</td>
                  <td className="p-4 font-mono">{trade.quantity.toLocaleString()}</td>
                  <td className="p-4 font-bold">{formatVND(trade.total)}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedTrade(trade)}
                      className="px-3 py-1.5 rounded bg-[#2b3139] text-[#f0b90b] text-xs font-bold hover:bg-[#f0b90b] hover:text-[#0b0e11] transition-all"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#848e9c]">
                      <i className="bi bi-inbox text-4xl opacity-20"></i>
                      <p>Không tìm thấy lịch sử giao dịch phù hợp</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-[#2b3139] flex justify-between items-center">
              <h3 className="text-xl font-bold">Chi tiết giao dịch</h3>
              <button onClick={() => setSelectedTrade(null)} className="text-[#848e9c] hover:text-[#eaecef]">
                <ICONS.Close />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Receipt Style Header */}
              <div className="text-center space-y-2 pb-6 border-b border-dashed border-[#474d57]">
                <div className={`text-4xl font-black ${selectedTrade.type === 'BUY' ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                  {selectedTrade.type === 'BUY' ? '+' : '-'}{formatVND(selectedTrade.total)}
                </div>
                <div className="text-sm font-bold text-[#848e9c] uppercase tracking-widest">
                  {selectedTrade.type === 'BUY' ? 'Khớp lệnh mua' : 'Khớp lệnh bán'} • {selectedTrade.symbol}
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#848e9c]">Trạng thái</span>
                  <span className="text-[#0ecb81] font-bold flex items-center gap-1">
                    <i className="bi bi-check-circle-fill"></i> {selectedTrade.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848e9c]">ID Giao dịch</span>
                  <span className="font-mono text-[#f0b90b]">{selectedTrade.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848e9c]">Thời gian thực thi</span>
                  <span>{selectedTrade.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848e9c]">Giá khớp TB</span>
                  <span className="font-mono">{formatVND(selectedTrade.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848e9c]">Số lượng khớp</span>
                  <span className="font-mono">{selectedTrade.quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-[#2b3139]">
                  <span className="text-[#848e9c]">Phí giao dịch (0.1%)</span>
                  <span className="text-[#f6465d]">-{formatVND(selectedTrade.fee)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span className="text-[#eaecef]">Tổng thực nhận</span>
                  <span className="text-[#f0b90b]">{formatVND(selectedTrade.total - selectedTrade.fee)}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedTrade(null)}
                className="w-full py-4 bg-[#2b3139] text-[#eaecef] rounded-xl font-bold hover:bg-[#3b3e44] transition-all mt-4"
              >
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
