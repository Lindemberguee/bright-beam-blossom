import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockFlows } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Search, Plus, Filter, GitBranch, Play, Pause, Copy, MoreHorizontal,
  TrendingUp, Activity, Clock, Folder, BarChart3,
} from 'lucide-react';

export default function Flows() {
  const [search, setSearch] = useState('');
  const filtered = mockFlows.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const folders = [...new Set(mockFlows.map(f => f.folder).filter(Boolean))];

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Fluxos de Automação</h1>
          <p className="text-sm text-muted-foreground">{mockFlows.length} fluxos criados · {mockFlows.filter(f => f.status === 'active').length} ativos</p>
        </div>
        <Link to="/flows/editor">
          <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Fluxo</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar fluxo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-muted/50 border-border/50" />
        </div>
        <div className="flex gap-1.5">
          {['Todos', 'Ativos', 'Rascunho', 'Pausados'].map((f) => (
            <button key={f} className={cn("text-xs px-3 py-1.5 rounded-full transition-colors", f === 'Todos' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Folders */}
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

      {/* Flow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((flow) => (
          <Link key={flow.id} to="/flows/editor">
            <div className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
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
                <StatusBadge status={flow.status} />
              </div>

              {flow.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{flow.description}</p>}

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{flow.nodesCount}</p>
                  <p className="text-[10px] text-muted-foreground">blocos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{flow.executionCount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">execuções</p>
                </div>
                <div className="text-center">
                  <p className={cn("text-lg font-bold", flow.successRate > 80 ? 'text-success' : flow.successRate > 50 ? 'text-warning' : 'text-destructive')}>
                    {flow.successRate}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">sucesso</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Atualizado em {flow.updatedAt}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><Play className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><Copy className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
