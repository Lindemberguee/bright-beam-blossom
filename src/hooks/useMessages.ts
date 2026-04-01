import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DbMessage {
  id: string;
  conversation_id: string;
  content: string;
  type: string;
  sender_type: string;
  sender_id: string | null;
  status: string | null;
  metadata: any;
  created_at: string;
}

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data ?? []) as DbMessage[];
    },
    enabled: !!conversationId,
  });

  // Realtime for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: { conversation_id: string; content: string; type?: string; sender_type?: string }) => {
      const { data: msg, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: data.conversation_id,
          content: data.content,
          type: data.type ?? 'text',
          sender_type: data.sender_type ?? 'agent',
          sender_id: user?.id ?? null,
        })
        .select()
        .single();
      if (error) throw error;

      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({
          last_message: data.content,
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.conversation_id);

      return msg;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversation_id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
