import { mockTeamMembers } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MessageSquare, Clock, CheckCircle, MoreHorizontal, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleLabels: Record<string, string> = {
  owner: 'Proprietário', admin: 'Administrador', manager: 'Gestor', operator: 'Operador', analyst: 'Analista',
};

export default function Team() {
  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Equipe</h1>
          <p className="text-sm text-muted-foreground">{mockTeamMembers.length} membros · {mockTeamMembers.filter(m => m.status === 'online').length} online</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Convidar Membro</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar membro..." className="pl-9 bg-muted/50 border-border/50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockTeamMembers.map((member) => (
          <div key={member.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
                    member.status === 'online' ? 'bg-success' : member.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                  )} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <Shield className="h-3 w-3" /> {roleLabels[member.role]}
              </span>
              {member.department && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{member.department}</span>}
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                  <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> {member.activeChats}
                </div>
                <p className="text-[10px] text-muted-foreground">ativos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" /> {member.resolvedToday}
                </div>
                <p className="text-[10px] text-muted-foreground">resolvidos</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {member.avgResponseTime}
                </div>
                <p className="text-[10px] text-muted-foreground">tempo resp.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
