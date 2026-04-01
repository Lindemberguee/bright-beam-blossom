import { DbWhatsAppNumber } from '@/hooks/useWarming';
import { StageBadge, ConnectionDot, HealthScoreBadge } from './WarmingBadges';
import { Send, ArrowDownLeft, MessageCircle, Clock, Pause, AlertTriangle } from 'lucide-react';

interface Props {
  number: DbWhatsAppNumber;
  onClick: () => void;
}

export function NumberCard({ number, onClick }: Props) {
  const isPaused = number.is_paused;
  const hasAlert = number.health_score < 50;

  return (
    <div
      onClick={onClick}
      className="glass-card rounded-xl p-4 hover:bg-accent/50 cursor-pointer transition-all duration-200 border border-border/50 hover:border-primary/30 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {number.session_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{number.session_name}</p>
            <p className="text-xs text-muted-foreground">{number.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPaused && <Pause className="h-3.5 w-3.5 text-amber-500" />}
          {hasAlert && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
          <HealthScoreBadge score={number.health_score} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <ConnectionDot status={number.connection_status} />
        <StageBadge stage={number.stage} />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Send, label: 'Enviadas', value: number.current_daily_sent, max: number.daily_limit },
          { icon: ArrowDownLeft, label: 'Recebidas', value: number.current_daily_received },
          { icon: MessageCircle, label: 'Respondidas', value: number.current_daily_responded },
          { icon: Clock, label: 'Resp. Rate', value: `${number.response_rate}%` },
        ].map(m => (
          <div key={m.label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <m.icon className="h-3 w-3 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground tabular-nums">
              {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
              {'max' in m && m.max ? <span className="text-[10px] text-muted-foreground font-normal">/{m.max}</span> : null}
            </p>
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar for daily usage */}
      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${Math.min(100, (number.current_daily_sent / Math.max(1, number.daily_limit)) * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {number.current_daily_sent}/{number.daily_limit} mensagens hoje
        </p>
      </div>
    </div>
  );
}
