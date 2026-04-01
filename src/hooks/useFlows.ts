import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Node, Edge } from '@xyflow/react';
import { toast } from 'sonner';

export interface Flow {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: string;
  folder: string | null;
  trigger_type: string | null;
  settings: Record<string, any>;
  execution_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export function useFlows() {
  return useQuery({
    queryKey: ['flows'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data as Flow[];
    },
  });
}

export function useFlow(id: string | undefined) {
  return useQuery({
    queryKey: ['flow', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flows')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Flow;
    },
  });
}

export function useFlowNodes(flowId: string | undefined) {
  return useQuery({
    queryKey: ['flow-nodes', flowId],
    enabled: !!flowId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flow_nodes')
        .select('*')
        .eq('flow_id', flowId!);
      if (error) throw error;
      return (data || []).map((n: any) => ({
        id: n.node_id,
        type: n.type,
        position: { x: Number(n.position_x), y: Number(n.position_y) },
        data: n.data || {},
      })) as Node[];
    },
  });
}

export function useFlowEdges(flowId: string | undefined) {
  return useQuery({
    queryKey: ['flow-edges', flowId],
    enabled: !!flowId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flow_edges')
        .select('*')
        .eq('flow_id', flowId!);
      if (error) throw error;
      return (data || []).map((e: any) => ({
        id: e.edge_id,
        source: e.source_node,
        target: e.target_node,
        sourceHandle: e.source_handle || undefined,
        label: e.label || undefined,
        animated: e.animated || false,
      })) as Edge[];
    },
  });
}

export function useCreateFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const { data: profile } = await supabase.from('profiles').select('current_organization_id').eq('id', (await supabase.auth.getUser()).data.user?.id!).single();
      const orgId = profile?.current_organization_id;
      if (!orgId) throw new Error('Organização não encontrada');

      const { data, error } = await supabase
        .from('flows')
        .insert({ name: input.name, description: input.description || null, organization_id: orgId })
        .select()
        .single();
      if (error) throw error;

      // Create default start node
      await supabase.from('flow_nodes').insert({
        flow_id: data.id,
        node_id: 'start-1',
        type: 'start',
        position_x: 300,
        position_y: 50,
        data: { label: 'Início', triggerType: 'message_received' },
      });

      return data as Flow;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Fluxo criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar fluxo'),
  });
}

export function useSaveFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ flowId, nodes, edges, name, status }: { flowId: string; nodes: Node[]; edges: Edge[]; name?: string; status?: string }) => {
      // Update flow metadata
      const updates: any = { updated_at: new Date().toISOString() };
      if (name) updates.name = name;
      if (status) updates.status = status;
      await supabase.from('flows').update(updates).eq('id', flowId);

      // Replace all nodes
      await supabase.from('flow_nodes').delete().eq('flow_id', flowId);
      if (nodes.length > 0) {
        const { error: nodesError } = await supabase.from('flow_nodes').insert(
          nodes.map(n => ({
            flow_id: flowId,
            node_id: n.id,
            type: n.type || 'message',
            position_x: n.position.x,
            position_y: n.position.y,
            data: n.data as any,
          }))
        );
        if (nodesError) throw nodesError;
      }

      // Replace all edges
      await supabase.from('flow_edges').delete().eq('flow_id', flowId);
      if (edges.length > 0) {
        const { error: edgesError } = await supabase.from('flow_edges').insert(
          edges.map(e => ({
            flow_id: flowId,
            edge_id: e.id,
            source_node: e.source,
            target_node: e.target,
            source_handle: e.sourceHandle || null,
            label: (e.label as string) || null,
            animated: e.animated || false,
          }))
        );
        if (edgesError) throw edgesError;
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['flows'] });
      qc.invalidateQueries({ queryKey: ['flow', vars.flowId] });
      toast.success('Fluxo salvo!');
    },
    onError: () => toast.error('Erro ao salvar fluxo'),
  });
}

export function useDeleteFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (flowId: string) => {
      const { error } = await supabase.from('flows').delete().eq('id', flowId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Fluxo excluído');
    },
  });
}
