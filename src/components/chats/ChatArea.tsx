import { DbConversation } from '@/hooks/useConversations';
import { DbMessage } from '@/hooks/useMessages';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile, MoreVertical, Phone, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Props {
  conversation: DbConversation;
  messages: DbMessage[];
  onSend: (content: string) => void;
  sending?: boolean;
}

export function ChatArea({ conversation, messages, onSend, sending }: Props) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-border/50 bg-card/30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            {getInitials(conversation.contact_name ?? '')}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{conversation.contact_name}</h3>
            <p className="text-xs text-muted-foreground">{conversation.contact_phone} · {conversation.channel}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StatusBadge status={conversation.status} />
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8"><Phone className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Nenhuma mensagem ainda. Envie a primeira!
          </div>
        )}
        {messages.map((msg) => {
          const isAgent = msg.sender_type === 'agent';
          const isSystem = msg.sender_type === 'system';
          const isNote = msg.type === 'internal_note';

          return (
            <div key={msg.id} className={cn("flex", isAgent ? 'justify-end' : isSystem ? 'justify-center' : 'justify-start')}>
              {isNote ? (
                <div className="bg-warning/10 border border-warning/20 rounded-lg px-4 py-2 max-w-md">
                  <p className="text-xs text-warning font-medium mb-0.5">📝 Nota Interna</p>
                  <p className="text-sm text-warning/80">{msg.content}</p>
                </div>
              ) : (
                <div className={cn(
                  "max-w-md rounded-2xl px-4 py-2.5",
                  isAgent
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-accent text-foreground rounded-bl-md"
                )}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={cn("text-[10px]", isAgent ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                      {formatTime(msg.created_at)}
                    </span>
                    {msg.status === 'read' && <span className="text-[10px]">✓✓</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50 bg-card/30">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><Paperclip className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground"><Mic className="h-4 w-4" /></Button>
          </div>
          <div className="flex-1 relative">
            <Input
              placeholder="Digite uma mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="pr-10 bg-muted/50 border-border/50"
            />
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="icon"
            className="h-10 w-10 rounded-xl glow-primary"
            onClick={handleSend}
            disabled={!message.trim() || sending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
