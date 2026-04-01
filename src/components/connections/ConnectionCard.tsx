import { Connection } from '@/hooks/useConnections';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  MessageCircle, Globe, Code, Instagram, Mail, Webhook, Send,
  RefreshCcw, Settings, MoreVertical, Flame, Megaphone, Headphones,
  GitBranch, Users, Layers,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const channelConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  whatsapp_qr: { icon: MessageCircle, label: 'WhatsApp QR', color: 'bg-emerald-500/10 text-emerald-400' },
  whatsapp_api: { icon: MessageCircle, label: 'WhatsApp API', color: 'bg-emerald-600/10 text-emerald-500' },
  webchat: { icon: Globe, label: 'Webchat', color: 'bg-primary/10 text-primary' },
  api: { icon: Code, label: 'API', color: 'bg-sky-500/10 text-sky-400' },
  webhook: { icon: Webhook, label: 'Webhook', color: 'bg-violet-500/10 text-violet-400' },
  instagram: { icon: Instagram, label: 'Instagram', color: 'bg-pink-500/10 text-pink-400' },
  messenger: { icon: Send, label: 'Messenger', color: 'bg-blue-500/10 text-blue-400' },
  telegram: { icon: Send, label: 'Telegram', color: 'bg-sky-400/10 text-sky-300' },
  email: { icon: Mail, label: 'E-mail', color: 'bg-amber-500/10 text-amber-400' },
};

interface Props {
  connection: Connection;
  onSync: () => void;
  onOpen: () => void;
  onDelete: () => void;
}

export function ConnectionCard({ connection: conn, onSync, onOpen, onDelete }: Props) {
  const channel = channelConfig[conn.channel_type] || channelConfig.api;
  const Icon = channel.icon;

  const healthColor = conn.health_score >= 80
    ? 'text-emerald-400'
    : conn.health_score >= 50
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div
      className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={onOpen}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center', channel.color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{conn.name}</h3>
            <p className="text-xs text-muted-foreground">{channel.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatusBadge status={conn.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onOpen}>
                <Settings className="h-4 w-4 mr-2" /> Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSync}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Sincronizar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Desconectar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        {conn.phone && (
          <InfoRow label="Telefone" value={conn.phone} />
        )}
        {conn.identifier && !conn.phone && (
          <InfoRow label="Identificador" value={conn.identifier} />
        )}
        <InfoRow
          label="Saúde"
          value={
            <span className={cn('font-semibold', healthColor)}>{conn.health_score}%</span>
          }
        />
        <InfoRow
          label="Última sinc."
          value={conn.last_sync_at ? format(new Date(conn.last_sync_at), "dd/MM HH:mm", { locale: ptBR }) : '—'}
        />
      </div>

      {/* Availability badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {conn.available_for_warming && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Flame className="h-2.5 w-2.5" /> Aquecimento
          </span>
        )}
        {conn.available_for_campaigns && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Megaphone className="h-2.5 w-2.5" /> Campanhas
          </span>
        )}
        {conn.available_for_attendance && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Headphones className="h-2.5 w-2.5" /> Atendimento
          </span>
        )}
      </div>

      {/* Linked resources */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {conn.assigned_queue && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            <Layers className="h-2.5 w-2.5" /> {conn.assigned_queue}
          </span>
        )}
        {conn.assigned_team && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            <Users className="h-2.5 w-2.5" /> {conn.assigned_team}
          </span>
        )}
        {conn.assigned_flow_id && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            <GitBranch className="h-2.5 w-2.5" /> Fluxo
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 text-xs"
          onClick={(e) => { e.stopPropagation(); onSync(); }}
        >
          <RefreshCcw className="h-3 w-3" /> Sincronizar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-xs">{value}</span>
    </div>
  );
}
