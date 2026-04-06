import { useState, useEffect } from "react";
import { useFinance, Transaction } from "@/context/FinanceContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["Salary", "Freelance", "Investment", "Food", "Transport", "Utilities", "Entertainment", "Health", "Shopping", "Housing", "Other"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editTransaction: Transaction | null;
}

const AddTransactionDialog = ({ open, onOpenChange, editTransaction }: Props) => {
  const { addTransaction, updateTransaction } = useFinance();
  const { toast } = useToast();
  const [form, setForm] = useState({ date: "", description: "", amount: "", category: "Other", type: "expense" as "income" | "expense" });

  useEffect(() => {
    if (editTransaction) {
      setForm({ date: editTransaction.date, description: editTransaction.description, amount: String(editTransaction.amount), category: editTransaction.category, type: editTransaction.type });
    } else {
      setForm({ date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "Other", type: "expense" });
    }
  }, [editTransaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.amount) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    const payload = { date: form.date, description: form.description, amount: parseFloat(form.amount), category: form.category, type: form.type };
    if (editTransaction) {
      updateTransaction(editTransaction.id, payload);
      toast({ title: "Transaction updated" });
    } else {
      addTransaction(payload);
      toast({ title: "Transaction added" });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{editTransaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="rounded-xl h-11" />
          <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl h-11" />
          <Input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="rounded-xl h-11" />
          <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
            <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as "income" | "expense" }))}>
            <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full rounded-xl h-11 gradient-primary text-primary-foreground font-semibold hover:opacity-90">
            {editTransaction ? "Save Changes" : "Add Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;