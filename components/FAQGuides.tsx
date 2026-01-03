
import React, { useState } from 'react';
import { HelpView, Article } from '../types';
import { ICONS, COLORS } from '../constants';

interface FAQGuidesProps {
  onBack: () => void;
  type: HelpView;
}

const FAQGuides: React.FC<FAQGuidesProps> = ({ onBack, type }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [search, setSearch] = useState('');

  const articles: Article[] = [
    { id: '1', isFaq: true, category: 'Tài khoản', title: 'Làm thế nào để đổi mật khẩu?', content: 'Để đổi mật khẩu, bạn vào mục Hồ sơ cá nhân > Cài đặt bảo mật > Đổi mật khẩu...' },
    { id: '2', isFaq: true, category: 'Giao dịch', title: 'Tại sao tôi không thể mua cổ phiếu?', content: 'Có thể số dư khả dụng của bạn không đủ hoặc thị trường đang trong giờ nghỉ giao dịch...' },
    { id: '3', isFaq: false, category: 'Cơ bản', title: 'Hướng dẫn giao dịch cho người mới', content: 'Bước 1: Nạp tiền mô phỏng. Bước 2: Chọn mã chứng khoán. Bước 3: Đặt lệnh mua/bán...' },
    { id: '4', isFaq: false, category: 'AI Tools', title: 'Cách sử dụng AI Advisor hiệu quả', content: 'AI Advisor sử dụng ML để phân tích xu hướng. Bạn có thể nhấn vào biểu tượng Robot để bắt đầu chat...' },
  ];

  const filtered = articles.filter(a => 
    (type === HelpView.FAQ ? a.isFaq : !a.isFaq) &&
    (a.title.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = Array.from(new Set(filtered.map(a => a.category)));

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="flex items-center gap-2 text-sm text-[#848e9c] hover:text-[#f0b90b] mb-6 transition-colors"
        >
          <ICONS.Back /> Quay lại danh sách
        </button>
        <article className="space-y-6">
          <header className="space-y-2 border-b border-[#2b3139] pb-6">
            <span className="bg-[#f0b90b]/20 text-[#f0b90b] px-3 py-1 rounded text-xs font-bold uppercase">{selectedArticle.category}</span>
            <h2 className="text-4xl font-bold">{selectedArticle.title}</h2>
            <p className="text-sm text-[#848e9c]">Cập nhật lần cuối: 15/05/2024 • 5 phút đọc</p>
          </header>
          <div className="prose prose-invert max-w-none text-lg text-[#eaecef] leading-relaxed">
            <p>{selectedArticle.content}</p>
            <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Mở ứng dụng và đăng nhập.</li>
              <li>Chọn biểu tượng ví trên thanh menu.</li>
              <li>Nhập số tiền bạn muốn nạp mô phỏng.</li>
            </ul>
          </div>
          <footer className="mt-12 pt-8 border-t border-[#2b3139]">
            <div className="bg-[#1e2329] p-6 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold">Thông tin này có hữu ích không?</h4>
                <p className="text-sm text-[#848e9c]">Ý kiến của bạn giúp chúng tôi cải thiện tốt hơn.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-[#2b3139] hover:bg-[#0ecb81]/20 hover:text-[#0ecb81] rounded-lg transition-all font-bold">CÓ</button>
                <button className="px-6 py-2 bg-[#2b3139] hover:bg-[#f6465d]/20 hover:text-[#f6465d] rounded-lg transition-all font-bold">KHÔNG</button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">{type === HelpView.FAQ ? 'Câu hỏi thường gặp (FAQ)' : 'Hướng dẫn sử dụng'}</h3>
          <p className="text-[#848e9c]">Tìm kiếm thông tin bạn cần hỗ trợ bên dưới.</p>
        </div>
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#848e9c]">
            <ICONS.Search />
          </div>
          <input 
            type="text" 
            placeholder="Tìm bài viết..." 
            className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg py-2 pl-10 pr-4 outline-none focus:border-[#f0b90b]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <h4 className="text-xs font-bold text-[#848e9c] uppercase mb-4 tracking-wider">Danh mục</h4>
          <button className="w-full text-left px-4 py-2 rounded-lg bg-[#f0b90b] text-[#0b0e11] font-bold">Tất cả</button>
          {categories.map(cat => (
            <button key={cat} className="w-full text-left px-4 py-2 rounded-lg hover:bg-[#2b3139] transition-colors">{cat}</button>
          ))}
        </aside>

        {/* Article Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
          {filtered.length > 0 ? filtered.map(art => (
            <button 
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 bg-[#1e2329] border border-[#2b3139] rounded-xl hover:border-[#f0b90b] transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold text-[#848e9c] uppercase mb-2 block">{art.category}</span>
                <h4 className="text-lg font-bold group-hover:text-[#f0b90b] mb-4">{art.title}</h4>
              </div>
              <div className="flex items-center text-sm text-[#f0b90b] font-medium">
                Xem thêm <span className="ml-1 group-hover:translate-x-1 transition-transform"><ICONS.ChevronRight /></span>
              </div>
            </button>
          )) : (
            <div className="col-span-full py-20 text-center text-[#848e9c]">
              <p className="text-lg mb-2">Không tìm thấy kết quả phù hợp</p>
              <p className="text-sm">Vui lòng thử từ khóa khác hoặc liên hệ hỗ trợ.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQGuides;
