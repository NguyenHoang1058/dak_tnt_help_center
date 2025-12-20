
import React, { useState, useRef, useEffect } from 'react';
import { ICONS, COLORS } from '../../constants';
import axiosClient from '../api/axiosClient';
import { resolve } from 'node:dns';

interface Message {
  role: 'user' | 'model';
  text: string;
  time: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Chào bạn! Mình là trợ lý tài chính AI dành riêng cho sinh viên DAK.TNT. Bạn cần mình giúp gì về quản lý chi tiêu hay đầu tư không?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Cách tiết kiệm 1 triệu/tháng?",
    "Cổ phiếu VNM có tốt không?",
    "Quản lý rủi ro cho sinh viên",
    "Lãi suất kép là gì?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Khởi tạo Gemini AI client
      const response = await axiosClient.post('/ai/chat', {
        message: messageText,

        //Gửi vài tin nhắn cũ để làm lịch sử (option)
        history: messages.slice(-4).map(m => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.text
        }))
      })

      const aiText = response.data.data || "Xin lỗi, mình gặp một chút trục trặc khi suy nghĩ. Bạn thử lại nhé!";
      
      const aiMessage: Message = {
        role: 'model',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Có lỗi xảy ra khi kết nối với máy chủ AI. Vui lòng kiểm tra lại kết nối.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e2329] rounded-2xl border border-[#2b3139] overflow-hidden shadow-2xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 py-4 bg-[#2b3139] border-b border-[#2b3139] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f0b90b]/20 flex items-center justify-center text-[#f0b90b]">
            <i className="bi bi-robot text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-[#eaecef]">Trợ lý Tài chính AI</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-[#0ecb81] rounded-full animate-pulse"></span>
              <span className="text-[10px] text-[#848e9c] font-bold uppercase tracking-wider">Trực tuyến</span>
            </div>
          </div>
        </div>
        <button className="text-[#848e9c] hover:text-[#f0b90b] transition-colors">
          <i className="bi bi-three-dots-vertical"></i>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#f0b90b] text-[#0b0e11] rounded-tr-none font-medium' 
                  : 'bg-[#2b3139] text-[#eaecef] rounded-tl-none border border-[#474d57]/30'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-[#848e9c] mt-1 font-mono">{msg.time}</span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-[#2b3139] px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#848e9c] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#848e9c] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-[#848e9c] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Area */}
      <div className="p-4 bg-[#0b0e11]/50 border-t border-[#2b3139] space-y-4">
        {/* Quick Questions */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickQuestions.map((q, i) => (
            <button 
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-[#1e2329] border border-[#2b3139] text-[11px] text-[#848e9c] hover:border-[#f0b90b] hover:text-[#f0b90b] transition-all whitespace-nowrap active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Hỏi AI về tài chính sinh viên..."
              className="w-full bg-[#1e2329] border border-[#2b3139] rounded-xl py-3.5 pl-4 pr-12 text-sm outline-none focus:border-[#f0b90b] transition-all placeholder:text-[#474d57]"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#474d57] hover:text-[#f0b90b]">
              <i className="bi bi-paperclip text-lg"></i>
            </button>
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-14 h-14 bg-[#f0b90b] text-[#0b0e11] rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#f0b90b]/10 disabled:opacity-50"
          >
            <ICONS.Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
