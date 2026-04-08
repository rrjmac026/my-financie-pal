import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', active: true });

  const handleAdd = () => {
    setAnnouncements(prev => [{ id: Date.now().toString(), ...form, date: new Date().toISOString().split('T')[0] }, ...prev]);
    setDialogOpen(false);
    setForm({ title: '', message: '', active: true });
  };

  const toggleActive = (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  const deleteAnn = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display">Announcements</h1>
          <p className="text-muted-foreground text-sm mt-1">Post announcements visible to all users</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New Announcement</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Message</Label><Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={handleAdd}>Post</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {announcements.map(ann => (
          <Card key={ann.id} className={`hover:shadow-md transition-shadow ${!ann.active ? 'opacity-60' : ''}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Megaphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{ann.title}</p>
                      <Badge className={ann.active ? 'bg-success/10 text-success border-success/30' : 'bg-muted text-muted-foreground'}>
                        {ann.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{ann.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{ann.date}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toggleActive(ann.id)}>
                    {ann.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteAnn(ann.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
