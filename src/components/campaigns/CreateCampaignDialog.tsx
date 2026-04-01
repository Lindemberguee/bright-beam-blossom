import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Megaphone, MessageSquare, Users, Calendar } from 'lucide-react';
import { useCreateCampaign } from '@/hooks/useCampaigns';

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('mass');
  const [template, setTemplate] = useState('');
  const createCampaign = useCreateCampaign();

  const handleSubmit = () => {
    if (!name.trim()) return;
    createCampaign.mutate(
      { name, description, type, message_template: template },
      { onSuccess: () => { setOpen(false); setName(''); setDescription(''); setTemplate(''); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Campanha</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" /> Nova Campanha
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Nome da Campanha</Label>
            <Input placeholder="Ex: Black Friday 2025" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input placeholder="Breve descrição do objetivo..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mass">Em Massa</SelectItem>
                  <SelectItem value="segmented">Segmentada</SelectItem>
                  <SelectItem value="reactivation">Reativação</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Template da Mensagem</Label>
            <Textarea
              placeholder="Olá {{nome}}, temos uma oferta especial para você! 🎉"
              value={template}
              onChange={e => setTemplate(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">Use {'{{nome}}'}, {'{{empresa}}'}, {'{{telefone}}'} como variáveis dinâmicas</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || createCampaign.isPending}>
              {createCampaign.isPending ? 'Criando...' : 'Criar Campanha'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
