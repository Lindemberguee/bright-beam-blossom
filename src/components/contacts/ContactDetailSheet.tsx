import { useState } from 'react';
import { DbContact, useUpdateContact, useDeleteContact } from '@/hooks/useContacts';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Phone, Mail, Building2, Calendar, Star, Trash2, Save, Loader2, MessageSquare, Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  contact: DbContact | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ContactDetailSheet({ contact, open, onOpenChange }: Props) {
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<DbContact>>({});

  if (!contact) return null;

  const startEdit = () => {
    setForm({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      company: contact.company,
      status: contact.status,
      notes: contact.notes,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    await updateContact.mutateAsync({ id: contact.id, ...form });
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteContact.mutateAsync(contact.id);
    onOpenChange(false);
  };

  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">Detalhes do Contato</SheetTitle>
        </SheetHeader>

        {/* Header */}
        <div className="flex items-start gap-4 mt-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <Input value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="text-lg font-semibold" />
            ) : (
              <h2 className="text-lg font-semibold text-foreground truncate">{contact.name}</h2>
            )}
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={contact.status as any} />
              <span className="text-xs text-muted-foreground">Score: {contact.score}</span>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 p-3 rounded-xl bg-muted/50 border border-border/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Pontuação do Lead</span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-sm font-bold text-foreground">{contact.score ?? 0}</span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all" style={{ width: `${Math.min(contact.score ?? 0, 100)}%` }} />
          </div>
        </div>

        {/* Info fields */}
        <div className="mt-6 space-y-4">
          <InfoRow icon={Phone} label="Telefone" editing={editing} value={editing ? form.phone ?? '' : contact.phone ?? '-'}
            onChange={v => setForm(f => ({ ...f, phone: v }))} />
          <InfoRow icon={Mail} label="Email" editing={editing} value={editing ? form.email ?? '' : contact.email ?? '-'}
            onChange={v => setForm(f => ({ ...f, email: v }))} />
          <InfoRow icon={Building2} label="Empresa" editing={editing} value={editing ? form.company ?? '' : contact.company ?? '-'}
            onChange={v => setForm(f => ({ ...f, company: v }))} />
          <InfoRow icon={Calendar} label="Criado em" editing={false}
            value={format(new Date(contact.created_at), "dd MMM yyyy, HH:mm", { locale: ptBR })} />
          <InfoRow icon={MessageSquare} label="Origem" editing={false} value={contact.source ?? 'manual'} />
        </div>

        {/* Status selector */}
        {editing && (
          <div className="mt-4 space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Status</Label>
            <Select value={form.status ?? contact.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tags */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Etiquetas</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(contact.tags ?? []).length > 0 ? (
              (contact.tags ?? []).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">Nenhuma etiqueta</span>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Observações</Label>
          {editing ? (
            <Textarea value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
          ) : (
            <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3 min-h-[60px]">
              {contact.notes || 'Sem observações'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button className="flex-1 gap-2" onClick={handleSave} disabled={updateContact.isPending}>
                {updateContact.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1" onClick={startEdit}>Editar</Button>
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={deleteContact.isPending}>
                {deleteContact.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ icon: Icon, label, value, editing, onChange }: {
  icon: any; label: string; value: string; editing: boolean; onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        {editing && onChange ? (
          <Input value={value} onChange={e => onChange(e.target.value)} className="h-7 text-sm mt-0.5" />
        ) : (
          <p className="text-sm text-foreground truncate">{value}</p>
        )}
      </div>
    </div>
  );
}
