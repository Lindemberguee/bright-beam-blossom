import { useState } from 'react';
import { useCreateContact } from '@/hooks/useContacts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateContactDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('manual');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const createContact = useCreateContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact.mutateAsync({
      name,
      phone: phone || undefined,
      email: email || undefined,
      company: company || undefined,
      source,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName(''); setPhone(''); setEmail(''); setCompany('');
    setSource('manual'); setNotes(''); setTags('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Novo Contato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Nome *</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Telefone</Label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+55 11 99999-9999" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Empresa</Label>
              <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Nome da empresa" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Origem</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="import">Importação</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Tags (separadas por vírgula)</Label>
              <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="vip, lead, quente" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Observações</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Informações adicionais..." rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={createContact.isPending}>
              {createContact.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Criar Contato
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
