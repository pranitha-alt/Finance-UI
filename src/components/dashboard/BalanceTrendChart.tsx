import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BalanceTrendChart = () => {
  const { transactions, currency } = useFinance();

  const chartData = useMemo(() => {
    const grouped: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };
      if (t.type === "income") grouped[month].income += t.amount;
      else grouped[month].expense += t.amount;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => ({
        month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        income: Math.round(d.income),
        expense: Math.round(d.expense),
      }));
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl p-6 h-full border border-slate-200 shadow-sm transition-all duration-300">
      <h3 className="text-lg font-heading font-semibold text-slate-800 mb-0.5">Balance Trend</h3>
      <p className="text-sm text-slate-400 mb-5">Monthly Income vs Expenses Trend</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 69%, 41%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(152, 69%, 41%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(16, 85%, 61%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(16, 85%, 61%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }} stroke="hsl(220 13% 91%)" />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220 9% 46%)" }} stroke="hsl(220 13% 91%)" tickFormatter={v => `${currency.symbol}${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: "12px", fontSize: 13, boxShadow: "0 8px 24px -4px hsl(220 30% 20% / 0.1)" }}
              formatter={(value, name) => {
                const amount = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                return [`${currency.symbol}${amount.toLocaleString()}`, name];
              }}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(152, 69%, 41%)" fill="url(#incGrad)" strokeWidth={2.5} name="Income" dot={{ r: 4, fill: "hsl(152, 69%, 41%)", strokeWidth: 2, stroke: "hsl(0 0% 100%)" }} />
            <Area type="monotone" dataKey="expense" stroke="hsl(16, 85%, 61%)" fill="url(#expGrad)" strokeWidth={2.5} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceTrendChart;
