import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance, CURRENCIES } from "@/context/FinanceContext";
import type { CurrencyInfo } from "@/context/FinanceContext";
import { Shield, Eye, TrendingUp, DollarSign, BarChart3, ArrowRight, Globe, ChevronDown, Sparkles, PieChart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();
  const { setRole, currency, setCurrency } = useFinance();
  const [showRoles, setShowRoles] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");

  const handleAdminClick = () => {
    setRole("admin");
    navigate("/login");
  };

  const handleViewerClick = () => {
    setRole("viewer");
    navigate("/dashboard");
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

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] gradient-primary blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-[450px] h-[450px] rounded-full opacity-[0.06] gradient-accent blur-3xl top-1/3 -right-40 animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full opacity-[0.05] bg-info blur-3xl bottom-10 left-1/4 animate-pulse" style={{ animationDelay: "4s" }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100%) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-hero-foreground tracking-tight">FinVista</span>
        </div>

        {/* Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-card text-hero-foreground text-sm font-medium hover:bg-hero-foreground/[0.08] transition-colors"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-lg leading-none">{currency.flag}</span>
            <span>{currency.code}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform text-hero-foreground/50 ${currencyOpen ? "rotate-180" : ""}`} />
          </button>

          {currencyOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setCurrencyOpen(false); setCurrencySearch(""); }} />
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-card border border-border shadow-2xl z-50 overflow-hidden" style={{ animation: "scaleIn 0.2s ease-out" }}>
                <div className="p-3 border-b border-border">
                  <input
                    type="text"
                    placeholder="Search currency..."
                    value={currencySearch}
                    onChange={e => setCurrencySearch(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-muted text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </div>
                <div className="max-h-64 overflow-y-auto p-1.5">
                  {filteredCurrencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => handleCurrencySelect(c)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                        currency.code === c.code ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-xl leading-none">{c.flag}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold">{c.code}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{c.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs font-mono">{c.symbol}</span>
                    </button>
                  ))}
                  {filteredCurrencies.length === 0 && (
                    <p className="text-center text-muted-foreground text-sm py-6">No currencies found</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        {!showRoles ? (
          /* Landing View */
          <div className="flex flex-col items-center" style={{ animation: "fadeInUp 0.8s ease-out" }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-hero-foreground/70 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              Intelligent Financial Dashboard
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-hero-foreground leading-tight mb-6 text-center max-w-4xl">
              Take Control of
              <span className="block bg-clip-text text-transparent mt-1" style={{ backgroundImage: "var(--gradient-primary)" }}>
                Your Finances
              </span>
            </h1>

            <p className="text-base md:text-lg text-hero-foreground/45 max-w-lg mx-auto leading-relaxed text-center mb-10">
              Track every transaction, uncover spending patterns, and make smarter financial decisions with real-time analytics.
            </p>

            {/* Selected currency display */}
            <div className="flex items-center gap-2 mb-8 text-hero-foreground/40 text-sm">
              <span>Currency:</span>
              <span className="text-lg">{currency.flag}</span>
              <span className="text-hero-foreground/70 font-medium">{currency.code} ({currency.symbol})</span>
            </div>

            <Button
              onClick={() => setShowRoles(true)}
              className="gradient-primary text-primary-foreground px-10 py-6 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-300 gap-2.5"
            >
              <Zap className="w-5 h-5" />
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-14 opacity-70" style={{ animation: "fadeInUp 1s ease-out 0.4s both" }}>
              {[
                { icon: BarChart3, label: "Live Analytics" },
                { icon: PieChart, label: "Smart Insights" },
                { icon: TrendingUp, label: "Trend Tracking" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-hero-foreground/50 text-xs font-medium">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Role Selection View */
          <div className="w-full max-w-2xl" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <button
              onClick={() => setShowRoles(false)}
              className="flex items-center gap-2 text-hero-foreground/40 hover:text-hero-foreground/70 transition-colors text-sm mb-8"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back
            </button>

            <h2 className="text-2xl md:text-3xl font-heading font-bold text-hero-foreground text-center mb-3">
              Choose Your Role
            </h2>
            <p className="text-hero-foreground/40 text-center mb-10 text-sm">
              Select how you'd like to access the dashboard
            </p>

            <div className="flex flex-col md:flex-row gap-6 perspective-1000">
              {/* Admin Card */}
              <button
                onClick={handleAdminClick}
                className="flex-1 preserve-3d card-3d group cursor-pointer rounded-2xl p-7 glass-card hover:shadow-2xl transition-all duration-500 text-left border border-primary/20 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-hero-foreground mb-2">Admin Access</h3>
                <p className="text-hero-foreground/40 text-sm mb-5 leading-relaxed">
                  Full control — add, edit, and manage all transactions and financial records.
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                  Sign in to Continue <ArrowRight className="w-4 h-4" />
                </div>
                <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />
              </button>

              {/* Viewer Card */}
              <button
                onClick={handleViewerClick}
                className="flex-1 preserve-3d card-3d group cursor-pointer rounded-2xl p-7 glass-card hover:shadow-2xl transition-all duration-500 text-left border border-accent/20 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                  <Eye className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-hero-foreground mb-2">Viewer Access</h3>
                <p className="text-hero-foreground/40 text-sm mb-5 leading-relaxed">
                  Read-only mode — explore analytics, transactions, and spending insights.
                </p>
                <div className="flex items-center gap-2 text-accent text-sm font-semibold group-hover:gap-3 transition-all">
                  Browse Dashboard <ArrowRight className="w-4 h-4" />
                </div>
                <div className="shimmer absolute inset-0 rounded-2xl pointer-events-none" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
