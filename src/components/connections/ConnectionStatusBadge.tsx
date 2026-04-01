import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, AlertTriangle, QrCode, Pause, Ban, ShieldAlert, Power } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  connected: { label: 'Conectado', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', icon: Wifi },
  connecting: { label: 'Conectando', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20', icon: Loader2 },
  awaiting_qr: { label: 'Aguardando QR', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20', icon: QrCode },
  syncing: { label: 'Sincronizando', color: 'bg-sky-500/15 text-sky-400 border-sky-500/20', icon: Loader2 },
  unstable: { label: 'Instável', color: 'bg-orange-500/15 text-orange-400 border-orange-500/20', icon: AlertTriangle },
  paused: { label: 'Pausado', color: 'bg-slate-500/15 text-slate-400 border-slate-500/20', icon: Pause },
  disconnected: { label: 'Desconectado', color: 'bg-red-500/15 text-red-400 border-red-500/20', icon: WifiOff },
  error: { label: 'Erro', color: 'bg-red-600/15 text-red-500 border-red-600/20', icon: ShieldAlert },
  blocked: { label: 'Bloqueado', color: 'bg-red-700/15 text-red-600 border-red-700/20', icon: Ban },
  disabled: { label: 'Desativado', color: 'bg-zinc-500/15 text-zinc-500 border-zinc-500/20', icon: Power },
};

export function ConnectionStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.disconnected;
  const Icon = config.icon;
  const isAnimated = status === 'connecting' || status === 'syncing';

  return (
    <Badge variant="outline" className={cn('gap-1.5 text-[11px] font-medium px-2.5 py-1', config.color)}>
      <Icon className={cn('h-3 w-3', isAnimated && 'animate-spin')} />
      {config.label}
    </Badge>
  );
}
