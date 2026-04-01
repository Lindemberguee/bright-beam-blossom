import { useState } from 'react';
import { useWhatsAppNumbers, DbWhatsAppNumber, useWarmingPlans } from '@/hooks/useWarming';
import { AddNumberDialog } from '@/components/warming/AddNumberDialog';
import { CreatePlanDialog } from '@/components/warming/CreatePlanDialog';
import { NumberCard } from '@/components/warming/NumberCard';
import { NumberDetailSheet } from '@/components/warming/NumberDetailSheet';
import { StageBadge } from '@/components/warming/WarmingBadges';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Flame, Smartphone, Activity, Shield, AlertTriangle, CheckCircle, Pause,
  Zap, ArrowUpRight, BarChart3, Clock
} from 'lucide-react';

export default function Warming() {
  const { data: numbers = [], isLoading } = useWhatsAppNumbers();
  const { data: plans = [] } = useWarmingPlans();
  const [selected, setSelected] = useState<DbWhatsAppNumber | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const stats = {
    total: numbers.length,
    connected: numbers.filter(n => n.connection_status === 'connected').length,
    warming: numbers.filter(n => n.stage === 'warming').length,
    stable: numbers.filter(n => n.stage === 'stable').length,
    scale: numbers.filter(n => n.stage === 'scale').length,
    paused: numbers.filter(n => n.is_paused).length,
    alerts: numbers.filter(n => n.health_score < 50).length,
    avgHealth: numbers.length > 0 ? Math.round(numbers.reduce((s, n) => s + n.health_score, 0) / numbers.length) : 0,
    totalSentToday: numbers.reduce((s, n) => s + n.current_daily_sent, 0),
    totalResponseRate: numbers.length > 0 ? Math.round(numbers.reduce((s, n) => s + n.response_rate, 0) / numbers.length) : 0,
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Aquecimento Inteligente</h1>
            <p className="text-sm text-muted-foreground">Gestão de reputação e ramp-up de números WhatsApp</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CreatePlanDialog />
          <AddNumberDialog />
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Números Conectados', value: `${stats.connected}/${stats.total}`, icon: Smartphone, color: 'text-primary' },
          { label: 'Em Aquecimento', value: stats.warming, icon: Flame, color: 'text-amber-500' },
          { label: 'Estáveis', value: stats.stable, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Pausados/Alerta', value: `${stats.paused}/${stats.alerts}`, icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Saúde Média', value: `${stats.avgHealth}%`, icon: Shield, color: stats.avgHealth >= 80 ? 'text-green-500' : stats.avgHealth >= 50 ? 'text-amber-500' : 'text-destructive' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-3.5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><s.icon className={`h-4 w-4 ${s.color}`} /></div>
            <div>
              <p className="text-lg font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Bar */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground tabular-nums">{stats.totalSentToday.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Enviadas Hoje</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-bold text-foreground tabular-nums">{stats.totalResponseRate}%</p>
              <p className="text-[10px] text-muted-foreground">Taxa Resp. Média</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-violet-500" />
            <div>
              <p className="text-sm font-bold text-foreground tabular-nums">{plans.length}</p>
              <p className="text-[10px] text-muted-foreground">Planos Ativos</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Saúde Geral:</span>
          <Progress value={stats.avgHealth} className="w-24 h-2" />
          <span className="text-xs font-bold text-foreground">{stats.avgHealth}%</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="numbers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="numbers" className="gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Números</TabsTrigger>
          <TabsTrigger value="plans" className="gap-1.5"><Flame className="h-3.5 w-3.5" /> Planos</TabsTrigger>
        </TabsList>

        {/* Numbers Grid */}
        <TabsContent value="numbers">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : numbers.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium">Nenhum número cadastrado</p>
              <p className="text-xs">Adicione seu primeiro número WhatsApp para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {numbers.map(n => (
                <NumberCard key={n.id} number={n} onClick={() => { setSelected(n); setSheetOpen(true); }} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans">
          {plans.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Flame className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium">Nenhum plano de aquecimento</p>
              <p className="text-xs">Crie um plano para definir a evolução operacional dos números</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="glass-card rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                      {plan.description && <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>}
                    </div>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Clock className="h-3 w-3" /> {plan.total_duration_days}d
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {(plan.warming_phases ?? [])
                      .sort((a, b) => a.phase_number - b.phase_number)
                      .map((phase, idx) => (
                      <div key={phase.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50 border border-border/30">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{phase.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {phase.duration_days}d · {phase.daily_limit}/dia · {phase.hourly_limit}/h · {phase.message_interval_seconds}s intervalo
                          </p>
                        </div>
                        <StageBadge stage={phase.target_stage} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                    <span>{(plan.warming_phases ?? []).length} fases</span>
                    {plan.is_default && <Badge variant="secondary" className="text-[10px]">Padrão</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NumberDetailSheet number={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
