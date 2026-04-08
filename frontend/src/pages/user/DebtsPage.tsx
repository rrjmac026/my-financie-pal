import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, DollarSign, User } from 'lucide-react';
import { formatCurrency, type Debt } from '@/lib/mockData';

const statusColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/30',
  partial: 'bg-info/10 text-info border-info/30',
  paid: 'bg-success/10 text-success border-success/30',
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [form, setForm] = useState<{ personName: string; amount: string; type: 'lent' | 'borrowed'; dueDate: string; notes: string }>({ personName: '', amount: '', type: 'lent', dueDate: '', notes: '' });

  useEffect(() => {
    const storedDebts = localStorage.getItem('debts');
    if (storedDebts) {
      try {
        setDebts(JSON.parse(storedDebts));
      } catch {
        // ignore invalid stored data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts));
  }, [debts]);

  const lent = debts.filter(d => d.type === 'lent');
  const borrowed = debts.filter(d => d.type === 'borrowed');

  const totalLent = lent.filter(d => d.status !== 'paid').reduce((s, d) => s + d.amount - d.paidAmount, 0);
  const totalBorrowed = borrowed.filter(d => d.status !== 'paid').reduce((s, d) => s + d.amount - d.paidAmount, 0);

  const openAdd = (type: 'lent' | 'borrowed') => {
    setForm({ personName: '', amount: '', type, dueDate: '', notes: '' });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const amount = parseFloat(form.amount);
    if (!form.personName.trim() || Number.isNaN(amount) || amount <= 0) {
      return;
    }

    setDebts(prev => [...prev, {
      id: Date.now().toString(),
      ...form,
      amount,
      status: 'pending',
      paidAmount: 0,
    }] );
    setDialogOpen(false);
  };

  const openPayment = (debt: Debt) => {
    setSelectedDebt(debt);
    setPaymentAmount('');
    setPaymentDialogOpen(true);
  };

  const handlePayment = () => {
    if (!selectedDebt) return;
    const payment = parseFloat(paymentAmount);
    setDebts(prev => prev.map(d => {
      if (d.id !== selectedDebt.id) return d;
      const newPaid = d.paidAmount + payment;
      const status = newPaid >= d.amount ? 'paid' : 'partial';
      return { ...d, paidAmount: newPaid, status } as Debt;
    }));
    setPaymentDialogOpen(false);
  };

  const DebtCard = ({ debt }: { debt: Debt }) => {
    const remaining = debt.amount - debt.paidAmount;
    const percent = (debt.paidAmount / debt.amount) * 100;
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{debt.personName}</p>
                <p className="text-xs text-muted-foreground">{debt.notes}</p>
              </div>
            </div>
            <Badge className={`text-xs ${statusColors[debt.status]}`}>{debt.status}</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-bold">{formatCurrency(debt.amount)}</span>
            </div>
            {debt.paidAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Paid</span>
                <span className="text-success">{formatCurrency(debt.paidAmount)}</span>
              </div>
            )}
            {debt.status !== 'paid' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-semibold">{formatCurrency(remaining)}</span>
              </div>
            )}
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Due: {debt.dueDate}</span>
              </div>
              {debt.status !== 'paid' && (
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openPayment(debt)}>
                  <DollarSign className="h-3 w-3 mr-1" />Record Payment
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display">Debt Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage money you lent and borrowed</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-success/30">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Owed to Me</p>
            <p className="text-2xl font-bold font-display text-success">{formatCurrency(totalLent)}</p>
            <p className="text-xs text-muted-foreground mt-1">{lent.filter(d => d.status !== 'paid').length} pending</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">I Owe</p>
            <p className="text-2xl font-bold font-display text-destructive">{formatCurrency(totalBorrowed)}</p>
            <p className="text-xs text-muted-foreground mt-1">{borrowed.filter(d => d.status !== 'paid').length} pending</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lent">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="lent">I Lent ({lent.length})</TabsTrigger>
            <TabsTrigger value="borrowed">I Borrowed ({borrowed.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lent" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openAdd('lent')} size="sm"><Plus className="h-4 w-4 mr-1" />Add Lent</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lent.map(d => <DebtCard key={d.id} debt={d} />)}
          </div>
        </TabsContent>

        <TabsContent value="borrowed" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => openAdd('borrowed')} size="sm"><Plus className="h-4 w-4 mr-1" />Add Borrowed</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowed.map(d => <DebtCard key={d.id} debt={d} />)}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add {form.type === 'lent' ? 'Lent' : 'Borrowed'} Record</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Person Name</Label><Input value={form.personName} onChange={e => setForm({ ...form, personName: e.target.value })} placeholder="Name" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Amount (₱)</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            {selectedDebt && (
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p><strong>{selectedDebt.personName}</strong></p>
                <p className="text-muted-foreground">Remaining: {formatCurrency(selectedDebt.amount - selectedDebt.paidAmount)}</p>
              </div>
            )}
            <div className="space-y-2"><Label>Payment Amount (₱)</Label><Input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePayment}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
