
export enum HelpView {
  LANDING = 'LANDING',
  BUG_REPORT = 'BUG_REPORT',
  SUPPORT_REQUEST = 'SUPPORT_REQUEST',
  MY_TICKETS = 'MY_TICKETS',
  FAQ = 'FAQ',
  USER_GUIDE = 'USER_GUIDE',
  ARTICLE_VIEW = 'ARTICLE_VIEW'
}

export enum MainView {
  DASHBOARD = 'Dashboard',
  FEED = 'Feed',
  TRADING = 'Giao dịch',
  PORTFOLIO = 'Danh mục',
  AI_ADVISOR = 'AI Advisor',
  WALLET = 'Ví',
  PROFILE = 'Hồ sơ',
  HISTORY = 'Lịch sử',
  CHATBOT = 'Trợ lý AI'
}

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LIMIT';
export type OrderStatus = 'New' | 'Partially Filled' | 'Filled' | 'Cancelled' | 'Rejected' | 'Expired';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  quantity: number;
  filledQuantity: number;
  status: OrderStatus;
  time: string;
  tif: 'GTC' | 'DAY';
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  value: number;
  weight: number;
  sector: string;
}

export interface EquityPoint {
  date: string;
  value: number;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  status: 'Open' | 'Pending' | 'Resolved';
  date: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  isFaq: boolean;
}

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  category: 'Tin tức' | 'Phân tích';
  author: string;
  time: string;
  reward: number;
  read: boolean;
  image?: string;
}

export interface Mission {
  id: string;
  level: number;
  title: string;
  description: string;
  moneyReward: number;
  xpReward: number;
  progress: number;
  status: 'Locked' | 'Available' | 'InProgress' | 'Completed';
  category: 'Tiền tệ' | 'Đầu tư' | 'Tiết kiệm' | 'Giao dịch';
}

export interface WalletTransaction {
  time: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRADE' | 'REWARD';
  note: string;
  amount: number;
  balanceAfter: number;
}

export interface TradeTransaction {
  id: string;
  time: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  side: string;
  price: number;
  quantity: number;
  total: number;
  fee: number;
  status: 'Filled' | 'Cancelled' | 'Partially Filled';
}
