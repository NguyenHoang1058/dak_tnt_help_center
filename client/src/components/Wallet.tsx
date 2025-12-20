
import React, { useState, useEffect } from 'react';
import { WalletTransaction } from '../../types';
import { COLORS, ICONS } from '../../constants';
import { tradeApi } from '../api/api';

const STORAGE_KEY = 'dak_tnt_wallet_v1';

const Wallet: React.FC = () => {
  const [cash, setCash] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositNote, setDepositNote] = useState('');

  //Load data
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await tradeApi.getWallet();

        setCash(res.data.balance);
        setTransactions(res.data.transactions);

      }catch (error : any){
        console.error("Không tải được ví");
      }
    };
    fetchWallet();
  }, []);

  const saveWallet = (newCash: number, newTotal: number, newTransactions: WalletTransaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cash: newCash, totalDeposit: newTotal, transactions: newTransactions }));
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) return;

    const newCash = cash + amount;
    const newTotal = totalDeposit + amount;
    const newTx: WalletTransaction = {
      time: new Date().toISOString(),
      type: 'DEPOSIT',
      note: depositNote || 'Nạp tiền mô phỏng',
      amount: amount,
      balanceAfter: newCash
    };

    const updatedTxs = [...transactions, newTx];
    setCash(newCash);
    setTotalDeposit(newTotal);
    setTransactions(updatedTxs);
    saveWallet(newCash, newTotal, updatedTxs);
    
    setShowDepositModal(false);
    setDepositAmount('');
    setDepositNote('');
  };

  const resetWallet = () => {
    if (window.confirm('Bạn có chắc chắn muốn reset dữ liệu ví?')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const formatCurrency = (amount: number) => {
    return '₫' + amount.toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2329] p-6 rounded-xl border border-[#2b3139] hover:border-[#f0b90b] transition-all">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[#848e9c] text-sm">Số dư khả dụng</p>
            <div className="w-10 h-10 rounded-lg bg-[#f0b90b]/10 text-[#f0b90b] flex items-center justify-center">
              <i className="bi bi-wallet2 text-xl"></i>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{formatCurrency(cash)}</h3>
          <p className="text-sm text-[#0ecb81]">Sẵn sàng giao dịch</p>
        </div>

        <div className="bg-[#1e2329] p-6 rounded-xl border border-[#2b3139] hover:border-[#f0b90b] transition-all">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[#848e9c] text-sm">Tổng tiền đã nạp</p>
            <div className="w-10 h-10 rounded-lg bg-[#0ecb81]/10 text-[#0ecb81] flex items-center justify-center">
              <i className="bi bi-graph-up text-xl"></i>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{formatCurrency(totalDeposit)}</h3>
          <p className="text-sm text-[#848e9c]">Tích lũy từ nạp tiền</p>
        </div>

        <div className="bg-[#1e2329] p-6 rounded-xl border border-[#2b3139] hover:border-[#f0b90b] transition-all">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[#848e9c] text-sm">Số giao dịch ví</p>
            <div className="w-10 h-10 rounded-lg bg-[#f0b90b]/10 text-[#f0b90b] flex items-center justify-center">
              <i className="bi bi-receipt text-xl"></i>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1">{transactions.length}</h3>
          <p className="text-sm text-[#848e9c]">Lịch sử nạp</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => setShowDepositModal(true)}
          className="flex items-center gap-4 p-4 bg-[#2b3139] rounded-xl hover:bg-[#f0b90b] hover:text-[#0b0e11] transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-lg bg-[#f0b90b]/20 text-[#f0b90b] flex items-center justify-center group-hover:bg-[#0b0e11]/10">
            <i className="bi bi-plus-circle text-2xl"></i>
          </div>
          <div>
            <h4 className="font-bold">Nạp tiền mô phỏng</h4>
            <p className="text-xs opacity-70">Thêm vốn ảo để bắt đầu học giao dịch</p>
          </div>
        </button>

        <button 
          onClick={resetWallet}
          className="flex items-center gap-4 p-4 bg-[#2b3139] rounded-xl hover:bg-[#f6465d] hover:text-[#eaecef] transition-all group text-left"
        >
          <div className="w-12 h-12 rounded-lg bg-[#f6465d]/20 text-[#f6465d] flex items-center justify-center group-hover:bg-white/10">
            <i className="bi bi-arrow-clockwise text-2xl"></i>
          </div>
          <div>
            <h4 className="font-bold">Reset Demo</h4>
            <p className="text-xs opacity-70">Khởi tạo lại dữ liệu ví ban đầu</p>
          </div>
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden">
        <div className="p-6 border-b border-[#2b3139] flex justify-between items-center">
          <h3 className="text-lg font-bold">Lịch sử giao dịch ví</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2b3139] text-sm text-[#848e9c]">
              <tr>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Loại</th>
                <th className="p-4">Ghi chú</th>
                <th className="p-4">Số tiền</th>
                <th className="p-4">Số dư sau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-[#848e9c]">Chưa có giao dịch nào</td>
                </tr>
              ) : (
                [...transactions].reverse().map((tx, i) => (
                  <tr key={i} className="hover:bg-[#2b3139]/50 transition-colors">
                    <td className="p-4 text-sm text-[#848e9c] font-mono">
                      {new Date(tx.time).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-[#0ecb81]/20 text-[#0ecb81] text-[10px] font-bold uppercase">
                        Nạp tiền
                      </span>
                    </td>
                    <td className="p-4 text-sm">{tx.note}</td>
                    <td className="p-4 font-bold text-[#0ecb81]">+{formatCurrency(tx.amount)}</td>
                    <td className="p-4 font-bold">{formatCurrency(tx.balanceAfter)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e2329] border border-[#2b3139] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-[#2b3139] flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#f0b90b]">Nạp tiền mô phỏng</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-[#848e9c] hover:text-[#eaecef]">
                <ICONS.Close />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-[#848e9c] mb-1 block">Số tiền nạp (VNĐ)</label>
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Nhập số tiền..."
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b] text-xl font-bold"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1000000, 5000000, 10000000].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setDepositAmount(amt.toString())}
                    className="py-2 bg-[#2b3139] rounded hover:bg-[#f0b90b] hover:text-[#0b0e11] transition-all text-xs font-bold"
                  >
                    +{amt/1000000}M
                  </button>
                ))}
              </div>
              <div>
                <label className="text-sm text-[#848e9c] mb-1 block">Ghi chú (tùy chọn)</label>
                <input 
                  type="text" 
                  value={depositNote}
                  onChange={(e) => setDepositNote(e.target.value)}
                  placeholder="Ví dụ: Vốn đầu tư VNM..."
                  className="w-full bg-[#0b0e11] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 border border-[#2b3139] rounded-lg font-bold hover:bg-[#2b3139]"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleDeposit}
                  className="flex-1 py-3 bg-[#f0b90b] text-[#0b0e11] rounded-lg font-bold hover:bg-[#f0b90b]/90"
                >
                  Xác nhận nạp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
