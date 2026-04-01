import { mockWebhooks } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Search, Webhook, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Webhooks() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Webhooks</h1>
          <p className="text-sm text-muted-foreground">Endpoints de entrada para integrações externas</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Webhook</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar webhook..." className="pl-9 bg-muted/50 border-border/50" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Nome</TableHead>
              <TableHead className="text-muted-foreground">URL</TableHead>
              <TableHead className="text-muted-foreground">Método</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Chamadas</TableHead>
              <TableHead className="text-muted-foreground text-right">Erros</TableHead>
              <TableHead className="text-muted-foreground">Última chamada</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockWebhooks.map((wh) => (
              <TableRow key={wh.id} className="border-border/30 hover:bg-accent/50 cursor-pointer transition-colors">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Webhook className="h-4 w-4 text-primary" /></div>
                    <span className="text-sm font-medium text-foreground">{wh.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{wh.url}</code>
                    <button className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">{wh.method}</span></TableCell>
                <TableCell><StatusBadge status={wh.status} /></TableCell>
                <TableCell className="text-right text-sm text-foreground font-medium">{wh.callCount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {wh.errorCount > 0 ? (
                    <span className="text-sm text-destructive font-medium flex items-center gap-1 justify-end">
                      <AlertTriangle className="h-3 w-3" /> {wh.errorCount}
                    </span>
                  ) : <span className="text-sm text-success">0</span>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{wh.lastCalled}</TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ExternalLink className="h-4 w-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
