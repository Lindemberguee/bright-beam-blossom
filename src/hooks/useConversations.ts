import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DbConversation {
  id: string;
  organization_id: string;
  contact_id: string;
  channel: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  department: string | null;
  tags: string[] | null;
  is_pinned: boolean | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number | null;
  created_at: string;
  updated_at: string;
  // joined contact fields
  contact_name?: string;
  contact_phone?: string;
  contact_avatar_url?: string;
  // joined assigned profile
  assigned_name?: string;
}

export function useConversations(statusFilter?: string) {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['conversations', orgId, statusFilter],
    queryFn: async () => {
      if (!orgId) return [];

      let q = supabase
        .from('conversations')
        .select(`
          *,
          contacts!conversations_contact_id_fkey ( name, phone, avatar_url )
        `)
        .eq('organization_id', orgId)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (statusFilter && statusFilter !== 'all') {
        q = q.eq('status', statusFilter);
      }

      const { data, error } = await q;
      if (error) throw error;

      return (data ?? []).map((c: any) => ({
        ...c,
        contact_name: c.contacts?.name ?? 'Sem nome',
        contact_phone: c.contacts?.phone ?? '',
        contact_avatar_url: c.contacts?.avatar_url ?? null,
      })) as DbConversation[];
    },
    enabled: !!orgId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!orgId) return;

    const channel = supabase
      .channel('conversations-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orgId, queryClient]);

  return query;
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { contact_id: string; channel?: string }) => {
      if (!profile?.current_organization_id) throw new Error('No organization');
      const { data: conv, error } = await supabase
        .from('conversations')
        .insert({
          organization_id: profile.current_organization_id,
          contact_id: data.contact_id,
          channel: data.channel ?? 'whatsapp',
        })
        .select()
        .single();
      if (error) throw error;
      return conv;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast({ title: 'Conversa criada!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao criar conversa', description: error.message, variant: 'destructive' });
    },
  });
}
