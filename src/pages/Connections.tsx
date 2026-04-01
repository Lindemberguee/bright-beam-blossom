import { mockConnections } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Plus, Plug, MessageCircle, Globe, Code, Instagram, Mail, RefreshCcw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, any> = {
  whatsapp: MessageCircle,
  webchat: Globe,
  api: Code,
  instagram: Instagram,
  email: Mail,
};

const typeColors: Record<string, string> = {
  whatsapp: 'bg-success/10 text-success',
  webchat: 'bg-primary/10 text-primary',
  api: 'bg-info/10 text-info',
  instagram: 'bg-pink-500/10 text-pink-400',
  email: 'bg-warning/10 text-warning',
};

export default function Connections() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Conexões</h1>
          <p className="text-sm text-muted-foreground">Gerencie canais e integrações</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nova Conexão</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockConnections.map((conn) => {
          const Icon = typeIcons[conn.type] || Plug;
          return (
            <div key={conn.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", typeColors[conn.type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{conn.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{conn.type}</p>
                  </div>
                </div>
                <StatusBadge status={conn.status} />
              </div>

              <div className="space-y-2 mb-4">
                {conn.phone && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Telefone</span>
                    <span className="text-foreground font-medium">{conn.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Última sinc.</span>
                  <span className="text-foreground">{conn.lastSync || '-'}</span>
                </div>
                {conn.assignedFlow && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fluxo</span>
                    <span className="text-foreground text-xs">{conn.assignedFlow}</span>
                  </div>
                )}
                {conn.queue && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fila</span>
                    <span className="text-foreground">{conn.queue}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-border/30">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs"><RefreshCcw className="h-3 w-3" /> Sincronizar</Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Settings className="h-3 w-3" /></Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
