import { useFinance, type Transaction } from "@/context/FinanceContext";
import { useMemo, useState } from "react";
import { Search, Filter, ArrowUpDown, Plus, Pencil, Trash2, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddTransactionDialog from "./AddTransactionDialog";

const CATEGORY_COLORS: Record<string, string> = {
  Salary: "text-emerald-500", Freelance: "text-teal-500", Food: "text-amber-500", Utilities: "text-blue-500",
  Entertainment: "text-orange-500", Transport: "text-red-500", Investment: "text-emerald-600",
  Health: "text-cyan-500", Shopping: "text-purple-500", Housing: "text-teal-600",
};

const TransactionList = () => {
  const {
    transactions, role, isLoggedIn, deleteTransaction, currency,
    filterCategory, setFilterCategory, filterType, setFilterType,
    searchQuery, setSearchQuery, sortField, setSortField, sortDirection, setSortDirection,
  } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const categories = useMemo(() => Array.from(new Set(transactions.map(t => t.category))).sort(), [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterCategory !== "all") list = list.filter(t => t.category === filterCategory);
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const av = a[sortField]; const bv = b[sortField];
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return list;
  }, [transactions, filterCategory, filterType, searchQuery, sortField, sortDirection]);

  const isAdmin = role === "admin" && isLoggedIn;

  const toggleSort = (field: keyof Transaction) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("desc"); }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300" style={{ animation: "fadeInUp 0.5s ease-out 0.3s both" }}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-heading font-semibold text-slate-800">Transactions</h3>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 p-0.5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                role === "viewer" ? "bg-teal-500 text-white shadow-sm" : "text-slate-400"
              }`}>Viewer</span>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                isAdmin ? "bg-teal-500 text-white shadow-sm" : "text-slate-400"
              }`}>Admin</span>
            </div>
          </div>
          {isAdmin && (
            <Button onClick={() => { setEditTx(null); setDialogOpen(true); }}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl gap-2 hover:opacity-90 shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add Transaction
            </Button>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search transactions..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-40 rounded-xl h-10 bg-slate-50 border-slate-200">
              <Filter className="w-3.5 h-3.5 mr-2 text-slate-400" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl h-10 bg-slate-50 border-slate-200">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {(["date", "description", "category", "type", "amount"] as (keyof Transaction)[]).map(field => (
                <th key={field} onClick={() => toggleSort(field)}
                  className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-600 transition-colors select-none">
                  <span className="inline-flex items-center gap-1.5">
                    {field} {sortField === field && <ArrowUpDown className="w-3 h-3 text-teal-500" />}
                  </span>
                </th>
              ))}
              {isAdmin && <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={isAdmin ? 6 : 5} className="text-center py-16 text-slate-400">No transactions found</td></tr>
            ) : filtered.map(tx => (
              <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 text-slate-400 whitespace-nowrap text-xs">
                  {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${tx.type === "income" ? "bg-emerald-50" : "bg-orange-50"} flex items-center justify-center text-xs font-bold ${tx.type === "income" ? "text-emerald-500" : "text-orange-500"}`}>
                      {tx.description.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700">{tx.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-medium ${CATEGORY_COLORS[tx.category] || "text-slate-400"}`}>● {tx.category}</span>
                    {tx.amount > 1000 && tx.type === "expense" && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-500">Large Expense</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                  }`}>
                    {tx.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold whitespace-nowrap tabular-nums ${tx.type === "income" ? "text-emerald-500" : "text-red-500"}`}>
                  {tx.type === "income" ? "+" : "-"}{currency.symbol}{tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-teal-50 hover:text-teal-600" onClick={() => { setEditTx(tx); setDialogOpen(true); }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100 hover:text-slate-600">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500" onClick={() => deleteTransaction(tx.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} editTransaction={editTx} />
    </div>
  );
};

export default TransactionList;
