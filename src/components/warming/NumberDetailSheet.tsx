import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StageBadge, ConnectionDot, HealthScoreBadge } from './WarmingBadges';
import { DbWhatsAppNumber, useUpdateWhatsAppNumber, useDeleteWhatsAppNumber, useNumberEvents, useCreateNumberEvent, useWarmingPlans } from '@/hooks/useWarming';
import {
  BarChart3, Settings, History, Shield, Play, Pause, Trash2, ArrowUp,
  Send, ArrowDownLeft, MessageCircle, Clock, AlertTriangle, CheckCircle,
  XCircle, Info, Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface Props {
  number: DbWhatsAppNumber | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const severityIcon: Record<string, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
};
const severityColor: Record<string, string> = {
  info: 'text-blue-500',
  warning: 'text-amber-500',
  error: 'text-destructive',
  success: 'text-green-500',
};

export function NumberDetailSheet({ number, open, onOpenChange }: Props) {
  const { data: events = [] } = useNumberEvents(number?.id);
  const { data: plans = [] } = useWarmingPlans();
  const updateNumber = useUpdateWhatsAppNumber();
  const deleteNumber = useDeleteWhatsAppNumber();
  const createEvent = useCreateNumberEvent();
  const [editDailyLimit, setEditDailyLimit] = useState('');
  const [editHourlyLimit, setEditHourlyLimit] = useState('');
  const [editInterval, setEditInterval] = useState('');

  if (!number) return null;

  const handlePauseToggle = () => {
    const newPaused = !number.is_paused;
    updateNumber.mutate({ id: number.id, is_paused: newPaused, pause_reason: newPaused ? 'Pausa manual' : null } as any);
    createEvent.mutate({ number_id: number.id, event_type: newPaused ? 'paused' : 'resumed', severity: 'info', title: newPaused ? 'Número pausado manualmente' : 'Número retomado manualmente' });
  };

  const handleStageChange = (stage: string) => {
    updateNumber.mutate({ id: number.id, stage } as any);
    createEvent.mutate({ number_id: number.id, event_type: 'stage_change', severity: 'info', title: `Estágio alterado para ${stage}` });
  };

  const handleSaveConfig = () => {
    const updates: any = { id: number.id };
    if (editDailyLimit) updates.daily_limit = Number(editDailyLimit);
    if (editHourlyLimit) updates.hourly_limit = Number(editHourlyLimit);
    if (editInterval) updates.message_interval_seconds = Number(editInterval);
    updateNumber.mutate(updates);
  };

  const handleAssignPlan = (planId: string) => {
    updateNumber.mutate({ id: number.id, active_plan_id: planId, current_phase: 1 } as any);
    createEvent.mutate({ number_id: number.id, event_type: 'plan_assigned', severity: 'info', title: 'Plano de aquecimento atribuído' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              {number.session_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate">{number.session_name}</p>
              <p className="text-xs text-muted-foreground">{number.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <ConnectionDot status={number.connection_status} />
              <HealthScoreBadge score={number.health_score} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-2 mt-3">
          <StageBadge stage={number.stage} />
          {number.is_paused && <Badge variant="outline" className="text-[10px] text-amber-600 bg-amber-500/10 border-amber-500/20">Pausado</Badge>}
          {number.connected_at && (
            <span className="text-[10px] text-muted-foreground">Conectado em {format(new Date(number.connected_at), "dd/MM/yyyy", { locale: ptBR })}</span>
          )}
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Métricas</TabsTrigger>
            <TabsTrigger value="config" className="text-xs gap-1"><Settings className="h-3 w-3" /> Config</TabsTrigger>
            <TabsTrigger value="events" className="text-xs gap-1"><History className="h-3 w-3" /> Eventos</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs gap-1"><Shield className="h-3 w-3" /> Ações</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Enviadas Hoje', value: number.current_daily_sent, total: number.daily_limit, icon: Send, color: 'text-primary' },
                { label: 'Recebidas Hoje', value: number.current_daily_received, icon: ArrowDownLeft, color: 'text-blue-500' },
                { label: 'Respondidas Hoje', value: number.current_daily_responded, icon: MessageCircle, color: 'text-green-500' },
              ].map(m => (
                <div key={m.label} className="glass-card rounded-xl p-3 text-center">
                  <m.icon className={`h-4 w-4 mx-auto mb-1 ${m.color}`} />
                  <p className="text-lg font-bold text-foreground tabular-nums">{m.value.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  {'total' in m && m.total && (
                    <Progress value={(m.value / Math.max(1, m.total)) * 100} className="h-1 mt-1.5" />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Tempo Médio de Resposta</span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {number.avg_response_time_seconds ? `${Math.round(number.avg_response_time_seconds / 60)}min` : '—'}
                </p>
              </div>
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Taxa de Resposta</span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">{number.response_rate}%</p>
              </div>
            </div>

            {/* Totals */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Totais Acumulados</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Enviadas', value: number.total_sent },
                  { label: 'Total Recebidas', value: number.total_received },
                  { label: 'Total Respondidas', value: number.total_responded },
                ].map(t => (
                  <div key={t.label} className="text-center">
                    <p className="text-lg font-bold text-foreground tabular-nums">{t.value.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Score de Saúde</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress value={number.health_score} className="h-3" />
                </div>
                <HealthScoreBadge score={number.health_score} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {number.health_score >= 80 ? 'Número saudável e operando normalmente' :
                 number.health_score >= 50 ? 'Atenção: performance abaixo do ideal' :
                 'Alerta crítico: risco de bloqueio detectado'}
              </p>
            </div>
          </TabsContent>

          {/* Config */}
          <TabsContent value="config" className="space-y-4 mt-4">
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Limites Operacionais</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Limite Diário</Label>
                  <Input className="h-8 text-xs" type="number" defaultValue={number.daily_limit} onChange={e => setEditDailyLimit(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Limite/Hora</Label>
                  <Input className="h-8 text-xs" type="number" defaultValue={number.hourly_limit} onChange={e => setEditHourlyLimit(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Intervalo (seg)</Label>
                  <Input className="h-8 text-xs" type="number" defaultValue={number.message_interval_seconds} onChange={e => setEditInterval(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Janela Início</Label>
                  <Input className="h-8 text-xs" type="time" defaultValue={number.send_window_start} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Janela Fim</Label>
                  <Input className="h-8 text-xs" type="time" defaultValue={number.send_window_end} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Pausa automática</Label>
                  <p className="text-[10px] text-muted-foreground">Pausar ao detectar risco</p>
                </div>
                <Switch checked={number.auto_pause_enabled} onCheckedChange={v => updateNumber.mutate({ id: number.id, auto_pause_enabled: v } as any)} />
              </div>
              <Button size="sm" onClick={handleSaveConfig}>Salvar Configurações</Button>
            </div>

            {/* Assign Plan */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Zap className="h-4 w-4" /> Plano de Aquecimento</h3>
              {plans.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum plano criado. Crie um plano na aba "Planos".</p>
              ) : (
                <Select value={number.active_plan_id ?? ''} onValueChange={handleAssignPlan}>
                  <SelectTrigger className="h-8"><SelectValue placeholder="Selecionar plano..." /></SelectTrigger>
                  <SelectContent>
                    {plans.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.total_duration_days}d)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {number.active_plan_id && (
                <p className="text-xs text-muted-foreground">Fase atual: <span className="font-medium text-foreground">{number.current_phase}</span></p>
              )}
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="mt-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Nenhum evento registrado</div>
            ) : (
              <div className="space-y-2">
                {events.map(ev => {
                  const Icon = severityIcon[ev.severity] || Info;
                  return (
                    <div key={ev.id} className="glass-card rounded-lg p-3 flex items-start gap-3">
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${severityColor[ev.severity] || 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{ev.title}</p>
                        {ev.details && <p className="text-xs text-muted-foreground">{ev.details}</p>}
                        <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(ev.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{ev.event_type}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Actions */}
          <TabsContent value="actions" className="space-y-3 mt-4">
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Controle de Operação</h3>
              <Button variant={number.is_paused ? 'default' : 'outline'} className="w-full gap-2" onClick={handlePauseToggle}>
                {number.is_paused ? <><Play className="h-4 w-4" /> Retomar Operação</> : <><Pause className="h-4 w-4" /> Pausar Número</>}
              </Button>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Promover Estágio</h3>
              <p className="text-xs text-muted-foreground">Estágio atual: <StageBadge stage={number.stage} /></p>
              <div className="grid grid-cols-2 gap-2">
                {['new', 'warming', 'stable', 'scale'].map(s => (
                  <Button key={s} variant={number.stage === s ? 'default' : 'outline'} size="sm" className="gap-1 text-xs capitalize" onClick={() => handleStageChange(s)} disabled={number.stage === s}>
                    <ArrowUp className="h-3 w-3" /> {s === 'new' ? 'Novo' : s === 'warming' ? 'Aquecimento' : s === 'stable' ? 'Estável' : 'Escala'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-3 border-destructive/20">
              <h3 className="text-sm font-semibold text-destructive">Zona de Perigo</h3>
              <Button variant="destructive" className="w-full gap-2" onClick={() => { deleteNumber.mutate(number.id); onOpenChange(false); }}>
                <Trash2 className="h-4 w-4" /> Remover Número
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
