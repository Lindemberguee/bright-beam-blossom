import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Webhook, WebhookLog, useWebhookLogs } from '@/hooks/useWebhooks';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Copy, Trash2, AlertTriangle, CheckCircle2, XCircle, Clock, Globe, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Props {
  webhook: Webhook | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdate: (id: string, updates: Partial<Webhook>) => void;
  onDelete: (id: string) => void;
}

export function WebhookDetailSheet({ webhook, open, onOpenChange, onUpdate, onDelete }: Props) {
  const { data: logs = [] } = useWebhookLogs(webhook?.id ?? null);

  if (!webhook) return null;

  const copyUrl = () => {
    navigator.clipboard.writeText(webhook.url);
    toast.success('URL copiada');
  };

  const successRate = webhook.call_count > 0
    ? Math.round(((webhook.call_count - webhook.error_count) / webhook.call_count) * 100)
    : 100;

  const authLabel: Record<string, string> = {
    none: 'Sem autenticação',
    bearer: 'Bearer Token',
    api_key: 'API Key',
    basic: 'Basic Auth',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">{webhook.method}</span>
            {webhook.name}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status & toggle */}
          <div className="flex items-center justify-between">
            <StatusBadge status={webhook.status} />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Ativo</span>
              <Switch
                checked={webhook.status === 'active'}
                onCheckedChange={(checked) => onUpdate(webhook.id, { status: checked ? 'active' : 'inactive' })}
              />
            </div>
          </div>

          {/* URL */}
          <div className="glass-card rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">URL do Endpoint</p>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate text-foreground">{webhook.url}</code>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyUrl}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <MetricBox icon={Globe} label="Chamadas" value={webhook.call_count.toLocaleString()} color="text-primary" />
            <MetricBox icon={AlertTriangle} label="Erros" value={webhook.error_count.toString()} color="text-destructive" />
            <MetricBox icon={CheckCircle2} label="Sucesso" value={`${successRate}%`} color="text-emerald-400" />
          </div>

          {/* Info */}
          <div className="space-y-3">
            <InfoRow label="Autenticação" value={authLabel[webhook.auth_type] || webhook.auth_type} icon={Shield} />
            <InfoRow label="Última chamada" value={webhook.last_called_at ? format(new Date(webhook.last_called_at), "dd/MM/yyyy HH:mm", { locale: ptBR }) : 'Nunca'} icon={Clock} />
            {webhook.description && <InfoRow label="Descrição" value={webhook.description} />}
            {webhook.notes && <InfoRow label="Observações" value={webhook.notes} />}
          </div>

          {/* Tags */}
          {webhook.tags && webhook.tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {webhook.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              </div>
            </div>
          )}

          {/* Last error */}
          {webhook.last_error_message && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs font-semibold text-destructive">Último erro</span>
              </div>
              <p className="text-xs text-muted-foreground">{webhook.last_error_message}</p>
              {webhook.last_error_at && (
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  {format(new Date(webhook.last_error_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                </p>
              )}
            </div>
          )}

          <Separator />

          {/* Logs */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Últimas chamadas</h4>
            {logs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhuma chamada registrada</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {logs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <Button variant="destructive" size="sm" className="w-full gap-2" onClick={() => { onDelete(webhook.id); onOpenChange(false); }}>
            <Trash2 className="h-4 w-4" /> Excluir Webhook
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetricBox({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="glass-card rounded-lg p-3 text-center">
      <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function LogEntry({ log }: { log: WebhookLog }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
      {log.success ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-destructive shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {log.response_status && (
            <span className={`text-xs font-mono font-bold ${log.success ? 'text-emerald-400' : 'text-destructive'}`}>
              {log.response_status}
            </span>
          )}
          {log.duration_ms != null && (
            <span className="text-[10px] text-muted-foreground">{log.duration_ms}ms</span>
          )}
        </div>
        {log.error_message && <p className="text-[10px] text-destructive truncate">{log.error_message}</p>}
      </div>
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
        {format(new Date(log.created_at), "HH:mm:ss", { locale: ptBR })}
      </span>
    </div>
  );
}
