import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { expensesApi, type Expense } from '@/lib/api';
import { CATEGORIES, PAYMENT_METHODS, formatCurrency } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ amount: '', category: CATEGORIES[0].name, date: new Date().toISOString().split('T')[0], description: '', paymentMethod: 'Cash' });

  useEffect(() => {
    expensesApi.getAll()
      .then(setExpenses)
      .catch(() => toast({ title: 'Error', description: 'Failed to load expenses', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const filtered = expenses.filter(e => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterPayment !== 'all' && e.paymentMethod !== filterPayment) return false;
    return true;
  });

  const getId = (e: Expense) => e._id || e.id || '';

  const openAdd = () => {
    setEditingExpense(null);
    setForm({ amount: '', category: CATEGORIES[0].name, date: new Date().toISOString().split('T')[0], description: '', paymentMethod: 'Cash' });
    setDialogOpen(true);
  };

  const openEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setForm({ amount: exp.amount.toString(), category: exp.category, date: exp.date, description: exp.description, paymentMethod: exp.paymentMethod });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editingExpense) {
        const updated = await expensesApi.update(getId(editingExpense), payload);
        setExpenses(prev => prev.map(e => getId(e) === getId(editingExpense) ? updated : e));
        toast({ title: 'Updated', description: 'Expense updated successfully' });
      } else {
        const created = await expensesApi.create(payload);
        setExpenses(prev => [created, ...prev]);
        toast({ title: 'Added', description: 'Expense added successfully' });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to save expense', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await expensesApi.delete(id);
      setExpenses(prev => prev.filter(e => getId(e) !== id));
      toast({ title: 'Deleted', description: 'Expense deleted' });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete expense', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Expenses</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage your expenses</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What did you spend on?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (₱)</Label>
                  <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.name}>{c.icon} {c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={form.paymentMethod} onValueChange={v => setForm({ ...form, paymentMethod: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PAYMENT_METHODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editingExpense ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Payment" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {PAYMENT_METHODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((exp) => (
                    <TableRow key={getId(exp)}>
                      <TableCell className="text-sm text-muted-foreground">{exp.date}</TableCell>
                      <TableCell className="font-medium">{exp.description}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{exp.category}</Badge></TableCell>
                      <TableCell className="text-sm">{exp.paymentMethod}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(exp.amount)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(exp)}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(getId(exp))}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No expenses found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total ({filtered.length} expenses)</span>
            <span className="font-bold text-lg">{formatCurrency(filtered.reduce((s, e) => s + e.amount, 0))}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}