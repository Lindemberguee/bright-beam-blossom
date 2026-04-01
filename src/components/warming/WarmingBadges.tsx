import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const stageConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: 'Novo', color: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20' },
  warming: { label: 'Aquecimento', color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/20' },
  stable: { label: 'Estável', color: 'text-green-600', bg: 'bg-green-500/10 border-green-500/20' },
  scale: { label: 'Escala', color: 'text-violet-600', bg: 'bg-violet-500/10 border-violet-500/20' },
};

const connectionConfig: Record<string, { label: string; dot: string }> = {
  connected: { label: 'Conectado', dot: 'bg-green-500' },
  disconnected: { label: 'Desconectado', dot: 'bg-muted-foreground' },
  error: { label: 'Erro', dot: 'bg-destructive' },
  syncing: { label: 'Sincronizando', dot: 'bg-amber-500' },
};

export function StageBadge({ stage }: { stage: string }) {
  const cfg = stageConfig[stage] ?? stageConfig.new;
  return (
    <Badge variant="outline" className={cn('text-[10px] font-semibold border', cfg.bg, cfg.color)}>
      {cfg.label}
    </Badge>
  );
}

export function ConnectionDot({ status }: { status: string }) {
  const cfg = connectionConfig[status] ?? connectionConfig.disconnected;
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('h-2 w-2 rounded-full animate-pulse', cfg.dot)} />
      <span className="text-xs text-muted-foreground">{cfg.label}</span>
    </div>
  );
}

export function HealthScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600 bg-green-500/10 border-green-500/20' :
    score >= 50 ? 'text-amber-600 bg-amber-500/10 border-amber-500/20' :
    'text-destructive bg-destructive/10 border-destructive/20';
  return (
    <Badge variant="outline" className={cn('text-xs font-bold border tabular-nums', color)}>
      {score}%
    </Badge>
  );
}
