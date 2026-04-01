import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'dot';
  className?: string;
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  connected: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  online: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  open: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
  running: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
  pending: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  away: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  scheduled: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  syncing: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  paused: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  inactive: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  offline: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  resolved: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  completed: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success' },
  closed: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  error: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
  disconnected: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
  failed: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive' },
  customer: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  lead: { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
};

const statusLabels: Record<string, string> = {
  active: 'Ativo', connected: 'Conectado', online: 'Online', open: 'Aberto', running: 'Em execução',
  pending: 'Pendente', away: 'Ausente', scheduled: 'Agendado', syncing: 'Sincronizando',
  draft: 'Rascunho', paused: 'Pausado', inactive: 'Inativo', offline: 'Offline',
  resolved: 'Resolvido', completed: 'Concluído', closed: 'Fechado',
  error: 'Erro', disconnected: 'Desconectado', failed: 'Falhou',
  customer: 'Cliente', lead: 'Lead',
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const colors = statusColors[status] || statusColors.inactive;
  const label = statusLabels[status] || status;

  if (variant === 'dot') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("h-2 w-2 rounded-full", colors.dot)} />
        <span className={cn("text-sm", colors.text)}>{label}</span>
      </div>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", colors.bg, colors.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot)} />
      {label}
    </span>
  );
}
