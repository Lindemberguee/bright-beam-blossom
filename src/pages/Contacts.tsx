import { useState } from 'react';
import { useContacts, useCreateContact, useDeleteContact, DbContact } from '@/hooks/useContacts';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Search, Plus, Filter, Download, Upload, MoreHorizontal, Grid3x3, List,
  Phone, Mail, Building2, Star, ChevronLeft, ChevronRight, Trash2, Loader2,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function CreateContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const createContact = useCreateContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact.mutateAsync({ name, phone: phone || undefined, email: email || undefined, company: company || undefined });
    setName(''); setPhone(''); setEmail(''); setCompany('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Contato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome completo" required />
          </div>
          <div className="space-y-1.5">
            <Label>Telefone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+55 11 99999-9999" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@empresa.com" />
          </div>
          <div className="space-y-1.5">
            <Label>Empresa</Label>
            <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Nome da empresa" />
          </div>
          <Button type="submit" className="w-full" disabled={createContact.isPending}>
            {createContact.isPending ? 'Criando...' : 'Criar Contato'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Contacts() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: contacts = [], isLoading } = useContacts(search);
  const deleteContact = useDeleteContact();

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contatos</h1>
          <p className="text-sm text-muted-foreground">{contacts.length} contatos cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /> Importar</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
          <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Novo Contato</Button>
        </div>
      </div>

      <CreateContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome, telefone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-muted/50 border-border/50" />
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filtros</Button>
        <div className="flex border border-border rounded-lg overflow-hidden ml-auto">
          <button onClick={() => setView('list')} className={cn("p-2 transition-colors", view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => setView('grid')} className={cn("p-2 transition-colors", view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground mb-4">Nenhum contato encontrado</p>
          <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Criar primeiro contato</Button>
        </div>
      ) : view === 'list' ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">Contato</TableHead>
                <TableHead className="text-muted-foreground">Telefone</TableHead>
                <TableHead className="text-muted-foreground">Empresa</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Score</TableHead>
                <TableHead className="text-muted-foreground">Etiquetas</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{contact.name}</p>
                        {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{contact.phone || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{contact.company || '-'}</TableCell>
                  <TableCell><StatusBadge status={contact.status as any} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${contact.score}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground">{contact.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(contact.tags ?? []).slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
                      ))}
                      {(contact.tags ?? []).length > 2 && <span className="text-[10px] text-muted-foreground">+{contact.tags.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-destructive gap-2" onClick={() => deleteContact.mutate(contact.id)}>
                          <Trash2 className="h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <StatusBadge status={contact.status as any} />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{contact.name}</h3>
              <div className="space-y-1 mt-2">
                {contact.phone && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{contact.phone}</div>}
                {contact.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{contact.email}</div>}
                {contact.company && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Building2 className="h-3 w-3" />{contact.company}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {(contact.tags ?? []).map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" />
                  <span className="text-xs font-medium text-foreground">{contact.score}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{contact.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
