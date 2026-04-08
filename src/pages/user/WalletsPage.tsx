import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Wallet as WalletIcon } from 'lucide-react';
import { mockWallets, formatCurrency, type Wallet } from '@/lib/mockData';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', balance: '', icon: '💵', color: '#2d8a9e' });

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

  const handleAdd = () => {
    setWallets(prev => [...prev, { id: Date.now().toString(), ...form, balance: parseFloat(form.balance) }]);
    setDialogOpen(false);
    setForm({ name: '', balance: '', icon: '💵', color: '#2d8a9e' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Wallets</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your wallets and balances</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Wallet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Wallet</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Wallet Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Cash, GCash" /></div>
              <div className="space-y-2"><Label>Initial Balance (₱)</Label><Input type="number" value={form.balance} onChange={e => setForm({ ...form, balance: e.target.value })} /></div>
              <div className="space-y-2"><Label>Icon</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="Emoji icon" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="gradient-teal text-primary-foreground">
        <CardContent className="p-6 text-center">
          <p className="text-primary-foreground/70 text-sm">Total Balance</p>
          <p className="text-4xl font-bold font-display mt-1">{formatCurrency(totalBalance)}</p>
          <p className="text-primary-foreground/60 text-sm mt-2">{wallets.length} wallets</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: wallet.color + '20' }}>
                  {wallet.icon}
                </div>
                <div>
                  <p className="font-semibold">{wallet.name}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
              <p className={`text-2xl font-bold font-display ${wallet.balance < 0 ? 'text-destructive' : ''}`}>
                {formatCurrency(wallet.balance)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
