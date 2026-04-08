import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, AlertTriangle } from 'lucide-react';
import { CATEGORIES, formatCurrency } from '@/lib/mockData';

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

const initialBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 5000, spent: 1530 },
  { id: '2', category: 'Transportation', limit: 3000, spent: 150 },
  { id: '3', category: 'Shopping', limit: 4000, spent: 2500 },
  { id: '4', category: 'Bills & Utilities', limit: 8000, spent: 5300 },
  { id: '5', category: 'Entertainment', limit: 2000, spent: 350 },
  { id: '6', category: 'Health', limit: 2000, spent: 500 },
];

export default function BudgetsPage() {
  const [monthlyBudget, setMonthlyBudget] = useState(30000);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: '', limit: '' });

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overallPercent = Math.min((totalSpent / monthlyBudget) * 100, 100);

  const openEdit = (b: Budget) => {
    setEditId(b.id);
    setForm({ category: b.category, limit: b.limit.toString() });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ category: CATEGORIES[0].name, limit: '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editId) {
      setBudgets(prev => prev.map(b => b.id === editId ? { ...b, limit: parseFloat(form.limit) } : b));
    } else {
      setBudgets(prev => [...prev, { id: Date.now().toString(), category: form.category, limit: parseFloat(form.limit), spent: 0 }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Budgets</h1>
          <p className="text-muted-foreground text-sm mt-1">Set and track your spending limits</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Settings2 className="h-4 w-4 mr-2" />Add Budget</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit Budget' : 'Set Category Budget'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })} disabled={!!editId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.name}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Limit (₱)</Label>
                <Input type="number" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="gradient-ocean text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <p className="text-primary-foreground/70 text-sm">Monthly Budget</p>
              <p className="text-3xl font-bold font-display">{formatCurrency(monthlyBudget)}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/70 text-sm">Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
          <Progress value={overallPercent} className="h-3 bg-primary-foreground/20" />
          <div className="flex justify-between mt-2 text-xs text-primary-foreground/70">
            <span>{overallPercent.toFixed(0)}% used</span>
            <span>{formatCurrency(monthlyBudget - totalSpent)} remaining</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => {
          const percent = Math.min((budget.spent / budget.limit) * 100, 100);
          const isWarning = percent >= 80;
          const isOver = percent >= 100;
          const cat = CATEGORIES.find(c => c.name === budget.category);
          return (
            <Card key={budget.id} className={`hover:shadow-md transition-shadow ${isOver ? 'border-destructive/50' : isWarning ? 'border-warning/50' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat?.icon}</span>
                    <span className="font-semibold text-sm">{budget.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isWarning && <AlertTriangle className="h-4 w-4 text-warning" />}
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(budget)}>
                      <Settings2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{formatCurrency(budget.spent)}</span>
                  <span className="font-medium">{formatCurrency(budget.limit)}</span>
                </div>
                <Progress value={percent} className={`h-2 ${isOver ? '[&>div]:bg-destructive' : isWarning ? '[&>div]:bg-warning' : ''}`} />
                <p className={`text-xs mt-2 ${isOver ? 'text-destructive' : isWarning ? 'text-warning' : 'text-muted-foreground'}`}>
                  {isOver ? `Over budget by ${formatCurrency(budget.spent - budget.limit)}` : `${formatCurrency(budget.limit - budget.spent)} remaining`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
