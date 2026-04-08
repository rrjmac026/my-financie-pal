import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Target } from 'lucide-react';
import { mockSavingsGoals, formatCurrency, type SavingsGoal } from '@/lib/mockData';

export default function SavingsGoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>(mockSavingsGoals);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', target: '', saved: '', deadline: '', icon: '🎯' });

  const handleAdd = () => {
    setGoals(prev => [...prev, { id: Date.now().toString(), ...form, target: parseFloat(form.target), saved: parseFloat(form.saved || '0') }]);
    setDialogOpen(false);
    setForm({ name: '', target: '', saved: '', deadline: '', icon: '🎯' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Savings Goals</h1>
          <p className="text-muted-foreground text-sm mt-1">Track progress towards your financial goals</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Savings Goal</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Goal Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., New Laptop" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Target Amount (₱)</Label><Input type="number" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} /></div>
                <div className="space-y-2"><Label>Already Saved (₱)</Label><Input type="number" value={form.saved} onChange={e => setForm({ ...form, saved: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></div>
                <div className="space-y-2"><Label>Icon</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percent = Math.min((goal.saved / goal.target) * 100, 100);
          const isComplete = percent >= 100;
          return (
            <Card key={goal.id} className={`hover:shadow-md transition-shadow ${isComplete ? 'border-success/50' : ''}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {goal.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{goal.name}</p>
                      <p className="text-xs text-muted-foreground">Deadline: {goal.deadline}</p>
                    </div>
                  </div>
                  {isComplete ? (
                    <Badge className="bg-success/10 text-success border-success/30">Complete!</Badge>
                  ) : (
                    <Badge variant="secondary">{percent.toFixed(0)}%</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saved: {formatCurrency(goal.saved)}</span>
                    <span className="font-medium">{formatCurrency(goal.target)}</span>
                  </div>
                  <Progress value={percent} className={`h-2.5 ${isComplete ? '[&>div]:bg-success' : ''}`} />
                  {!isComplete && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(goal.target - goal.saved)} more to go
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
