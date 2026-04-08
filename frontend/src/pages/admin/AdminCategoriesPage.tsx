import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/mockData';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', icon: '', color: '#2d8a9e' });

  const openAdd = () => { setEditId(null); setForm({ name: '', icon: '', color: '#2d8a9e' }); setDialogOpen(true); };
  const openEdit = (c: typeof categories[0]) => { setEditId(c.id); setForm({ name: c.name, icon: c.icon, color: c.color }); setDialogOpen(true); };

  const handleSave = () => {
    if (editId) {
      setCategories(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCategories(prev => [...prev, { id: Date.now().toString(), ...form }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage default expense categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Icon (emoji)</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
                <div className="space-y-2"><Label>Color</Label><Input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: cat.color + '20' }}>{cat.icon}</div>
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <div className="flex items-center gap-1 mt-0.5"><div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} /><span className="text-xs text-muted-foreground">{cat.color}</span></div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
