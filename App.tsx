
import React, { useState } from 'react';
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
import { MainView } from './types';

const App: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [currentView, setCurrentView] = useState<MainView>(MainView.DASHBOARD);

  const renderMainContent = () => {
    switch (currentView) {
      case MainView.FEED:
        return <Feed />;
      case MainView.WALLET:
        return <Wallet />;
      case MainView.PROFILE:
        return <Profile />;
      case MainView.HISTORY:
        return <TransactionHistory />;
      case MainView.PORTFOLIO:
        return <Portfolio />;
      case MainView.TRADING:
        return <Trading />;
      case MainView.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0e11] text-[#eaecef]">
      <Sidebar activeView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col ml-[260px]">
        <Topbar 
          onHelpClick={() => setShowHelp(true)} 
          onProfileClick={() => setCurrentView(MainView.PROFILE)} 
        />
        <main className="mt-[70px] p-4 flex-1 overflow-x-hidden">
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
