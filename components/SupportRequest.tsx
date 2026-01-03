
import React, { useState } from 'react';
import { HelpView, Ticket } from '../types';
import { ICONS, COLORS } from '../constants';

interface SupportRequestProps {
  onBack: () => void;
  initialView: HelpView;
}

const SupportRequest: React.FC<SupportRequestProps> = ({ onBack, initialView }) => {
  const [view, setView] = useState<'create' | 'list' | 'chat'>(initialView === HelpView.MY_TICKETS ? 'list' : 'create');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const mockTickets: Ticket[] = [
    { id: 'TIC-001', title: 'Lỗi nạp tiền mô phỏng', category: 'Ví', status: 'Pending', date: '2024-05-15', priority: 'High' },
    { id: 'TIC-002', title: 'Câu hỏi về thuật toán AI', category: 'AI Advice', status: 'Resolved', date: '2024-05-10', priority: 'Medium' },
  ];

  const renderCreate = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Tạo yêu cầu hỗ trợ mới</h3>
        <button 
          onClick={() => setView('list')}
          className="text-[#f0b90b] text-sm font-medium hover:underline"
        >
          Yêu cầu của tôi (2)
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Danh mục cần hỗ trợ</label>
          <select className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]">
            <option>Tài khoản & Bảo mật</option>
            <option>Ví & Giao dịch</option>
            <option>AI Chatbot & Gợi ý</option>
            <option>Kiến thức thị trường</option>
            <option>Khác</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Tiêu đề vấn đề</label>
          <input type="text" className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]" placeholder="Nhập tóm tắt vấn đề" />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Mô tả chi tiết</label>
          <textarea rows={5} className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]" placeholder="Mô tả kỹ vấn đề bạn gặp phải..." />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Mức độ ưu tiên</label>
          <div className="flex gap-4">
            {['Thấp', 'Trung bình', 'Cao'].map((p, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="priority" className="accent-[#f0b90b]" defaultChecked={i===1} />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="w-full py-4 bg-[#f0b90b] text-[#0b0e11] rounded-lg font-bold hover:bg-[#f0b90b]/90 transition-all mt-4">
          Tạo Ticket hỗ trợ
        </button>
      </div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-6 animate-in slide-in-from-left duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Yêu cầu hỗ trợ của tôi</h3>
        <button 
          onClick={() => setView('create')}
          className="bg-[#f0b90b] text-[#0b0e11] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#f0b90b]/90 transition-all"
        >
          + Tạo mới
        </button>
      </div>

      <div className="bg-[#1e2329] rounded-xl border border-[#2b3139] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#2b3139] text-sm text-[#848e9c]">
            <tr>
              <th className="p-4">Mã số</th>
              <th className="p-4">Vấn đề</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày gửi</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2b3139]">
            {mockTickets.map((ticket) => (
              <tr 
                key={ticket.id} 
                className="hover:bg-[#2b3139]/50 transition-colors cursor-pointer"
                onClick={() => { setSelectedTicket(ticket); setView('chat'); }}
              >
                <td className="p-4 font-mono text-[#f0b90b]">{ticket.id}</td>
                <td className="p-4 font-medium">{ticket.title}</td>
                <td className="p-4 text-sm text-[#848e9c]">{ticket.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    ticket.status === 'Open' ? 'bg-[#3b82f6]/20 text-[#3b82f6]' :
                    ticket.status === 'Pending' ? 'bg-[#f0b90b]/20 text-[#f0b90b]' :
                    'bg-[#0ecb81]/20 text-[#0ecb81]'
                  }`}>
                    {ticket.status === 'Open' ? 'Đang mở' : ticket.status === 'Pending' ? 'Đang xử lý' : 'Đã giải quyết'}
                  </span>
                </td>
                <td className="p-4 text-sm text-[#848e9c]">{ticket.date}</td>
                <td className="p-4"><ICONS.ChevronRight /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[#2b3139] pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-2 hover:bg-[#2b3139] rounded-full">
            <ICONS.Back />
          </button>
          <div>
            <h3 className="font-bold">{selectedTicket?.title}</h3>
            <p className="text-xs text-[#848e9c]">Mã số: {selectedTicket?.id} • Trạng thái: {selectedTicket?.status}</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-[#f6465d] text-[#f6465d] rounded-lg text-sm font-bold hover:bg-[#f6465d]/10 transition-all">
          Đóng Ticket
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-[#1e2329]/30 rounded-xl border border-[#2b3139]">
        <div className="flex justify-start">
          <div className="bg-[#2b3139] p-3 rounded-2xl rounded-tl-none max-w-[80%]">
            <p className="text-sm">Chào bạn, mình là Support AI của DAK.TNT. Vấn đề bạn báo về nạp tiền mô phỏng đang được kiểm tra bởi kỹ thuật viên. Bạn vui lòng chờ trong giây lát nhé.</p>
            <p className="text-[10px] text-[#848e9c] mt-1 text-right">09:15 AM</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-[#f0b90b] text-[#0b0e11] p-3 rounded-2xl rounded-tr-none max-w-[80%]">
            <p className="text-sm font-medium">Cảm ơn bạn, tôi đang cần số dư để giao dịch thử nghiệm VCB hôm nay.</p>
            <p className="text-[10px] text-[#0b0e11]/70 mt-1 text-right">09:20 AM</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Nhập tin nhắn..." 
          className="flex-1 bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]"
        />
        <button className="w-12 h-12 bg-[#f0b90b] text-[#0b0e11] flex items-center justify-center rounded-lg hover:bg-[#f0b90b]/90 transition-all">
          <ICONS.Send />
        </button>
      </div>
    </div>
  );

  if (view === 'chat') return renderChat();
  return view === 'create' ? renderCreate() : renderList();
};

export default SupportRequest;
