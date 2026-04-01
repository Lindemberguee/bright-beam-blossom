import { useState } from 'react';
import { useQueues, useDepartments } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const strategyLabels: Record<string, string> = {
  round_robin: 'Round Robin',
  least_busy: 'Menos Ocupado',
  random: 'Aleatório',
  manual: 'Manual',
};

export default function SettingsQueues() {
  const { items, isLoading, create, update, remove } = useQueues();
  const { items: departments } = useDepartments();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [strategy, setStrategy] = useState('round_robin');
  const [deptId, setDeptId] = useState('none');
  const [maxConcurrent, setMaxConcurrent] = useState('5');

  const handleCreate = () => {
    if (!name.trim()) return;
    create.mutate({
      name: name.trim(),
      description: desc.trim() || null,
      distribution_strategy: strategy,
      department_id: deptId === 'none' ? null : deptId,
      max_concurrent: parseInt(maxConcurrent) || 5,
    } as any, {
      onSuccess: () => { setOpen(false); setName(''); setDesc(''); },
    });
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Filas de Atendimento</h1>
          <p className="text-sm text-muted-foreground">Regras de distribuição automática de conversas</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nova Fila</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">Nenhuma fila criada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((q) => {
            const dept = departments.find((d) => d.id === q.department_id);
            return (
              <div key={q.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{q.name}</span>
                    {q.description && <p className="text-xs text-muted-foreground">{q.description}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{strategyLabels[q.distribution_strategy] || q.distribution_strategy}</Badge>
                      <span className="text-[10px] text-muted-foreground">Máx: {q.max_concurrent}</span>
                      {dept && <span className="text-[10px] text-muted-foreground">• {dept.name}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={q.is_active} onCheckedChange={(v) => update.mutate({ id: q.id, is_active: v } as any)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove.mutate(q.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nova Fila</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Atendimento Geral" /></div>
            <div><Label>Descrição</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição opcional" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Estratégia</Label>
                <Select value={strategy} onValueChange={setStrategy}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(strategyLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Máx. Simultâneos</Label><Input type="number" value={maxConcurrent} onChange={(e) => setMaxConcurrent(e.target.value)} min="1" /></div>
            </div>
            {departments.length > 0 && (
              <div>
                <Label>Departamento</Label>
                <Select value={deptId} onValueChange={setDeptId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
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
