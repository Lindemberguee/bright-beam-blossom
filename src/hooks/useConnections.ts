import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Connection {
  id: string;
  organization_id: string;
  name: string;
  channel_type: string;
  status: string;
  phone: string | null;
  identifier: string | null;
  session_name: string | null;
  account_name: string | null;
  avatar_url: string | null;
  health_score: number;
  assigned_flow_id: string | null;
  assigned_queue: string | null;
  assigned_team: string | null;
  available_for_warming: boolean;
  available_for_campaigns: boolean;
  available_for_attendance: boolean;
  tags: string[] | null;
  notes: string | null;
  session_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  last_sync_at: string | null;
  last_activity_at: string | null;
  connected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectionEvent {
  id: string;
  connection_id: string;
  event_type: string;
  severity: string;
  title: string;
  details: string | null;
  user_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export function useConnections() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const orgId = profile?.current_organization_id;

  const connectionsQuery = useQuery({
    queryKey: ['connections', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Connection[];
    },
    enabled: !!orgId,
  });

  const createConnection = useMutation({
    mutationFn: async (conn: {
      name: string;
      channel_type: string;
      phone?: string;
      identifier?: string;
      session_name?: string;
      assigned_queue?: string;
      assigned_team?: string;
      notes?: string;
    }) => {
      if (!orgId) throw new Error('Organização não encontrada');
      const { data, error } = await supabase
        .from('connections')
        .insert({ ...conn, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Conexão criada com sucesso');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateConnection = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Connection> & { id: string }) => {
      const { session_data, metadata, ...rest } = updates;
      const payload: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() };
      if (session_data !== undefined) payload.session_data = session_data as unknown;
      if (metadata !== undefined) payload.metadata = metadata as unknown;
      const { data, error } = await supabase
        .from('connections')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteConnection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('connections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Conexão removida');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const syncConnection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('connections')
        .update({ last_sync_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      // Log sync event
      await supabase.from('connection_events').insert({
        connection_id: id,
        event_type: 'sync',
        severity: 'info',
        title: 'Sincronização manual',
        details: 'Sincronização iniciada pelo usuário',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      toast.success('Sincronização realizada');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    connections: connectionsQuery.data ?? [],
    isLoading: connectionsQuery.isLoading,
    createConnection,
    updateConnection,
    deleteConnection,
    syncConnection,
  };
}

export function useConnectionEvents(connectionId: string | null) {
  return useQuery({
    queryKey: ['connection-events', connectionId],
    queryFn: async () => {
      if (!connectionId) return [];
      const { data, error } = await supabase
        .from('connection_events')
        .select('*')
        .eq('connection_id', connectionId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as ConnectionEvent[];
    },
    enabled: !!connectionId,
  });
}
