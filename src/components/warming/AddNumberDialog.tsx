import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Smartphone } from 'lucide-react';
import { useCreateWhatsAppNumber } from '@/hooks/useWarming';

export function AddNumberDialog() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [dailyLimit, setDailyLimit] = useState('50');
  const [hourlyLimit, setHourlyLimit] = useState('10');
  const create = useCreateWhatsAppNumber();

  const handleSubmit = () => {
    if (!phone.trim() || !sessionName.trim()) return;
    create.mutate(
      { phone, session_name: sessionName, daily_limit: Number(dailyLimit), hourly_limit: Number(hourlyLimit) },
      { onSuccess: () => { setOpen(false); setPhone(''); setSessionName(''); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Adicionar Número</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> Novo Número WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Número de Telefone</Label>
            <Input placeholder="+55 11 99999-9999" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Nome da Sessão</Label>
            <Input placeholder="Ex: Vendas Principal" value={sessionName} onChange={e => setSessionName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Limite Diário</Label>
              <Input type="number" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Limite/Hora</Label>
              <Input type="number" value={hourlyLimit} onChange={e => setHourlyLimit(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!phone.trim() || !sessionName.trim() || create.isPending}>
              {create.isPending ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
