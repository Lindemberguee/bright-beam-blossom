import { mockCampaigns } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Search, Megaphone, Send, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Campaigns() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Campanhas</h1>
          <p className="text-sm text-muted-foreground">Gerencie disparos e campanhas de comunicação</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Campanha</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Enviadas', value: '5.740', icon: Send, color: 'text-primary' },
          { label: 'Entregues', value: '5.576', icon: CheckCircle, color: 'text-success' },
          { label: 'Respostas', value: '1.464', icon: MessageCircle, color: 'text-info' },
          { label: 'Falhas', value: '164', icon: XCircle, color: 'text-destructive' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
            <div>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar campanha..." className="pl-9 bg-muted/50 border-border/50" />
      </div>

      {/* Table */}
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
              <TableHead className="text-muted-foreground text-right">Respostas</TableHead>
              <TableHead className="text-muted-foreground text-right">Falhas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCampaigns.map((campaign) => (
              <TableRow key={campaign.id} className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Megaphone className="h-4 w-4 text-primary" /></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.createdAt}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><StatusBadge status={campaign.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">{campaign.type === 'mass' ? 'Em massa' : campaign.type === 'segmented' ? 'Segmentada' : 'Reativação'}</TableCell>
                <TableCell className="text-right text-sm text-foreground font-medium">{campaign.targetCount.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm text-foreground">{campaign.sentCount.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm text-success">{campaign.deliveredCount.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm text-info">{campaign.responseCount.toLocaleString()}</TableCell>
                <TableCell className="text-right text-sm text-destructive">{campaign.failedCount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
