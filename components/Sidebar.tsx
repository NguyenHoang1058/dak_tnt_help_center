
import React from 'react';
import { COLORS } from '../constants';
import { MainView } from '../types';

interface SidebarProps {
  activeView: MainView;
  onNavigate: (view: MainView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const menuItems = [
    { icon: 'bi-speedometer2', label: MainView.DASHBOARD },
    { icon: 'bi-rss-fill', label: MainView.FEED },
    { icon: 'bi-arrow-left-right', label: MainView.TRADING },
    { icon: 'bi-briefcase-fill', label: MainView.PORTFOLIO },
    { icon: 'bi-clock-history', label: MainView.HISTORY },
    { icon: 'bi-stars', label: MainView.AI_ADVISOR },
    { icon: 'bi-wallet-fill', label: MainView.WALLET },
    { icon: 'bi-person-circle', label: MainView.PROFILE },
  ];

  return (
    <aside className="fixed left-0 top-0 w-[260px] h-screen bg-[#1e2329] border-r border-[#2b3139] z-[1000] py-6">
      <div className="px-6 mb-8 border-b border-[#2b3139] pb-6">
        <h1 className="flex items-center gap-2 text-[24px] font-bold" style={{ color: COLORS.yellow }}>
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
          DAK.TNT
        </h1>
      </div>
      
      <nav className="space-y-1">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(item.label)}
            className={`px-6 py-3 flex items-center gap-3 cursor-pointer transition-all duration-200 ${
              activeView === item.label 
                ? 'bg-[#2b3139] border-l-4 border-[#f0b90b] text-[#f0b90b]' 
                : 'text-[#848e9c] hover:bg-[#2b3139] hover:text-[#eaecef]'
            }`}
          >
            <i className={`bi ${item.icon} text-xl ${activeView === item.label ? 'text-[#f0b90b]' : ''}`}></i>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
