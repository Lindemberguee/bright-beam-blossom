import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { dashboardStats, mockConversations, mockAuditLogs, mockTeamMembers } from '@/data/mockData';
import {
  MessageSquare, Users, Clock, TrendingUp, Zap, Plug, UserCheck, Megaphone,
  ArrowUpRight, ArrowDownRight, BarChart3, Activity, Target, Timer,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'Seg', chats: 180, resolved: 165 },
  { name: 'Ter', chats: 220, resolved: 200 },
  { name: 'Qua', chats: 195, resolved: 188 },
  { name: 'Qui', chats: 260, resolved: 240 },
  { name: 'Sex', chats: 310, resolved: 290 },
  { name: 'Sáb', chats: 120, resolved: 115 },
  { name: 'Dom', chats: 80, resolved: 78 },
];

const channelData = [
  { name: 'WhatsApp', value: 65, color: 'hsl(142, 60%, 45%)' },
  { name: 'Webchat', value: 25, color: 'hsl(263, 70%, 58%)' },
  { name: 'Instagram', value: 7, color: 'hsl(280, 80%, 65%)' },
  { name: 'Email', value: 3, color: 'hsl(210, 80%, 55%)' },
];

const funnelData = [
  { stage: 'Novos Leads', value: 450 },
  { stage: 'Qualificados', value: 280 },
  { stage: 'Proposta', value: 145 },
  { stage: 'Negociação', value: 89 },
  { stage: 'Fechamento', value: 42 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs text-muted-foreground">
            {entry.name === 'chats' ? 'Chats' : 'Resolvidos'}: <span className="font-semibold text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visão geral da operação em tempo real</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Este mês</option>
          </select>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Atendimentos Hoje" value={dashboardStats.totalChatsToday} change={12.5} changeLabel="vs ontem" icon={MessageSquare} />
        <MetricCard label="Leads Novos" value={dashboardStats.newLeads} change={8.3} changeLabel="vs ontem" icon={Users} />
        <MetricCard label="Tempo Médio Resposta" value={dashboardStats.avgFirstResponse} change={-15.2} changeLabel="mais rápido" icon={Timer} />
        <MetricCard label="Taxa de Conversão" value={`${dashboardStats.conversionRate}%`} change={3.1} changeLabel="vs semana passada" icon={Target} />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Abertas', value: dashboardStats.openChats, icon: MessageSquare },
          { label: 'Pendentes', value: dashboardStats.pendingChats, icon: Clock },
          { label: 'Em Atendimento', value: dashboardStats.inProgressChats, icon: Activity },
          { label: 'Resolvidas', value: dashboardStats.resolvedChats, icon: UserCheck },
          { label: 'Fluxos Ativos', value: dashboardStats.activeFlows, icon: Zap },
          { label: 'Conexões', value: dashboardStats.activeConnections, icon: Plug },
        ].map((m) => (
          <div key={m.label} className="glass-card rounded-xl p-4 text-center">
            <m.icon className="h-4 w-4 text-muted-foreground mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">Volume de Atendimentos</h3>
              <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(263, 70%, 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142, 60%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 15%)" />
              <XAxis dataKey="name" stroke="hsl(215, 15%, 40%)" fontSize={12} />
              <YAxis stroke="hsl(215, 15%, 40%)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="chats" stroke="hsl(263, 70%, 58%)" fill="url(#colorChats)" strokeWidth={2} />
              <Area type="monotone" dataKey="resolved" stroke="hsl(142, 60%, 45%)" fill="url(#colorResolved)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channels Pie */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">Canais</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribuição por canal</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                {channelData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {channelData.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: ch.color }} />
                  <span className="text-muted-foreground">{ch.name}</span>
                </div>
                <span className="font-medium text-foreground">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel + Team + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funnel */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">Funil de Vendas</h3>
          <p className="text-xs text-muted-foreground mb-4">Conversão por etapa</p>
          <div className="space-y-3">
            {funnelData.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{stage.stage}</span>
                  <span className="text-xs font-medium text-foreground">{stage.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(stage.value / funnelData[0].value) * 100}%`,
                      background: `hsl(${263 + i * 15}, 70%, ${58 - i * 5}%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Ranking */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">Ranking de Atendentes</h3>
          <p className="text-xs text-muted-foreground mb-4">Performance do dia</p>
          <div className="space-y-3">
            {mockTeamMembers.filter(m => m.resolvedToday > 0).sort((a, b) => b.resolvedToday - a.resolvedToday).map((member, i) => (
              <div key={member.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}º</span>
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.avgResponseTime} média</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{member.resolvedToday}</p>
                  <p className="text-[10px] text-muted-foreground">resolvidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-1">Atividades Recentes</h3>
          <p className="text-xs text-muted-foreground mb-4">Últimas ações do sistema</p>
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.user} · {log.timestamp.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
