import { useState } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useMessages, useSendMessage } from '@/hooks/useMessages';
import { ConversationList } from '@/components/chats/ConversationList';
import { ChatArea } from '@/components/chats/ChatArea';
import { ContactSidebar } from '@/components/chats/ContactSidebar';

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: conversations = [], isLoading } = useConversations(statusFilter);
  const activeConversation = conversations.find(c => c.id === selectedChat);
  const { data: messages = [] } = useMessages(selectedChat);
  const sendMessage = useSendMessage();

  const handleSend = (content: string) => {
    if (!selectedChat) return;
    sendMessage.mutate({ conversation_id: selectedChat, content });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] animate-fade-in">
      <ConversationList
        conversations={conversations}
        selectedId={selectedChat}
        onSelect={setSelectedChat}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
      />

      {activeConversation ? (
        <>
          <ChatArea
            conversation={activeConversation}
            messages={messages}
            onSend={handleSend}
            sending={sendMessage.isPending}
          />
          <ContactSidebar conversation={activeConversation} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {isLoading ? 'Carregando conversas...' : 'Selecione uma conversa'}
        </div>
      )}
    </div>
  );
}
