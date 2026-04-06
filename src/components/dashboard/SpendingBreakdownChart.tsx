import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PALETTE = [
  "hsl(174, 62%, 47%)", "hsl(16, 85%, 61%)", "hsl(217, 91%, 60%)",
  "hsl(152, 69%, 41%)", "hsl(38, 92%, 50%)", "hsl(340, 82%, 52%)",
  "hsl(262, 52%, 47%)", "hsl(190, 74%, 52%)", "hsl(0, 72%, 51%)",
];

const SpendingBreakdownChart = () => {
  const { transactions, currency } = useFinance();

  const data = useMemo(() => {
    const cats: Record<string, number> = {};
    const total = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    transactions.filter(t => t.type === "expense").forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100, pct: total > 0 ? ((value / total) * 100).toFixed(1) : "0" }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl p-6 h-full border border-slate-200 shadow-sm transition-all duration-300">
      <h3 className="text-lg font-heading font-semibold text-slate-800 mb-0.5">Spending Breakdown</h3>
      <p className="text-sm text-slate-400 mb-4">Expenses by Category</p>
      {data.length === 0 ? (
        <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No expense data</div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="w-[140px] h-[140px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} dataKey="value">
                  {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    const displayValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                    return [`${currency.symbol}${displayValue.toLocaleString()}`, name];
                  }}
                  contentStyle={{ background: "hsl(0 0% 100%)", borderRadius: "12px", fontSize: 12, border: "1px solid hsl(220 13% 91%)", boxShadow: "0 8px 24px -4px hsl(220 30% 20% / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2.5 min-w-0">
            {data.slice(0, 5).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2.5 text-sm group">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
                <span className="text-slate-700 truncate flex-1 font-medium">{item.name}</span>
                <span className="text-slate-400 text-xs tabular-nums">{currency.symbol}{item.value.toLocaleString()}</span>
                <span className="text-slate-400 text-xs tabular-nums w-10 text-right">{item.pct}%</span>
              </div>
            ))}
            {data.length > 5 && (
              <p className="text-slate-400 text-xs pl-5">+{data.length - 5} more</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingBreakdownChart;
