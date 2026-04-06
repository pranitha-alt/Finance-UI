import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";
import { Award, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const InsightsPanel = () => {
  const { transactions, formatAmount } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    const catSpend: Record<string, number> = {};
    expenses.forEach(t => { catSpend[t.category] = (catSpend[t.category] || 0) + t.amount; });
    const topCategory = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0];

    const months: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      if (t.type === "income") months[m].income += t.amount;
      else months[m].expense += t.amount;
    });
    const sortedMonths = Object.entries(months).sort(([a], [b]) => b.localeCompare(a));
    const currentMonth = sortedMonths[0];
    const prevMonth = sortedMonths[1];

    const result = [];

    if (topCategory) {
      result.push({
        icon: Award,
        title: "Highest spending category",
        description: `You spent this most on ${topCategory[0]}, totaling ${formatAmount(topCategory[1])} this month`,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-500",
      });
    }

    if (currentMonth && prevMonth) {
      const pctDiff = prevMonth[1].expense > 0
        ? Math.round(((currentMonth[1].expense - prevMonth[1].expense) / prevMonth[1].expense) * 100)
        : 0;
      const isUp = pctDiff > 0;
      result.push({
        icon: isUp ? TrendingUp : TrendingDown,
        title: "Spending this month",
        description: `You've spent ${Math.abs(pctDiff)}% ${isUp ? "more" : "less"} compared to the previous month`,
        iconBg: isUp ? "bg-red-50" : "bg-emerald-50",
        iconColor: isUp ? "text-red-500" : "text-emerald-500",
      });
    }

    result.push({
      icon: AlertTriangle,
      title: "Weekly spending alert",
      description: `You spent 18% more this week than last week`,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    });

    return result;
  }, [transactions, formatAmount]);

  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col border border-slate-200 shadow-sm transition-all duration-300">
      <h3 className="text-lg font-heading font-semibold text-slate-800 mb-0.5">Financial Insights</h3>
      <p className="text-sm text-slate-400 mb-5">Key observations</p>
      <div className="space-y-4 flex-1">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 items-start group hover:bg-slate-50 rounded-xl p-2.5 -mx-2.5 transition-colors cursor-default">
            <div className={`w-9 h-9 rounded-xl ${insight.iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
              <insight.icon className={`w-4 h-4 ${insight.iconColor}`} />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-700 text-sm">{insight.title}</h4>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium transition-colors border border-slate-200">
        View Detailed Insights
      </button>
    </div>
  );
};

export default InsightsPanel;
