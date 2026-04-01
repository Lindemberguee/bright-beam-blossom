import { useState } from 'react';
import { mockContacts } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  Search, Plus, Filter, Download, Upload, MoreHorizontal, Grid3x3, List,
  Users, Star, Phone, Mail, Building2, Tag, ChevronLeft, ChevronRight,
} from 'lucide-react';

export default function Contacts() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [search, setSearch] = useState('');

  const filtered = mockContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Contatos</h1>
          <p className="text-sm text-muted-foreground">{mockContacts.length} contatos cadastrados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Upload className="h-4 w-4" /> Importar</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
          <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Novo Contato</Button>
        </div>
      </div>

      {/* Filters */}
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

      {view === 'list' ? (
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
                <TableHead className="text-muted-foreground">Última Interação</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((contact) => (
                <TableRow key={contact.id} className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{contact.name}</p>
                        {contact.email && <p className="text-xs text-muted-foreground">{contact.email}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{contact.phone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{contact.company || '-'}</TableCell>
                  <TableCell><StatusBadge status={contact.status} /></TableCell>
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
                      {contact.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
                      ))}
                      {contact.tags.length > 2 && <span className="text-[10px] text-muted-foreground">+{contact.tags.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{contact.lastInteraction}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground">Exibindo {filtered.length} de {mockContacts.length} contatos</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="h-8 min-w-[32px] bg-primary/10 text-primary border-primary/30">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((contact) => (
            <div key={contact.id} className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <StatusBadge status={contact.status} />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{contact.name}</h3>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{contact.phone}</div>
                {contact.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{contact.email}</div>}
                {contact.company && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Building2 className="h-3 w-3" />{contact.company}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {contact.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" />
                  <span className="text-xs font-medium text-foreground">{contact.score}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{contact.lastInteraction}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
