
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
