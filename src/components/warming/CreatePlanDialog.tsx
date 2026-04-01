import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Flame, Trash2 } from 'lucide-react';
import { useCreateWarmingPlan, DbWarmingPhase } from '@/hooks/useWarming';

type PhaseInput = Omit<DbWarmingPhase, 'id' | 'plan_id' | 'created_at'>;

const defaultPhase = (n: number): PhaseInput => ({
  phase_number: n,
  name: `Fase ${n}`,
  description: '',
  duration_days: 7,
  daily_limit: n * 50,
  hourly_limit: n * 5 + 5,
  message_interval_seconds: Math.max(15, 60 - n * 15),
  target_stage: n <= 1 ? 'warming' : n === 2 ? 'warming' : n === 3 ? 'stable' : 'scale',
  priority_contacts_only: n <= 1,
  min_response_rate: 0,
});

export function CreatePlanDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phases, setPhases] = useState<PhaseInput[]>([defaultPhase(1), defaultPhase(2), defaultPhase(3), defaultPhase(4)]);
  const create = useCreateWarmingPlan();

  const updatePhase = (idx: number, updates: Partial<PhaseInput>) => {
    setPhases(prev => prev.map((p, i) => i === idx ? { ...p, ...updates } : p));
  };

  const addPhase = () => {
    setPhases(prev => [...prev, defaultPhase(prev.length + 1)]);
  };

  const removePhase = (idx: number) => {
    setPhases(prev => prev.filter((_, i) => i !== idx).map((p, i) => ({ ...p, phase_number: i + 1 })));
  };

  const totalDays = phases.reduce((s, p) => s + p.duration_days, 0);

  const handleSubmit = () => {
    if (!name.trim()) return;
    create.mutate(
      { name, description, total_duration_days: totalDays, phases },
      { onSuccess: () => { setOpen(false); setName(''); setDescription(''); setPhases([defaultPhase(1), defaultPhase(2), defaultPhase(3), defaultPhase(4)]); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Criar Plano</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-primary" /> Novo Plano de Aquecimento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nome do Plano</Label>
              <Input placeholder="Ex: Aquecimento Padrão 30 dias" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Duração Total</Label>
              <Input value={`${totalDays} dias`} disabled className="bg-muted/50" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea placeholder="Descreva o objetivo do plano..." value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Fases do Plano</Label>
              <Button variant="ghost" size="sm" onClick={addPhase} className="gap-1 text-xs"><Plus className="h-3 w-3" /> Fase</Button>
            </div>
            {phases.map((phase, idx) => (
              <div key={idx} className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Fase {idx + 1}</span>
                  {phases.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removePhase(idx)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nome</Label>
                    <Input className="h-8 text-xs" value={phase.name} onChange={e => updatePhase(idx, { name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Duração (dias)</Label>
                    <Input className="h-8 text-xs" type="number" value={phase.duration_days} onChange={e => updatePhase(idx, { duration_days: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Estágio Alvo</Label>
                    <Select value={phase.target_stage} onValueChange={v => updatePhase(idx, { target_stage: v })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Novo</SelectItem>
                        <SelectItem value="warming">Aquecimento</SelectItem>
                        <SelectItem value="stable">Estável</SelectItem>
                        <SelectItem value="scale">Escala</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Limite Diário</Label>
                    <Input className="h-8 text-xs" type="number" value={phase.daily_limit} onChange={e => updatePhase(idx, { daily_limit: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Limite/Hora</Label>
                    <Input className="h-8 text-xs" type="number" value={phase.hourly_limit} onChange={e => updatePhase(idx, { hourly_limit: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Intervalo (seg)</Label>
                    <Input className="h-8 text-xs" type="number" value={phase.message_interval_seconds} onChange={e => updatePhase(idx, { message_interval_seconds: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={phase.priority_contacts_only} onCheckedChange={v => updatePhase(idx, { priority_contacts_only: v })} />
                    <Label className="text-xs">Apenas contatos prioritários</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || create.isPending}>
              {create.isPending ? 'Criando...' : 'Criar Plano'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
