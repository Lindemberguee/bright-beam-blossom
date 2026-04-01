import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Globe, Code, Webhook, Instagram, Send, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const channelOptions = [
  { value: 'whatsapp_qr', label: 'WhatsApp QR Code', icon: MessageCircle, color: 'text-emerald-400' },
  { value: 'whatsapp_api', label: 'WhatsApp Cloud API', icon: MessageCircle, color: 'text-emerald-500' },
  { value: 'webchat', label: 'Webchat', icon: Globe, color: 'text-primary' },
  { value: 'api', label: 'API Customizada', icon: Code, color: 'text-sky-400' },
  { value: 'webhook', label: 'Webhook', icon: Webhook, color: 'text-violet-400' },
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-400' },
  { value: 'telegram', label: 'Telegram', icon: Send, color: 'text-sky-300' },
  { value: 'email', label: 'E-mail', icon: Mail, color: 'text-amber-400' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    channel_type: string;
    phone?: string;
    identifier?: string;
    session_name?: string;
    assigned_queue?: string;
    assigned_team?: string;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export function CreateConnectionDialog({ open, onOpenChange, onSubmit, loading }: Props) {
  const [name, setName] = useState('');
  const [channelType, setChannelType] = useState('whatsapp_qr');
  const [phone, setPhone] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [queue, setQueue] = useState('');
  const [team, setTeam] = useState('');
  const [notes, setNotes] = useState('');

  const isWhatsApp = channelType.startsWith('whatsapp');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      channel_type: channelType,
      phone: phone.trim() || undefined,
      session_name: sessionName.trim() || undefined,
      assigned_queue: queue.trim() || undefined,
      assigned_team: team.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setName('');
    setPhone('');
    setSessionName('');
    setQueue('');
    setTeam('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Conexão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Channel type selector */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Tipo de Canal</Label>
            <div className="grid grid-cols-4 gap-2">
              {channelOptions.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => setChannelType(ch.value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs transition-all',
                    channelType === ch.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border/50 text-muted-foreground hover:border-border hover:bg-accent/50'
                  )}
                >
                  <ch.icon className={cn('h-5 w-5', channelType === ch.value ? 'text-primary' : ch.color)} />
                  <span className="text-center leading-tight">{ch.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="conn-name">Nome da conexão</Label>
            <Input id="conn-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: WhatsApp Principal" />
          </div>

          {isWhatsApp && (
            <>
              <div>
                <Label htmlFor="conn-phone">Número do telefone</Label>
                <Input id="conn-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+55 11 99999-9999" />
              </div>
              <div>
                <Label htmlFor="conn-session">Nome da sessão</Label>
                <Input id="conn-session" value={sessionName} onChange={(e) => setSessionName(e.target.value)} placeholder="sessao-principal" />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="conn-queue">Fila padrão</Label>
              <Input id="conn-queue" value={queue} onChange={(e) => setQueue(e.target.value)} placeholder="Atendimento" />
            </div>
            <div>
              <Label htmlFor="conn-team">Equipe</Label>
              <Input id="conn-team" value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Vendas" />
            </div>
          </div>

          <div>
            <Label htmlFor="conn-notes">Observações</Label>
            <Textarea id="conn-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas sobre esta conexão..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || loading}>
            {loading ? 'Criando...' : 'Criar Conexão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
