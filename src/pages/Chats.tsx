import { useState } from 'react';
import { mockConversations, mockMessages } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Search, Filter, Pin, Star, Send, Paperclip, Smile, MoreVertical, Phone, Video,
  User, Tag, Clock, MessageCircle, ChevronRight, Hash, ArrowRight, FileText, Mic,
} from 'lucide-react';

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]?.id);
  const [message, setMessage] = useState('');
  const activeConversation = mockConversations.find(c => c.id === selectedChat);

  const channelIcons: Record<string, string> = { whatsapp: '🟢', webchat: '🌐', instagram: '📸', email: '📧' };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] animate-fade-in">
      {/* Conversations List */}
      <div className="w-80 border-r border-border/50 flex flex-col bg-card/30">
        <div className="p-3 space-y-2 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Conversas</h2>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{mockConversations.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar conversa..." className="pl-9 h-9 bg-muted/50 border-border/50 text-sm" />
          </div>
          <div className="flex gap-1.5">
            {['Todas', 'Abertas', 'Pendentes', 'Resolvidas'].map((f) => (
              <button key={f} className={cn("text-xs px-2.5 py-1 rounded-full transition-colors", f === 'Todas' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent')}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {mockConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className={cn(
                "w-full text-left px-3 py-3 border-b border-border/30 transition-all duration-200 hover:bg-accent/50",
                selectedChat === conv.id && "bg-accent border-l-2 border-l-primary"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {conv.contactName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{channelIcons[conv.channel]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                      {conv.isPinned && <Pin className="h-3 w-3 text-primary" />}
                      {conv.contactName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {conv.assignedName && <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{conv.assignedName}</span>}
                    {conv.unreadCount > 0 && (
                      <span className="ml-auto h-4.5 min-w-[18px] bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center px-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-border/50 bg-card/30">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                {activeConversation.contactName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{activeConversation.contactName}</h3>
                <p className="text-xs text-muted-foreground">{activeConversation.contactPhone} · {activeConversation.channel}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <StatusBadge status={activeConversation.status} />
              <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === 'agent' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start')}>
                {msg.type === 'internal_note' ? (
                  <div className="bg-warning/10 border border-warning/20 rounded-lg px-4 py-2 max-w-md">
                    <p className="text-xs text-warning font-medium mb-0.5">📝 Nota Interna</p>
                    <p className="text-sm text-warning/80">{msg.content}</p>
                  </div>
                ) : (
                  <div className={cn(
                    "max-w-md rounded-2xl px-4 py-2.5",
                    msg.sender === 'agent'
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-accent text-foreground rounded-bl-md"
                  )}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className={cn("text-[10px]", msg.sender === 'agent' ? 'text-primary-foreground/60' : 'text-muted-foreground')}>{msg.timestamp}</span>
                      {msg.status === 'read' && <span className="text-[10px]">✓✓</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Message Input */}
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
                  className="pr-10 bg-muted/50 border-border/50"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"><Smile className="h-4 w-4" /></Button>
              </div>
              <Button size="icon" className="h-10 w-10 rounded-xl glow-primary"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Selecione uma conversa</div>
      )}

      {/* Contact Sidebar */}
      {activeConversation && (
        <div className="w-72 border-l border-border/50 bg-card/30 overflow-auto hidden xl:block">
          <div className="p-4 text-center border-b border-border/50">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold text-primary mx-auto mb-3">
              {activeConversation.contactName.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="font-semibold text-foreground">{activeConversation.contactName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{activeConversation.contactPhone}</p>
            <StatusBadge status={activeConversation.status} className="mt-2" />
          </div>
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Informações</h4>
              <div className="space-y-2">
                {[
                  { icon: Hash, label: 'Canal', value: activeConversation.channel },
                  { icon: User, label: 'Atendente', value: activeConversation.assignedName || 'Não atribuído' },
                  { icon: Tag, label: 'Departamento', value: activeConversation.department || '-' },
                  { icon: Clock, label: 'Última msg', value: `${activeConversation.lastMessageTime} atrás` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="text-foreground font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            {activeConversation.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Etiquetas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeConversation.tags.map((tag) => (
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
      )}
    </div>
  );
}
