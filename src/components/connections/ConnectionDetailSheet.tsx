import { Connection, useConnectionEvents } from '@/hooks/useConnections';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RefreshCcw, Trash2, Flame, Megaphone, Headphones, QrCode,
  Activity, Clock, Shield, AlertTriangle, Info, CheckCircle2, XCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Props {
  connection: Connection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Connection>) => void;
  onDelete: (id: string) => void;
}

export function ConnectionDetailSheet({ connection: conn, open, onOpenChange, onSync, onUpdate, onDelete }: Props) {
  const { data: events = [] } = useConnectionEvents(conn?.id ?? null);

  if (!conn) return null;

  const healthColor = conn.health_score >= 80 ? 'text-emerald-400' : conn.health_score >= 50 ? 'text-amber-400' : 'text-red-400';
  const healthBg = conn.health_score >= 80 ? 'bg-emerald-500' : conn.health_score >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-lg">{conn.name}</SheetTitle>
              <p className="text-xs text-muted-foreground mt-1">{conn.phone || conn.identifier || conn.session_name || '—'}</p>
            </div>
            <ConnectionStatusBadge status={conn.status} />
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <Tabs defaultValue="overview" className="px-6">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="overview" className="text-xs">Visão Geral</TabsTrigger>
              <TabsTrigger value="config" className="text-xs">Configurações</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-5 pb-6">
              {/* Health Score */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground font-medium">Score de Saúde</span>
                  <span className={cn('text-2xl font-bold', healthColor)}>{conn.health_score}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', healthBg)} style={{ width: `${conn.health_score}%` }} />
                </div>
              </div>

              {/* QR Code placeholder for WhatsApp */}
              {conn.channel_type.startsWith('whatsapp') && conn.status === 'awaiting_qr' && (
                <div className="glass-card rounded-xl p-6 flex flex-col items-center gap-3">
                  <QrCode className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground text-center">Escaneie o QR Code para conectar</p>
                  <div className="h-48 w-48 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">QR Code</span>
                  </div>
                </div>
              )}

              {/* Info grid */}
              <div className="space-y-3">
                <DetailRow label="Canal" value={conn.channel_type.replace('_', ' ').toUpperCase()} />
                <DetailRow label="Sessão" value={conn.session_name || '—'} />
                <DetailRow label="Conta" value={conn.account_name || '—'} />
                <DetailRow label="Conectado em" value={conn.connected_at ? format(new Date(conn.connected_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '—'} />
                <DetailRow label="Última sinc." value={conn.last_sync_at ? format(new Date(conn.last_sync_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '—'} />
                <DetailRow label="Última atividade" value={conn.last_activity_at ? format(new Date(conn.last_activity_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : '—'} />
                <DetailRow label="Criado em" value={format(new Date(conn.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })} />
              </div>

              <Separator />

              {/* Linked resources */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vínculos</h4>
                <DetailRow label="Fila" value={conn.assigned_queue || '—'} />
                <DetailRow label="Equipe" value={conn.assigned_team || '—'} />
                <DetailRow label="Fluxo" value={conn.assigned_flow_id ? 'Vinculado' : '—'} />
              </div>

              {conn.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Observações</h4>
                    <p className="text-sm text-foreground">{conn.notes}</p>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => onSync(conn.id)}>
                  <RefreshCcw className="h-4 w-4" /> Sincronizar
                </Button>
                <Button variant="destructive" className="gap-2" onClick={() => onDelete(conn.id)}>
                  <Trash2 className="h-4 w-4" /> Remover
                </Button>
              </div>
            </TabsContent>

            {/* Config */}
            <TabsContent value="config" className="space-y-5 pb-6">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Disponibilidade</h4>

                <ToggleRow
                  icon={Flame}
                  label="Aquecimento"
                  description="Disponível para o módulo de aquecimento"
                  checked={conn.available_for_warming}
                  disabled={!conn.channel_type.startsWith('whatsapp')}
                  onChange={(v) => onUpdate(conn.id, { available_for_warming: v })}
                />
                <ToggleRow
                  icon={Megaphone}
                  label="Campanhas"
                  description="Disponível para envio de campanhas"
                  checked={conn.available_for_campaigns}
                  onChange={(v) => onUpdate(conn.id, { available_for_campaigns: v })}
                />
                <ToggleRow
                  icon={Headphones}
                  label="Atendimento"
                  description="Disponível para atendimento ao vivo"
                  checked={conn.available_for_attendance}
                  onChange={(v) => onUpdate(conn.id, { available_for_attendance: v })}
                />
              </div>

              {!conn.channel_type.startsWith('whatsapp') && (
                <p className="text-xs text-muted-foreground italic">
                  * O módulo de aquecimento está disponível apenas para canais WhatsApp.
                </p>
              )}
            </TabsContent>

            {/* Logs */}
            <TabsContent value="logs" className="space-y-3 pb-6">
              {events.length === 0 ? (
                <div className="text-center py-10">
                  <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum evento registrado</p>
                </div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="glass-card rounded-lg p-3 flex items-start gap-3">
                    <EventIcon severity={ev.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{ev.title}</p>
                      {ev.details && <p className="text-xs text-muted-foreground mt-0.5">{ev.details}</p>}
                      <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {format(new Date(ev.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium text-xs">{value}</span>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, disabled, onChange }: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={cn('flex items-center justify-between p-3 rounded-lg border border-border/50', disabled && 'opacity-50')}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

function EventIcon({ severity }: { severity: string }) {
  switch (severity) {
    case 'error': return <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />;
    case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />;
    default: return <Info className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />;
  }
}
