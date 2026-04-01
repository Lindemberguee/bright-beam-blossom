import { DbConversation } from '@/hooks/useConversations';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Hash, User, Tag, Clock, ChevronRight } from 'lucide-react';

interface Props {
  conversation: DbConversation;
}

export function ContactSidebar({ conversation }: Props) {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins} min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    return `${Math.floor(hrs / 24)}d atrás`;
  };

  const info = [
    { icon: Hash, label: 'Canal', value: conversation.channel },
    { icon: User, label: 'Atendente', value: conversation.assigned_name || 'Não atribuído' },
    { icon: Tag, label: 'Departamento', value: conversation.department || '-' },
    { icon: Clock, label: 'Última msg', value: formatTime(conversation.last_message_at) },
  ];

  return (
    <div className="w-72 border-l border-border/50 bg-card/30 overflow-auto hidden xl:block">
      <div className="p-4 text-center border-b border-border/50">
        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold text-primary mx-auto mb-3">
          {getInitials(conversation.contact_name ?? '')}
        </div>
        <h3 className="font-semibold text-foreground">{conversation.contact_name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{conversation.contact_phone}</p>
        <StatusBadge status={conversation.status} className="mt-2" />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Informações</h4>
          <div className="space-y-2">
            {info.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        {(conversation.tags?.length ?? 0) > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Etiquetas</h4>
            <div className="flex flex-wrap gap-1.5">
              {conversation.tags!.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{tag}</span>
              ))}
            </div>
          </div>
        )}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Ações Rápidas</h4>
          <div className="space-y-1.5">
            {['Transferir conversa', 'Adicionar etiqueta', 'Criar nota', 'Ver perfil completo'].map((action) => (
              <button key={action} className="w-full text-left text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg px-2 py-1.5 transition-colors flex items-center justify-between">
                {action} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
