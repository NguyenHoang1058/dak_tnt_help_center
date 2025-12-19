
import React, { useState } from 'react';
import { ICONS, COLORS } from '../constants';

interface BugReportFormProps {
  onBack: () => void;
}

const BugReportForm: React.FC<BugReportFormProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    severity: 'Medium',
  });
  const [trackingId, setTrackingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    const id = `BUG-${Math.floor(100000 + Math.random() * 900000)}`;
    setTrackingId(id);
    setStep(2);
  };

  if (step === 2) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-300">
        <div className="w-20 h-20 rounded-full bg-[#0ecb81]/20 text-[#0ecb81] flex items-center justify-center">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-2xl font-bold">Báo cáo đã được gửi thành công!</h3>
        <p className="text-[#848e9c] max-w-md">
          Cảm ơn bạn đã đóng góp giúp hệ thống hoàn thiện hơn. Chúng tôi sẽ kiểm tra và phản hồi sớm nhất có thể.
        </p>
        <div className="bg-[#1e2329] p-4 rounded-lg border border-[#2b3139] w-full max-w-xs">
          <p className="text-xs text-[#848e9c] uppercase mb-1">Mã theo dõi (Tracking ID)</p>
          <p className="text-xl font-mono font-bold text-[#f0b90b]">{trackingId}</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-[#f0b90b] text-[#0b0e11] px-8 py-3 rounded-lg font-bold hover:bg-[#f0b90b]/90 transition-all"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-right duration-300">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-[#f6465d]"><ICONS.Bug /></span>
          Báo cáo lỗi hệ thống
        </h3>
        <p className="text-[#848e9c]">Vui lòng cung cấp chi tiết lỗi để đội ngũ kỹ thuật xử lý nhanh nhất.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Tiêu đề lỗi *</label>
          <input 
            required
            type="text" 
            placeholder="Ví dụ: Không thể nhấn nút 'Mua' cổ phiếu VNM"
            className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Mức độ nghiêm trọng</label>
          <div className="grid grid-cols-3 gap-3">
            {['Low', 'Medium', 'High'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFormData({...formData, severity: lvl})}
                className={`py-2 px-4 rounded-lg border transition-all ${
                  formData.severity === lvl 
                    ? 'bg-[#f0b90b] text-[#0b0e11] border-[#f0b90b] font-bold' 
                    : 'bg-[#1e2329] border-[#2b3139] text-[#848e9c]'
                }`}
              >
                {lvl === 'Low' ? 'Thấp' : lvl === 'Medium' ? 'Vừa' : 'Cao'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Các bước tái hiện lỗi *</label>
          <textarea 
            required
            rows={4}
            placeholder="1. Vào màn hình Dashboard&#10;2. Nhấn nút Giao dịch&#10;3. Chọn VNM và nhấn nút Mua nhưng không có phản hồi..."
            className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]"
            value={formData.steps}
            onChange={e => setFormData({...formData, steps: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Mô tả thêm</label>
          <textarea 
            rows={3}
            placeholder="Mô tả thêm về thiết bị, trình duyệt bạn đang dùng (nếu có)..."
            className="w-full bg-[#1e2329] border border-[#2b3139] rounded-lg p-3 outline-none focus:border-[#f0b90b]"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button"
            onClick={onBack}
            className="flex-1 py-3 border border-[#2b3139] rounded-lg font-bold hover:bg-[#2b3139]"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            className="flex-1 py-3 bg-[#f0b90b] text-[#0b0e11] rounded-lg font-bold hover:bg-[#f0b90b]/90"
          >
            Gửi báo cáo
          </button>
        </div>
      </form>
    </div>
  );
};

export default BugReportForm;
