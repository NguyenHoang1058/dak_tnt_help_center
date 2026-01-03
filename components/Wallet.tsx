
import React, { useState, useEffect } from 'react';
import { WalletTransaction } from '../types';

export const WALLET_KEY = 'dak_tnt_wallet_v2';
export const PORTFOLIO_KEY = 'dak_tnt_portfolio_v2';

const Wallet: React.FC = () => {
  const [cash, setCash] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const initData = () => {
    const savedWallet = localStorage.getItem(WALLET_KEY);

    if (savedWallet) {
      const data = JSON.parse(savedWallet);
      setCash(data.cash);
      setTotalRewards(data.totalRewards);
      setTransactions(data.transactions);
    } else {
      // Thiết lập dữ liệu demo ban đầu theo yêu cầu
      const initialCapital = 50000000;
      const initialRewards = 30000000;
      
      const demoTrades = [
        { sym: 'VNM', qty: 150, prc: 68500, total: 10275000 },
        { sym: 'FPT', qty: 100, prc: 115000, total: 11500000 },
        { sym: 'VCB', qty: 50, prc: 96000, total: 4800000 }
      ];
      
      let currentBalance = initialCapital;
      const history: WalletTransaction[] = [
        { 
          time: new Date(Date.now() - 86400000 * 5).toISOString(), 
          type: 'DEPOSIT', 
          note: 'Vốn hệ thống cấp ban đầu', 
          amount: initialCapital, 
          balanceAfter: currentBalance 
        }
      ];

      currentBalance += initialRewards;
      history.push({ 
        time: new Date(Date.now() - 86400000 * 4).toISOString(), 
        type: 'REWARD', 
        note: 'Tiền thưởng học tập tích lũy', 
        amount: initialRewards, 
        balanceAfter: currentBalance 
      });

      demoTrades.forEach(t => {
        const fee = t.total * 0.001;
        const impact = t.total + fee;
        currentBalance -= impact;
        history.push({
          time: new Date(Date.now() - 86400000 * 2).toISOString(),
          type: 'TRADE',
          note: `Khớp lệnh MUA ${t.qty} ${t.sym} (Bao gồm phí 0.1%)`,
          amount: impact,
          balanceAfter: currentBalance
        });
      });

      const walletData = { 
        cash: currentBalance, 
        totalRewards: initialRewards, 
        transactions: history 
      };
      localStorage.setItem(WALLET_KEY, JSON.stringify(walletData));
      
      const portfolioData = [
        { symbol: 'VNM', name: 'Sữa Việt Nam', quantity: 150, avgPrice: 68500 },
        { symbol: 'FPT', name: 'FPT Corp', quantity: 100, avgPrice: 115000 },
        { symbol: 'VCB', name: 'Vietcombank', quantity: 50, avgPrice: 96000 }
      ];
      localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolioData));

      setCash(currentBalance);
      setTotalRewards(initialRewards);
      setTransactions(history);
      window.dispatchEvent(new Event('dak_sync'));
    }
  };

  useEffect(() => {
    initData();
    window.addEventListener('dak_sync', initData);
    return () => window.removeEventListener('dak_sync', initData);
  }, []);

  const formatVND = (n: number) => '₫' + n.toLocaleString('vi-VN');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black">Ví Tài Sản</h1>
          <p className="text-[#848e9c] text-sm font-medium">Đồng bộ số dư thực tế từ các hoạt động giao dịch và học tập.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2329] p-7 rounded-2xl border border-[#2b3139] shadow-2xl relative overflow-hidden group">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-4 tracking-widest">Số dư khả dụng</p>
          <h3 className="text-4xl font-black text-[#f0b90b] font-mono">{formatVND(cash)}</h3>
          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#2b3139]">
             <span className="w-2 h-2 bg-[#0ecb81] rounded-full animate-pulse"></span>
             <p className="text-[10px] text-[#848e9c] font-bold uppercase">Real-time Balance</p>
          </div>
        </div>
        
        <div className="bg-[#1e2329] p-7 rounded-2xl border border-[#2b3139] shadow-xl">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-4 tracking-widest">Tiền thưởng học tập</p>
          <h3 className="text-3xl font-black text-[#0ecb81] font-mono">{formatVND(totalRewards)}</h3>
          <p className="text-[10px] text-[#848e9c] font-bold uppercase mt-2">Đã cộng vào ví</p>
        </div>

        <div className="bg-[#1e2329] p-7 rounded-2xl border border-[#2b3139] shadow-xl">
          <p className="text-[#848e9c] text-[10px] font-black uppercase mb-4 tracking-widest">Vốn cấp ban đầu</p>
          <h3 className="text-3xl font-black text-[#eaecef] font-mono">{formatVND(50000000)}</h3>
          <p className="text-[10px] text-[#848e9c] font-bold uppercase mt-2">System Capital</p>
        </div>
      </div>

      <div className="bg-[#1e2329] rounded-2xl border border-[#2b3139] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#2b3139] bg-[#2b3139]/30">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#848e9c]">Lịch sử biến động số dư</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2b3139] text-[10px] font-black text-[#848e9c] uppercase tracking-widest">
              <tr>
                <th className="p-5">Thời gian</th>
                <th className="p-5">Loại</th>
                <th className="p-5">Chi tiết</th>
                <th className="p-5 text-right">Giá trị</th>
                <th className="p-5 text-right">Số dư còn lại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {[...transactions].reverse().map((tx, i) => (
                <tr key={i} className="hover:bg-[#2b3139]/50 transition-colors">
                  <td className="p-5 text-xs text-[#848e9c] font-mono">{new Date(tx.time).toLocaleString('vi-VN')}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                      tx.type === 'REWARD' ? 'bg-[#f0b90b]/15 text-[#f0b90b]' : 
                      tx.type === 'TRADE' ? 'bg-[#3b82f6]/15 text-[#3b82f6]' : 'bg-[#0ecb81]/15 text-[#0ecb81]'
                    }`}>
                      {tx.type === 'REWARD' ? 'THƯỞNG' : tx.type === 'TRADE' ? 'TRADE' : 'CAPITAL'}
                    </span>
                  </td>
                  <td className="p-5 text-sm font-bold text-[#eaecef]">{tx.note}</td>
                  <td className={`p-5 text-right font-black text-sm font-mono ${tx.note.includes('MUA') ? 'text-[#f6465d]' : 'text-[#0ecb81]'}`}>
                    {tx.note.includes('MUA') ? '-' : '+'}{formatVND(tx.amount)}
                  </td>
                  <td className="p-5 text-right font-mono font-bold text-[#848e9c]">{formatVND(tx.balanceAfter)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
