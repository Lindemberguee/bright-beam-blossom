import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const methodOptions = [
  { value: 'POST', color: 'text-emerald-400' },
  { value: 'GET', color: 'text-sky-400' },
  { value: 'PUT', color: 'text-amber-400' },
  { value: 'PATCH', color: 'text-orange-400' },
  { value: 'DELETE', color: 'text-destructive' },
];

const authOptions = [
  { value: 'none', label: 'Sem autenticação' },
  { value: 'bearer', label: 'Bearer Token' },
  { value: 'api_key', label: 'API Key (header)' },
  { value: 'basic', label: 'Basic Auth' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    url: string;
    method: string;
    description?: string;
    auth_type: string;
    auth_token?: string;
    notes?: string;
  }) => void;
  loading?: boolean;
}

export function CreateWebhookDialog({ open, onOpenChange, onSubmit, loading }: Props) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('POST');
  const [description, setDescription] = useState('');
  const [authType, setAuthType] = useState('none');
  const [authToken, setAuthToken] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !url.trim()) return;
    onSubmit({
      name: name.trim(),
      url: url.trim(),
      method,
      description: description.trim() || undefined,
      auth_type: authType,
      auth_token: authToken.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setName(''); setUrl(''); setMethod('POST'); setDescription('');
    setAuthType('none'); setAuthToken(''); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Webhook</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Method selector */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Método HTTP</Label>
            <div className="flex gap-2">
              {methodOptions.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={cn(
                    'px-4 py-2 rounded-lg border text-xs font-bold transition-all',
                    method === m.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/50 text-muted-foreground hover:border-border hover:bg-accent/50'
                  )}
                >
                  {m.value}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="wh-name">Nome do webhook</Label>
            <Input id="wh-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Receber Lead RD Station" />
          </div>

          <div>
            <Label htmlFor="wh-url">URL do endpoint</Label>
            <Input id="wh-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.exemplo.com/webhook" />
          </div>

          <div>
            <Label htmlFor="wh-desc">Descrição</Label>
            <Input id="wh-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição do webhook..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Autenticação</Label>
              <Select value={authType} onValueChange={setAuthType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {authOptions.map((a) => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {authType !== 'none' && (
              <div>
                <Label htmlFor="wh-token">Token / Credencial</Label>
                <Input id="wh-token" type="password" value={authToken} onChange={(e) => setAuthToken(e.target.value)} placeholder="••••••••" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="wh-notes">Observações</Label>
            <Textarea id="wh-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas internas..." rows={2} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !url.trim() || loading}>
            {loading ? 'Criando...' : 'Criar Webhook'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
