import { useNavigate } from "react-router-dom";
import { useFinance, CURRENCIES } from "@/context/FinanceContext";
import type { CurrencyInfo } from "@/context/FinanceContext";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingBreakdownChart from "@/components/dashboard/SpendingBreakdownChart";
import TransactionList from "@/components/dashboard/TransactionList";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { LogOut, Shield, Eye, ChevronDown } from "lucide-react";
import { useState } from "react";
import finvistaLogo from "@/assets/finvista-logo.png";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { role, isLoggedIn, setIsLoggedIn, setRole, currency, setCurrency } = useFinance();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("viewer");
    navigate("/");
  };

  const filteredCurrencies = CURRENCIES.filter(c =>
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleCurrencySelect = (c: CurrencyInfo) => {
    setCurrency(c);
    setCurrencyOpen(false);
    setCurrencySearch("");
  };

  const isAdmin = role === "admin" && isLoggedIn;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20">
      {/* Subtle glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 15% 10%, hsl(174 62% 47% / 0.06) 0%, transparent 55%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 85% 80%, hsl(262 52% 55% / 0.04) 0%, transparent 55%)" }} />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-sm" style={{ borderBottom: "1px solid hsl(220 13% 91%)" }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-5 md:px-8 h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => navigate("/")}>
            <img src={finvistaLogo} alt="FinVista" className="w-9 h-9 rounded-xl" width={36} height={36} />
            <span className="text-lg font-heading font-bold text-slate-800 group-hover:text-teal-600 transition-colors">FinVista</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Currency */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors border border-slate-200"
              >
                <span className="text-base leading-none">{currency.flag}</span>
                <span>{currency.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
              </button>
              {currencyOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setCurrencyOpen(false); setCurrencySearch(""); }} />
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white backdrop-blur-xl border border-slate-200 shadow-2xl z-50 overflow-hidden" style={{ animation: "slideDown 0.2s ease-out" }}>
                    <div className="p-3 border-b border-slate-100">
                      <input
                        type="text" placeholder="Search currency..." value={currencySearch}
                        onChange={e => setCurrencySearch(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/30 transition-shadow"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1.5">
                      {filteredCurrencies.map(c => (
                        <button key={c.code} onClick={() => handleCurrencySelect(c)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                            currency.code === c.code ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-xl leading-none">{c.flag}</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold">{c.code}</span>
                            <span className="text-slate-400 ml-2 text-xs">{c.name}</span>
                          </div>
                          <span className="text-slate-400 text-xs font-mono">{c.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Role badge */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm">
              {isAdmin ? <Shield className="w-3.5 h-3.5 text-teal-600" /> : <Eye className="w-3.5 h-3.5 text-blue-500" />}
              <span className="font-semibold capitalize text-slate-700">{role}</span>
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:shadow-lg transition-shadow">
                {isAdmin ? "A" : "V"}
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white border border-slate-200 shadow-xl z-50 p-1.5" style={{ animation: "slideDown 0.15s ease-out" }}>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <LogOut className="w-4 h-4 text-slate-400" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-8 py-8 space-y-7">
        {/* Header */}
        <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800">
            {isAdmin ? "Welcome back, Admin" : "Financial Overview"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isAdmin ? "Here's your financial overview for today." : "View-only mode — browse your financial data."}
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <BalanceTrendChart />
          </div>
          <div className="lg:col-span-4">
            <SpendingBreakdownChart />
          </div>
          <div className="lg:col-span-3">
            <InsightsPanel />
          </div>
        </div>

        {/* Transactions */}
        <TransactionList />
      </main>
    </div>
  );
};

export default DashboardPage;
