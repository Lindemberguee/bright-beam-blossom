import { useState, useMemo } from 'react';
import { useContacts, useDeleteContact, DbContact } from '@/hooks/useContacts';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CreateContactDialog } from '@/components/contacts/CreateContactDialog';
import { ContactDetailSheet } from '@/components/contacts/ContactDetailSheet';
import { ContactFilters } from '@/components/contacts/ContactFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  Search, Plus, Download, Upload, MoreHorizontal, Grid3x3, List,
  Phone, Mail, Building2, Star, Trash2, Loader2, Users, UserPlus, UserCheck,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Contacts() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<DbContact | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', source: 'all' });
  const { data: contacts = [], isLoading } = useContacts(search);
  const deleteContact = useDeleteContact();

  const filtered = useMemo(() => {
    return contacts.filter(c => {
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.source !== 'all' && c.source !== filters.source) return false;
      return true;
    });
  }, [contacts, filters]);

  const stats = useMemo(() => ({
    total: contacts.length,
    leads: contacts.filter(c => c.status === 'lead').length,
    active: contacts.filter(c => c.status === 'active').length,
    customers: contacts.filter(c => c.status === 'customer').length,
  }), [contacts]);

  const openDetail = (contact: DbContact) => {
    setSelectedContact(contact);
    setDetailOpen(true);
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contatos</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} de {contacts.length} contatos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /> Importar</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
          <Button size="sm" className="gap-2" onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4" /> Novo Contato</Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total" value={stats.total} color="text-primary" />
        <StatCard icon={UserPlus} label="Leads" value={stats.leads} color="text-blue-500" />
        <StatCard icon={Star} label="Ativos" value={stats.active} color="text-emerald-500" />
        <StatCard icon={UserCheck} label="Clientes" value={stats.customers} color="text-violet-500" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome, telefone, email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-muted/50 border-border/50" />
        </div>
        <ContactFilters filters={filters} onChange={setFilters} />
        <div className="flex border border-border rounded-lg overflow-hidden ml-auto">
          <button onClick={() => setView('list')} className={cn("p-2 transition-colors", view === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
            <List className="h-4 w-4" />
          </button>
          <button onClick={() => setView('grid')} className={cn("p-2 transition-colors", view === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
            <Grid3x3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Dialogs */}
      <CreateContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <ContactDetailSheet contact={selectedContact} open={detailOpen} onOpenChange={setDetailOpen} />

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-1 font-medium">Nenhum contato encontrado</p>
          <p className="text-xs text-muted-foreground mb-4">Crie seu primeiro contato para começar</p>
          <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Criar contato</Button>
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
                <TableHead className="text-muted-foreground">Origem</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(contact => (
                <TableRow key={contact.id} className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => openDetail(contact)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {initials(contact.name)}
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
                  <TableCell className="text-xs text-muted-foreground capitalize">{contact.source ?? '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={e => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetail(contact); }}>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive gap-2" onClick={(e) => { e.stopPropagation(); deleteContact.mutate(contact.id); }}>
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
          {filtered.map(contact => (
            <div key={contact.id} onClick={() => openDetail(contact)} className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary group-hover:bg-primary/30 transition-colors">
                  {initials(contact.name)}
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
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium text-foreground">{contact.score}</span>
                </div>
                <span className="text-[10px] text-muted-foreground capitalize">{contact.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className={cn("h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
