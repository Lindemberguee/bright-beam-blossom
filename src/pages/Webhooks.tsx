import { useState, useMemo } from 'react';
import { useWebhooks, Webhook } from '@/hooks/useWebhooks';
import { CreateWebhookDialog } from '@/components/webhooks/CreateWebhookDialog';
import { WebhookDetailSheet } from '@/components/webhooks/WebhookDetailSheet';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Search, Webhook as WebhookIcon, Copy, AlertTriangle, CheckCircle2, XCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';

const statusFilters = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

const methodFilters = [
  { value: 'all', label: 'Todos os métodos' },
  { value: 'POST', label: 'POST' },
  { value: 'GET', label: 'GET' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
];

export default function Webhooks() {
  const { webhooks, isLoading, createWebhook, updateWebhook, deleteWebhook } = useWebhooks();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedWh, setSelectedWh] = useState<Webhook | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    return webhooks.filter((wh) => {
      const q = search.toLowerCase();
      if (q && !wh.name.toLowerCase().includes(q) && !wh.url.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'all' && wh.status !== statusFilter) return false;
      if (methodFilter !== 'all' && wh.method !== methodFilter) return false;
      return true;
    });
  }, [webhooks, search, statusFilter, methodFilter]);

  const totalActive = webhooks.filter((w) => w.status === 'active').length;
  const totalErrors = webhooks.reduce((a, w) => a + w.error_count, 0);
  const totalCalls = webhooks.reduce((a, w) => a + w.call_count, 0);

  const copyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    toast.success('URL copiada');
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Webhooks</h1>
          <p className="text-sm text-muted-foreground">Endpoints de entrada para integrações externas</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Novo Webhook
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={WebhookIcon} label="Total" value={webhooks.length} color="text-primary" />
        <StatCard icon={CheckCircle2} label="Ativos" value={totalActive} color="text-emerald-400" />
        <StatCard icon={Globe} label="Chamadas" value={totalCalls.toLocaleString()} color="text-sky-400" />
        <StatCard icon={AlertTriangle} label="Erros" value={totalErrors.toLocaleString()} color="text-destructive" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou URL..." className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statusFilters.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {methodFilters.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <WebhookIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {webhooks.length === 0 ? 'Nenhum webhook criado' : 'Nenhum webhook encontrado'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {webhooks.length === 0 ? 'Crie seu primeiro webhook para receber dados externos' : 'Tente ajustar os filtros de busca'}
          </p>
          {webhooks.length === 0 && (
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Webhook
            </Button>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">Nome</TableHead>
                <TableHead className="text-muted-foreground">URL</TableHead>
                <TableHead className="text-muted-foreground">Método</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Chamadas</TableHead>
                <TableHead className="text-muted-foreground text-right">Erros</TableHead>
                <TableHead className="text-muted-foreground">Última chamada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((wh) => (
                <TableRow
                  key={wh.id}
                  className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => { setSelectedWh(wh); setDetailOpen(true); }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <WebhookIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{wh.name}</span>
                        {wh.description && <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{wh.description}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <code className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground truncate max-w-[200px]">{wh.url}</code>
                      <button className="text-muted-foreground hover:text-foreground" onClick={(e) => copyUrl(wh.url, e)}>
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{wh.method}</span>
                  </TableCell>
                  <TableCell><StatusBadge status={wh.status} /></TableCell>
                  <TableCell className="text-right text-sm text-foreground font-medium">{wh.call_count.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {wh.error_count > 0 ? (
                      <span className="text-sm text-destructive font-medium flex items-center gap-1 justify-end">
                        <AlertTriangle className="h-3 w-3" /> {wh.error_count}
                      </span>
                    ) : (
                      <span className="text-sm text-emerald-400">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {wh.last_called_at ? new Date(wh.last_called_at).toLocaleString('pt-BR') : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create Dialog */}
      <CreateWebhookDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        loading={createWebhook.isPending}
        onSubmit={(data) => {
          createWebhook.mutate(data, { onSuccess: () => setCreateOpen(false) });
        }}
      />

      {/* Detail Sheet */}
      <WebhookDetailSheet
        webhook={selectedWh}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={(id, updates) => updateWebhook.mutate({ id, ...updates })}
        onDelete={(id) => { deleteWebhook.mutate(id); setDetailOpen(false); }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
