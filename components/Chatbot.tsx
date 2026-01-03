
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { ICONS, COLORS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
  time: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Chào bạn! Mình là **DAK.TNT**, trợ lý tài chính AI của bạn. \n\nBạn cần mình giúp gì về quản lý chi tiêu hay đầu tư không? Ví dụ:\n- Cách lập kế hoạch tài chính cá nhân\n- Phân tích mã cổ phiếu\n- Giải thích các thuật ngữ thị trường',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Mẹo tiết kiệm tiền sinh viên?",
    "Cổ phiếu Blue-chip là gì?",
    "Phân tích thị trường hôm nay"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const systemPrompts = `
          Bạn là trợ lý AI bị giới hạn chức năng cho hệ thống ĐẦU TƯ ẢO.

            TRƯỚC KHI TRẢ LỜI, BẮT BUỘC KIỂM TRA:
            - Câu hỏi có yêu cầu khuyến nghị, so sánh, dự đoán, xác suất, thời điểm, lợi nhuận hay không?
            - Câu hỏi có liên quan đến tài sản cụ thể, thị trường thật hay không?
            
            NẾU CÓ MỘT TRONG CÁC YẾU TỐ TRÊN → PHẢI TỪ CHỐI.
            
            CÁC NỘI DUNG BỊ CẤM TUYỆT ĐỐI:
            - Mua / bán / nắm giữ tài sản cụ thể
            - So sánh tài sản để chọn cái tốt hơn
            - Dự đoán giá, xu hướng, xác suất tăng/giảm
            - Đầu tư bằng tiền thật, thời điểm vào lệnh
            - Trả lời trá hình dưới dạng ví dụ học thuật
            
            CHỈ ĐƯỢC PHÉP:
            - Giải thích khái niệm đầu tư
            - Minh họa ví dụ GIẢ ĐỊNH, KHÔNG gắn với tài sản cụ thể
            - Nguyên tắc quản lý rủi ro cho người mới
            
            MẪU TỪ CHỐI DUY NHẤT (KHÔNG ĐƯỢC THAY ĐỔI):
            "Xin lỗi, hệ thống này chỉ hỗ trợ kiến thức đầu tư ảo và giáo dục tài chính cơ bản."
            
            KHÔNG:
            - Gợi ý thêm
            - Nêu ý kiến cá nhân
            - Thay đổi cách diễn đạt mẫu từ chối
          `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messageText,
        config: {
          systemInstruction: systemPrompts,
        }
      });

      const aiText = response.text || "Xin lỗi, mình gặp một chút trục trặc khi suy nghĩ. Bạn thử lại nhé!";
      
      const aiMessage: Message = {
        role: 'model',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Gemini Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng thử lại sau.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100%-2rem)] md:w-[450px] h-[550px] md:h-[650px] bg-[#1e2329] rounded-2xl border border-[#2b3139] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[9999] animate-in slide-in-from-bottom-10 duration-300">
      {/* Header */}
      <div className="px-6 py-4 bg-[#2b3139] border-b border-[#2b3139] flex justify-between items-center rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f0b90b]/20 flex items-center justify-center text-[#f0b90b]">
            <i className="bi bi-stars text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-[#eaecef] text-sm">Trợ lý Thông minh DAK.TNT</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#0ecb81] rounded-full animate-pulse"></span>
              <span className="text-[10px] text-[#848e9c] font-bold uppercase tracking-tighter">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1e2329] text-[#848e9c] transition-colors" title="Thu nhỏ">
            <ICONS.Minimized/>
          </button>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1e2329] text-[#848e9c] transition-colors" title="Đóng">
            <ICONS.Close />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed markdown-content ${
                msg.role === 'user' 
                  ? 'bg-[#f0b90b] text-[#0b0e11] rounded-tr-none font-medium shadow-md' 
                  : 'bg-[#2b3139] text-[#eaecef] rounded-tl-none border border-[#474d57]/30 shadow-sm'
              }`}>
                {msg.role === 'model' ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
              <span className="text-[9px] text-[#848e9c] mt-1.5 font-mono uppercase tracking-tighter">{msg.time}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#2b3139] px-4 py-4 rounded-2xl rounded-tl-none border border-[#474d57]/30 flex gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-[#f0b90b] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-[#0b0e11]/50 border-t border-[#2b3139] space-y-3 rounded-b-2xl">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickQuestions.map((q, i) => (
            <button 
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-[#1e2329] border border-[#2b3139] text-[10px] text-[#848e9c] hover:border-[#f0b90b] hover:text-[#f0b90b] transition-all whitespace-nowrap font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Đặt câu hỏi cho AI..."
            className="flex-1 bg-[#1e2329] border border-[#2b3139] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#f0b90b] transition-all placeholder:text-[#474d57]"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-[#f0b90b] text-[#0b0e11] rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-[#f0b90b]/10"
          >
            <ICONS.Send />
          </button>
        </div>
        <p className="text-[9px] text-[#474d57] text-center font-medium">AI có thể đưa ra câu trả lời chưa chính xác. Hãy kiểm tra các thông tin quan trọng.</p>
      </div>
    </div>
  );
};

export default Chatbot;
