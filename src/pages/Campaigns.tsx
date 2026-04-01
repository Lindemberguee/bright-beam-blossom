import { useState } from 'react';
import { useCampaigns, DbCampaign } from '@/hooks/useCampaigns';
import { CreateCampaignDialog } from '@/components/campaigns/CreateCampaignDialog';
import { CampaignDetailSheet } from '@/components/campaigns/CampaignDetailSheet';
import { ContactListsTab } from '@/components/campaigns/ContactListsTab';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Send, CheckCircle, XCircle, MessageCircle, Eye, Search, Megaphone, List } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Campaigns() {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DbCampaign | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totals = campaigns.reduce(
    (acc, c) => ({
      sent: acc.sent + c.sent_count,
      delivered: acc.delivered + c.delivered_count,
      responses: acc.responses + c.response_count,
      failed: acc.failed + c.failed_count,
    }),
    { sent: 0, delivered: 0, responses: 0, failed: 0 }
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Campanhas</h1>
          <p className="text-sm text-muted-foreground">Gerencie disparos e campanhas de comunicação</p>
        </div>
        <CreateCampaignDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Enviadas', value: totals.sent, icon: Send, color: 'text-primary' },
          { label: 'Entregues', value: totals.delivered, icon: CheckCircle, color: 'text-green-500' },
          { label: 'Respostas', value: totals.responses, icon: MessageCircle, color: 'text-blue-500' },
          { label: 'Falhas', value: totals.failed, icon: XCircle, color: 'text-destructive' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
            <div>
              <p className="text-lg font-bold text-foreground">{s.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns" className="gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Campanhas</TabsTrigger>
          <TabsTrigger value="lists" className="gap-1.5"><List className="h-3.5 w-3.5" /> Listas de Contatos</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar campanha..." className="pl-9 bg-muted/50 border-border/50" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium">Nenhuma campanha encontrada</p>
              <p className="text-xs">Crie sua primeira campanha para começar</p>
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="text-muted-foreground">Campanha</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground text-right">Alvo</TableHead>
                    <TableHead className="text-muted-foreground text-right">Enviadas</TableHead>
                    <TableHead className="text-muted-foreground text-right">Entregues</TableHead>
                    <TableHead className="text-muted-foreground text-right">Lidas</TableHead>
                    <TableHead className="text-muted-foreground text-right">Respostas</TableHead>
                    <TableHead className="text-muted-foreground text-right">Falhas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow
                      key={c.id}
                      className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => { setSelected(c); setSheetOpen(true); }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Megaphone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(c.created_at), "dd MMM yyyy", { locale: ptBR })}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={c.status} /></TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {c.type === 'mass' ? 'Em Massa' : c.type === 'segmented' ? 'Segmentada' : 'Reativação'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium text-foreground">{c.target_count.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-foreground">{c.sent_count.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-green-500">{c.delivered_count.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-blue-500">{c.read_count.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-violet-500">{c.response_count.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm text-destructive">{c.failed_count.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lists">
          <ContactListsTab />
        </TabsContent>
      </Tabs>

      <CampaignDetailSheet campaign={selected} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
