import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Search, Plus, GitBranch, Play, Pause, Copy, Trash2,
  Clock, Folder, MoreHorizontal, Loader2,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFlows, useCreateFlow, useDeleteFlow, type Flow } from '@/hooks/useFlows';

export default function Flows() {
  const { data: flows = [], isLoading } = useFlows();
  const createFlow = useCreateFlow();
  const deleteFlow = useDeleteFlow();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const statusMap: Record<string, string> = { Todos: '', Ativos: 'active', Rascunho: 'draft', Pausados: 'paused' };
  const filtered = flows.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || f.status === statusMap[statusFilter];
    return matchSearch && matchStatus;
  });
  const folders = [...new Set(flows.map(f => f.folder).filter(Boolean))];

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const flow = await createFlow.mutateAsync({ name: newName, description: newDesc });
    setCreateOpen(false);
    setNewName('');
    setNewDesc('');
    navigate(`/flows/editor/${flow.id}`);
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fluxos de Automação</h1>
          <p className="text-sm text-muted-foreground">
            {flows.length} fluxos criados · {flows.filter(f => f.status === 'active').length} ativos
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Fluxo
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar fluxo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-muted/50 border-border/50" />
        </div>
        <div className="flex gap-1.5">
          {['Todos', 'Ativos', 'Rascunho', 'Pausados'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn("text-xs px-3 py-1.5 rounded-full transition-colors", f === statusFilter ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {folders.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {folders.map(folder => (
            <button key={folder} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <Folder className="h-3 w-3" />
              {folder}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <GitBranch className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Nenhum fluxo encontrado</h3>
          <p className="text-sm text-muted-foreground mb-4">Crie seu primeiro fluxo de automação</p>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Criar Fluxo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((flow) => (
            <div key={flow.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-200 cursor-pointer group relative">
              <Link to={`/flows/editor/${flow.id}`} className="absolute inset-0 z-0" />
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    flow.status === 'active' ? 'bg-success/10' : flow.status === 'draft' ? 'bg-muted' : 'bg-warning/10'
                  )}>
                    <GitBranch className={cn(
                      "h-5 w-5",
                      flow.status === 'active' ? 'text-success' : flow.status === 'draft' ? 'text-muted-foreground' : 'text-warning'
                    )} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{flow.name}</h3>
                    {flow.folder && <p className="text-[10px] text-muted-foreground">{flow.folder}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={flow.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); deleteFlow.mutate(flow.id); }}>
                        <Trash2 className="h-4 w-4 mr-2 text-destructive" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {flow.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{flow.description}</p>}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{flow.execution_count}</p>
                  <p className="text-[10px] text-muted-foreground">execuções</p>
                </div>
                <div className="text-center">
                  <p className={cn("text-lg font-bold", Number(flow.success_rate) > 80 ? 'text-success' : Number(flow.success_rate) > 50 ? 'text-warning' : 'text-destructive')}>
                    {Number(flow.success_rate)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">sucesso</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatDate(flow.updated_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Flow Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Fluxo de Automação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome do fluxo</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Boas-vindas WhatsApp" />
            </div>
            <div className="space-y-2">
              <Label>Descrição (opcional)</Label>
              <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descreva o objetivo do fluxo..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!newName.trim() || createFlow.isPending}>
              {createFlow.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Criar Fluxo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
