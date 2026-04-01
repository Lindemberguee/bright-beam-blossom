import { mockAuditLogs } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Search, Download, Filter, Shield, Clock, User, Activity } from 'lucide-react';

export default function Audit() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Auditoria</h1>
          <p className="text-sm text-muted-foreground">Logs de ações, segurança e rastreabilidade</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar log..." className="pl-9 bg-muted/50 border-border/50" />
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filtros</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-muted-foreground">Data/Hora</TableHead>
              <TableHead className="text-muted-foreground">Ação</TableHead>
              <TableHead className="text-muted-foreground">Módulo</TableHead>
              <TableHead className="text-muted-foreground">Usuário</TableHead>
              <TableHead className="text-muted-foreground">Detalhes</TableHead>
              <TableHead className="text-muted-foreground">IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log) => (
              <TableRow key={log.id} className="border-border/30 hover:bg-accent/50 transition-colors">
                <TableCell className="text-sm text-muted-foreground font-mono text-xs">{log.timestamp}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm text-foreground">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell><span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{log.module}</span></TableCell>
                <TableCell className="text-sm text-foreground">{log.user}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{log.ip || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
