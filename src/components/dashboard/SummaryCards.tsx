import { useFinance } from "@/context/FinanceContext";
import { Wallet, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMemo, useState } from "react";

const SummaryCards = () => {
  const { transactions, formatAmount } = useFinance();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { balance: totalIncome - totalExpense, income: totalIncome, expenses: totalExpense, txCount: transactions.length };
  }, [transactions]);

  const incomeTransactions = useMemo(() => transactions.filter((t) => t.type === "income"), [transactions]);
  const expenseTransactions = useMemo(() => transactions.filter((t) => t.type === "expense"), [transactions]);

  const cards = [
    { id: "balance", label: "Total Balance", value: formatAmount(stats.balance), sub: "Net Balance", icon: Wallet, iconBg: "bg-gradient-to-br from-teal-500 to-cyan-600", shadowColor: "hsl(174 62% 47% / 0.2)" },
    { id: "income", label: "Total Income", value: formatAmount(stats.income), change: "+8.2%", up: true, icon: TrendingUp, iconBg: "bg-gradient-to-br from-emerald-500 to-green-600", shadowColor: "hsl(152 69% 41% / 0.2)" },
    { id: "expenses", label: "Total Expenses", value: formatAmount(stats.expenses), change: "-5.3%", up: false, icon: TrendingDown, iconBg: "bg-gradient-to-br from-orange-500 to-red-500", shadowColor: "hsl(16 85% 61% / 0.2)" },
    { id: "transactions", label: "Transactions", value: String(stats.txCount), icon: CreditCard, iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600", shadowColor: "hsl(217 91% 60% / 0.2)" },
  ];

  const getHoverList = (id: string) => {
    if (id === "income") return incomeTransactions;
    if (id === "expenses") return expenseTransactions;
    return null;
  };

  const toggleCard = (id: string, isInteractive: boolean) => {
    if (!isInteractive) return;
    setActiveCard((current) => (current === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map(({ id, label, value, sub, change, up, icon: Icon, iconBg, shadowColor }, i) => {
        const hoverList = getHoverList(id);
        const isInteractive = Boolean(hoverList?.length);
        const isOpen = activeCard === id;

        return (
          <div
            key={label}
            className="relative"
            onMouseEnter={() => isInteractive && setActiveCard(id)}
            onMouseLeave={() => isInteractive && setActiveCard(null)}
          >
            <div
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : -1}
              aria-expanded={isInteractive ? isOpen : undefined}
              className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all duration-300 group ${isInteractive ? "cursor-pointer hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500/40" : "cursor-default hover:shadow-md hover:scale-[1.02]"}`}
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}
              onClick={() => toggleCard(id, isInteractive)}
              onFocus={() => isInteractive && setActiveCard(id)}
              onBlur={() => isInteractive && setActiveCard(null)}
              onKeyDown={(event) => {
                if (!isInteractive) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  toggleCard(id, isInteractive);
                }
                if (event.key === "Escape") {
                  setActiveCard(null);
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500 font-medium">{label}</span>
                <div
                  className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  style={{ boxShadow: `0 6px 16px -2px ${shadowColor}` }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-heading font-bold text-slate-800 mb-1">{value}</p>
              {sub && <p className="text-xs text-slate-400">{sub}</p>}
              {change && (
                <div className="flex items-center gap-1 mt-1">
                  {up ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                  <span className={`text-xs font-bold ${up ? "text-emerald-500" : "text-red-500"}`}>{change}</span>
                </div>
              )}
            </div>

            {isOpen && hoverList && hoverList.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-white border border-slate-200 shadow-xl p-3 max-h-56 overflow-y-auto"
                style={{ animation: "slideDown 0.15s ease-out", minWidth: "260px" }}
              >
                <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                  {id === "income" ? "Income Sources" : "Where Money Got Reduced"}
                </p>
                <div className="space-y-1.5">
                  {hoverList.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{tx.description}</p>
                        <p className="text-xs text-slate-400">{tx.category} · {tx.date}</p>
                      </div>
                      <span className={`text-sm font-bold ml-3 ${id === "income" ? "text-emerald-500" : "text-red-500"}`}>
                        {id === "income" ? "+" : "-"}{formatAmount(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
