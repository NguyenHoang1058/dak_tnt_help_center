
import React, { useState, useEffect } from 'react';
import HelpCenter from './components/HelpCenter';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Feed from './components/Feed';
import Wallet from './components/Wallet';
import Profile from './components/Profile';
import TransactionHistory from './components/TransactionHistory';
import Portfolio from './components/Portfolio';
import Trading from './components/Trading';
import Auth from './components/Auth';
import Chatbot from './components/Chatbot';
import AIAdvisor from './components/AIAdvisor';
import { MainView } from './types';

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [currentView, setCurrentView] = useState<MainView>(MainView.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    setUser(null);
    localStorage.removeItem('dak_tnt_user');
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
        return <Portfolio />;
      case MainView.TRADING:
        return <Trading />;
      case MainView.CHATBOT:
        return <Chatbot />;
      case MainView.AI_ADVISOR:
        return <AIAdvisor />;
      case MainView.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-[#eaecef]">
      <Sidebar activeView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col ml-[260px]">
        <Topbar 
          onHelpClick={() => setShowHelp(true)} 
          onProfileClick={() => setCurrentView(MainView.PROFILE)} 
          onLogout={handleLogout}
        />
        <main className="mt-[70px] p-4 flex-1 overflow-x-hidden flex flex-col">
          {renderMainContent()}
        </main>
      </div>

      {showHelp && (
        <HelpCenter onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
};

export default App;
