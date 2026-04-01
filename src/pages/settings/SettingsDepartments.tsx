import { useState } from 'react';
import { useDepartments } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowLeft, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const colorOptions = ['#6366f1','#ef4444','#f59e0b','#10b981','#3b82f6','#ec4899','#8b5cf6','#06b6d4'];

export default function SettingsDepartments() {
  const { items, isLoading, create, update, remove } = useDepartments();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('#6366f1');

  const handleCreate = () => {
    if (!name.trim()) return;
    create.mutate({ name: name.trim(), description: desc.trim() || null, color } as any, {
      onSuccess: () => { setOpen(false); setName(''); setDesc(''); },
    });
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Departamentos</h1>
          <p className="text-sm text-muted-foreground">Organize equipes por área de atuação</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Novo Departamento</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">Nenhum departamento criado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((dept) => (
            <div key={dept.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: dept.color }} />
                <div>
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                  {dept.description && <p className="text-xs text-muted-foreground">{dept.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={dept.is_active} onCheckedChange={(v) => update.mutate({ id: dept.id, is_active: v } as any)} />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove.mutate(dept.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Novo Departamento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Suporte, Vendas..." /></div>
            <div><Label>Descrição</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição opcional" /></div>
            <div>
              <Label>Cor</Label>
              <div className="flex gap-2 mt-1">
                {colorOptions.map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || create.isPending}>{create.isPending ? 'Criando...' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
