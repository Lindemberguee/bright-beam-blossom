import { useState, useMemo } from 'react';
import { useConnections, Connection } from '@/hooks/useConnections';
import { ConnectionCard } from '@/components/connections/ConnectionCard';
import { ConnectionDetailSheet } from '@/components/connections/ConnectionDetailSheet';
import { CreateConnectionDialog } from '@/components/connections/CreateConnectionDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Wifi, WifiOff, AlertTriangle, Flame, Plug } from 'lucide-react';

const channelFilters = [
  { value: 'all', label: 'Todos os canais' },
  { value: 'whatsapp_qr', label: 'WhatsApp QR' },
  { value: 'whatsapp_api', label: 'WhatsApp API' },
  { value: 'webchat', label: 'Webchat' },
  { value: 'api', label: 'API' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'E-mail' },
];

const statusFilters = [
  { value: 'all', label: 'Todos os status' },
  { value: 'connected', label: 'Conectado' },
  { value: 'disconnected', label: 'Desconectado' },
  { value: 'error', label: 'Erro' },
  { value: 'paused', label: 'Pausado' },
  { value: 'connecting', label: 'Conectando' },
  { value: 'awaiting_qr', label: 'Aguardando QR' },
];

export default function Connections() {
  const { connections, isLoading, createConnection, updateConnection, deleteConnection, syncConnection } = useConnections();
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warmingFilter, setWarmingFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedConn, setSelectedConn] = useState<Connection | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = useMemo(() => {
    return connections.filter((c) => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !(c.phone || '').includes(q) && !(c.identifier || '').toLowerCase().includes(q)) return false;
      if (channelFilter !== 'all' && c.channel_type !== channelFilter) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (warmingFilter === 'warming' && !c.available_for_warming) return false;
      if (warmingFilter === 'campaigns' && !c.available_for_campaigns) return false;
      return true;
    });
  }, [connections, search, channelFilter, statusFilter, warmingFilter]);

  // Stats
  const totalConnected = connections.filter((c) => c.status === 'connected').length;
  const totalDisconnected = connections.filter((c) => c.status === 'disconnected' || c.status === 'error').length;
  const totalWarming = connections.filter((c) => c.available_for_warming).length;
  const avgHealth = connections.length ? Math.round(connections.reduce((a, c) => a + c.health_score, 0) / connections.length) : 0;

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Conexões</h1>
          <p className="text-sm text-muted-foreground">Centro de comando dos canais da operação</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" /> Nova Conexão
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Wifi} label="Conectados" value={totalConnected} color="text-emerald-400" />
        <StatCard icon={WifiOff} label="Desconectados" value={totalDisconnected} color="text-red-400" />
        <StatCard icon={Flame} label="Aquecimento" value={totalWarming} color="text-orange-400" />
        <StatCard icon={AlertTriangle} label="Saúde Média" value={`${avgHealth}%`} color={avgHealth >= 80 ? 'text-emerald-400' : 'text-amber-400'} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, número..."
            className="pl-9"
          />
        </div>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {channelFilters.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            {statusFilters.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={warmingFilter} onValueChange={setWarmingFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Disponibilidade</SelectItem>
            <SelectItem value="warming">Aquecimento</SelectItem>
            <SelectItem value="campaigns">Campanhas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Plug className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {connections.length === 0 ? 'Nenhuma conexão criada' : 'Nenhuma conexão encontrada'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {connections.length === 0
              ? 'Crie sua primeira conexão para começar a operar'
              : 'Tente ajustar os filtros de busca'
            }
          </p>
          {connections.length === 0 && (
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Nova Conexão
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              onSync={() => syncConnection.mutate(conn.id)}
              onOpen={() => { setSelectedConn(conn); setDetailOpen(true); }}
              onDelete={() => deleteConnection.mutate(conn.id)}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <CreateConnectionDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        loading={createConnection.isPending}
        onSubmit={(data) => {
          createConnection.mutate(data, { onSuccess: () => setCreateOpen(false) });
        }}
      />

      {/* Detail Sheet */}
      <ConnectionDetailSheet
        connection={selectedConn}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSync={(id) => syncConnection.mutate(id)}
        onUpdate={(id, updates) => updateConnection.mutate({ id, ...updates })}
        onDelete={(id) => { deleteConnection.mutate(id); setDetailOpen(false); }}
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
