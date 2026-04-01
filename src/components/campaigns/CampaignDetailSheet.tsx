import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DbCampaign, useCampaignContacts, useUpdateCampaign, useDeleteCampaign } from '@/hooks/useCampaigns';
import { Send, CheckCircle, Eye, MessageCircle, XCircle, Trash2, Play, Pause, Users, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  campaign: DbCampaign | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CampaignDetailSheet({ campaign, open, onOpenChange }: Props) {
  const { data: recipients = [] } = useCampaignContacts(campaign?.id);
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();

  if (!campaign) return null;

  const total = campaign.target_count || 1;
  const deliveryRate = total > 0 ? Math.round((campaign.delivered_count / total) * 100) : 0;
  const readRate = total > 0 ? Math.round((campaign.read_count / total) * 100) : 0;
  const responseRate = total > 0 ? Math.round((campaign.response_count / total) * 100) : 0;

  const typeLabel = campaign.type === 'mass' ? 'Em Massa' : campaign.type === 'segmented' ? 'Segmentada' : 'Reativação';

  const handleStatusChange = (status: string) => {
    updateCampaign.mutate({ id: campaign.id, status } as any);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between pr-4">
            <span className="truncate">{campaign.name}</span>
            <StatusBadge status={campaign.status} />
          </SheetTitle>
          {campaign.description && (
            <p className="text-sm text-muted-foreground">{campaign.description}</p>
          )}
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1 gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Visão Geral</TabsTrigger>
            <TabsTrigger value="recipients" className="flex-1 gap-1.5"><Users className="h-3.5 w-3.5" /> Destinatários</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Enviadas', value: campaign.sent_count, icon: Send, color: 'text-primary' },
                { label: 'Entregues', value: campaign.delivered_count, icon: CheckCircle, color: 'text-green-500' },
                { label: 'Lidas', value: campaign.read_count, icon: Eye, color: 'text-blue-500' },
                { label: 'Respostas', value: campaign.response_count, icon: MessageCircle, color: 'text-violet-500' },
                { label: 'Falhas', value: campaign.failed_count, icon: XCircle, color: 'text-destructive' },
                { label: 'Total Alvo', value: campaign.target_count, icon: Users, color: 'text-muted-foreground' },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.value.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Funnel */}
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Funil de Entrega</h3>
              <div className="space-y-2">
                {[
                  { label: 'Entrega', pct: deliveryRate, color: 'bg-green-500' },
                  { label: 'Leitura', pct: readRate, color: 'bg-blue-500' },
                  { label: 'Resposta', pct: responseRate, color: 'bg-violet-500' },
                ].map(f => (
                  <div key={f.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{f.label}</span>
                      <span className="font-medium text-foreground">{f.pct}%</span>
                    </div>
                    <Progress value={f.pct} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="glass-card rounded-xl p-4 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Detalhes</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Tipo:</span> <Badge variant="outline" className="ml-1">{typeLabel}</Badge></div>
                <div><span className="text-muted-foreground">Criada em:</span> <span className="ml-1 text-foreground">{format(new Date(campaign.created_at), "dd MMM yyyy", { locale: ptBR })}</span></div>
                {campaign.scheduled_at && (
                  <div className="col-span-2"><span className="text-muted-foreground">Agendada:</span> <span className="ml-1 text-foreground">{format(new Date(campaign.scheduled_at), "dd MMM yyyy HH:mm", { locale: ptBR })}</span></div>
                )}
              </div>
            </div>

            {/* Template preview */}
            {campaign.message_template && (
              <div className="glass-card rounded-xl p-4 space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Template da Mensagem</h3>
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap">
                  {campaign.message_template}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {campaign.status === 'draft' && (
                <Button className="flex-1 gap-1.5" onClick={() => handleStatusChange('scheduled')}>
                  <Play className="h-4 w-4" /> Iniciar
                </Button>
              )}
              {campaign.status === 'running' && (
                <Button variant="outline" className="flex-1 gap-1.5" onClick={() => handleStatusChange('paused')}>
                  <Pause className="h-4 w-4" /> Pausar
                </Button>
              )}
              {campaign.status === 'paused' && (
                <Button className="flex-1 gap-1.5" onClick={() => handleStatusChange('running')}>
                  <Play className="h-4 w-4" /> Retomar
                </Button>
              )}
              <Button
                variant="destructive"
                size="icon"
                onClick={() => { deleteCampaign.mutate(campaign.id); onOpenChange(false); }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="mt-4">
            {recipients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum destinatário adicionado ainda
              </div>
            ) : (
              <div className="space-y-2">
                {recipients.map((r: any) => (
                  <div key={r.id} className="glass-card rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.contacts?.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{r.contacts?.phone ?? r.contacts?.email}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
