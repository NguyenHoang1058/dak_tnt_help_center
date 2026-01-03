
import React, { useState, useEffect } from 'react';
import HelpCenter from './src/components/HelpCenter';
import Sidebar from './src/components/Sidebar';
import Topbar from './src/components/Topbar';
import Dashboard from './src/components/Dashboard';
import Feed from './src/components/Feed';
import Wallet from './src/components/Wallet';
import Profile from './src/components/Profile';
import TransactionHistory from './src/components/TransactionHistory';
import Portfolio from './src/components/Portfolio';
import Trading from './src/components/Trading';
import Auth from './src/components/Auth';
import Chatbot from './src/components/Chatbot';
import AIAdvisor from './src/components/AIAdvisor';
import { MainView } from './types';

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [currentView, setCurrentView] = useState<MainView>(MainView.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporarily set to true for testing
  const [user, setUser] = useState<string>('dashboard');

  // Kiểm tra trạng thái đăng nhập khi load ứng dụng
  useEffect(() => {
    const savedUser = localStorage.getItem('dak_tnt_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('dak_tnt_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('test123');
    localStorage.removeItem('dak_tnt_user');
  };

  const handleNavigate = (view: MainView) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Auto-close sidebar on navigation for mobile
  };

  const renderMainContent = () => {
    switch (currentView) {
      case MainView.FEED:
        return <Feed />;
      case MainView.WALLET:
        return <Wallet />;
      case MainView.PROFILE:
        return <Profile onLogout={handleLogout} />;
      case MainView.HISTORY:
        return <TransactionHistory />;
      case MainView.PORTFOLIO:
        return <Portfolio onNavigate={handleNavigate} />;
      case MainView.TRADING:
        return <Trading />;
      case MainView.AI_ADVISOR:
        return <AIAdvisor onNavigate={handleNavigate} />;
      case MainView.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-[#eaecef] relative overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[1001] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <Sidebar 
        activeView={currentView} 
        onNavigate={handleNavigate} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full lg:ml-[260px] transition-all duration-300">
        <Topbar 
          onHelpClick={() => setShowHelp(true)} 
          onProfileClick={() => setCurrentView(MainView.PROFILE)} 
          onLogout={handleLogout}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />
        
        <main className="mt-[70px] p-3 md:p-4 flex-1 overflow-x-hidden flex flex-col w-full max-w-full">
          {renderMainContent()}
        </main>
      </div>

      {/* Chat Floating Action Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-[#f0b90b] text-[#0b0e11] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-[9998] group"
          title="Trợ lý AI"
        >
          <i className="bi bi-chat-dots-fill text-xl md:text-2xl group-hover:animate-bounce"></i>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0ecb81] rounded-full border-2 border-[#0b0e11]"></span>
        </button>
      )}

      {/* Chatbot Popup */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {showHelp && (
        <HelpCenter onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};

export default App;
