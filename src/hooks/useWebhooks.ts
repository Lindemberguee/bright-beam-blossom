import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Webhook {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  url: string;
  method: string;
  status: string;
  auth_type: string;
  auth_token: string | null;
  headers: Record<string, string>;
  payload_mapping: Record<string, unknown>;
  trigger_flow_id: string | null;
  call_count: number;
  error_count: number;
  last_called_at: string | null;
  last_error_at: string | null;
  last_error_message: string | null;
  tags: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebhookLog {
  id: string;
  webhook_id: string;
  request_body: Record<string, unknown> | null;
  response_status: number | null;
  response_body: string | null;
  error_message: string | null;
  duration_ms: number | null;
  ip_address: string | null;
  success: boolean;
  created_at: string;
}

export function useWebhooks() {
  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Webhook[];
    },
  });

  const createWebhook = useMutation({
    mutationFn: async (input: Partial<Webhook> & { name: string; url: string }) => {
      const { data: profile } = await supabase.from('profiles').select('current_organization_id').single();
      if (!profile?.current_organization_id) throw new Error('Organização não encontrada');

      const { data, error } = await supabase
        .from('webhooks')
        .insert({ ...input, organization_id: profile.current_organization_id } as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook criado com sucesso');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateWebhook = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Webhook>) => {
      const { error } = await supabase.from('webhooks').update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook atualizado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteWebhook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('webhooks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success('Webhook removido');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { webhooks, isLoading, createWebhook, updateWebhook, deleteWebhook };
}

export function useWebhookLogs(webhookId: string | null) {
  return useQuery({
    queryKey: ['webhook-logs', webhookId],
    enabled: !!webhookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('webhook_id', webhookId!)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as unknown as WebhookLog[];
    },
  });
}
