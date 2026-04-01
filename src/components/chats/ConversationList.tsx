import { DbConversation } from '@/hooks/useConversations';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, Pin } from 'lucide-react';

interface Props {
  conversations: DbConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  statusFilter: string;
  onStatusFilter: (f: string) => void;
}

const channelIcons: Record<string, string> = { whatsapp: '🟢', webchat: '🌐', instagram: '📸', email: '📧' };

export function ConversationList({ conversations, selectedId, onSelect, statusFilter, onStatusFilter }: Props) {
  const filters = [
    { key: 'all', label: 'Todas' },
    { key: 'open', label: 'Abertas' },
    { key: 'pending', label: 'Pendentes' },
    { key: 'resolved', label: 'Resolvidas' },
  ];

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <div className="w-80 border-r border-border/50 flex flex-col bg-card/30">
      <div className="p-3 space-y-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Conversas</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
            {conversations.length}
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar conversa..." className="pl-9 h-9 bg-muted/50 border-border/50 text-sm" />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => onStatusFilter(f.key)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full transition-colors",
                statusFilter === f.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {conversations.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">Nenhuma conversa encontrada</div>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full text-left px-3 py-3 border-b border-border/30 transition-all duration-200 hover:bg-accent/50",
              selectedId === conv.id && "bg-accent border-l-2 border-l-primary"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {getInitials(conv.contact_name ?? '')}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{channelIcons[conv.channel] ?? '💬'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                    {conv.is_pinned && <Pin className="h-3 w-3 text-primary" />}
                    {conv.contact_name}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{formatTime(conv.last_message_at)}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.last_message ?? 'Sem mensagens'}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {(conv.unread_count ?? 0) > 0 && (
                    <span className="ml-auto h-4.5 min-w-[18px] bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
