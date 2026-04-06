import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

export type UserRole = "admin" | "viewer";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", flag: "🇨🇭" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", flag: "🇰🇷" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", flag: "🇧🇷" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", flag: "🇲🇽" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", flag: "🇸🇪" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "THB", symbol: "฿", name: "Thai Baht", flag: "🇹🇭" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", flag: "🇷🇺" },
];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

interface FinanceState {
  role: UserRole;
  setRole: (r: UserRole) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  currency: CurrencyInfo;
  setCurrency: (c: CurrencyInfo) => void;
  formatAmount: (amount: number) => string;
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filterCategory: string;
  setFilterCategory: (c: string) => void;
  filterType: string;
  setFilterType: (t: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortField: keyof Transaction;
  setSortField: (f: keyof Transaction) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (d: "asc" | "desc") => void;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "t1", date: "2026-03-28", description: "Freelance Web Project", amount: 4200, category: "Freelance", type: "income" },
  { id: "t2", date: "2026-03-27", description: "Grocery Shopping", amount: 156.80, category: "Food", type: "expense" },
  { id: "t3", date: "2026-03-26", description: "Monthly Salary", amount: 6500, category: "Salary", type: "income" },
  { id: "t4", date: "2026-03-25", description: "Electric Bill", amount: 142.50, category: "Utilities", type: "expense" },
  { id: "t5", date: "2026-03-24", description: "Netflix Subscription", amount: 15.99, category: "Entertainment", type: "expense" },
  { id: "t6", date: "2026-03-23", description: "Uber Rides", amount: 48.30, category: "Transport", type: "expense" },
  { id: "t7", date: "2026-03-22", description: "Stock Dividends", amount: 320, category: "Investment", type: "income" },
  { id: "t8", date: "2026-03-21", description: "Restaurant Dinner", amount: 89.00, category: "Food", type: "expense" },
  { id: "t9", date: "2026-03-20", description: "Gym Membership", amount: 45, category: "Health", type: "expense" },
  { id: "t10", date: "2026-03-19", description: "Online Course Sale", amount: 1200, category: "Freelance", type: "income" },
  { id: "t11", date: "2026-03-18", description: "Internet Bill", amount: 79.99, category: "Utilities", type: "expense" },
  { id: "t12", date: "2026-03-17", description: "Coffee & Snacks", amount: 23.50, category: "Food", type: "expense" },
  { id: "t13", date: "2026-03-15", description: "Clothing Purchase", amount: 210, category: "Shopping", type: "expense" },
  { id: "t14", date: "2026-03-12", description: "Consulting Fee", amount: 1800, category: "Freelance", type: "income" },
  { id: "t15", date: "2026-03-10", description: "Gas Station", amount: 62, category: "Transport", type: "expense" },
  { id: "t16", date: "2026-02-28", description: "Monthly Salary", amount: 6500, category: "Salary", type: "income" },
  { id: "t17", date: "2026-02-25", description: "Rent Payment", amount: 1800, category: "Housing", type: "expense" },
  { id: "t18", date: "2026-02-20", description: "Freelance Design", amount: 2100, category: "Freelance", type: "income" },
  { id: "t19", date: "2026-02-15", description: "Grocery Run", amount: 198.40, category: "Food", type: "expense" },
  { id: "t20", date: "2026-02-10", description: "Medical Checkup", amount: 250, category: "Health", type: "expense" },
];

const FinanceContext = createContext<FinanceState | null>(null);

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be inside FinanceProvider");
  return ctx;
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("viewer");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currency, setCurrency] = useState<CurrencyInfo>(CURRENCIES[0]);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const formatAmount = useCallback((amount: number) => {
    return `${currency.symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions(prev => [{ ...t, id: `t${Date.now()}` }, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = useMemo(() => ({
    role, setRole, isLoggedIn, setIsLoggedIn,
    currency, setCurrency, formatAmount,
    transactions, addTransaction, updateTransaction, deleteTransaction,
    filterCategory, setFilterCategory, filterType, setFilterType,
    searchQuery, setSearchQuery, sortField, setSortField, sortDirection, setSortDirection,
  }), [role, isLoggedIn, currency, formatAmount, transactions, filterCategory, filterType, searchQuery, sortField, sortDirection, addTransaction, updateTransaction, deleteTransaction]);

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
