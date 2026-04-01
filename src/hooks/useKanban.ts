import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DbPipeline {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  color: string | null;
  is_default: boolean | null;
  created_at: string;
}

export interface DbPipelineColumn {
  id: string;
  pipeline_id: string;
  title: string;
  color: string | null;
  position: number;
}

export interface DbPipelineCard {
  id: string;
  column_id: string;
  contact_id: string | null;
  title: string;
  description: string | null;
  value: number | null;
  priority: string;
  assigned_to: string | null;
  tags: string[] | null;
  due_date: string | null;
  position: number;
  metadata: any;
  created_at: string;
  // joined
  contact_name?: string;
}

export function usePipelines() {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;

  return useQuery({
    queryKey: ['pipelines', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('pipelines')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at');
      if (error) throw error;
      return (data ?? []) as DbPipeline[];
    },
    enabled: !!orgId,
  });
}

export function useCreatePipeline() {
  const qc = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      if (!profile?.current_organization_id) throw new Error('Organização não encontrada. Recarregue a página.');
      const { data: pipeline, error } = await supabase
        .from('pipelines')
        .insert({ ...data, organization_id: profile.current_organization_id })
        .select()
        .single();
      if (error) throw error;

      // Create default columns
      const defaultCols = [
        { title: 'Novos Leads', color: 'hsl(210, 80%, 55%)', position: 0 },
        { title: 'Qualificação', color: 'hsl(38, 90%, 55%)', position: 1 },
        { title: 'Proposta', color: 'hsl(263, 70%, 58%)', position: 2 },
        { title: 'Negociação', color: 'hsl(280, 80%, 65%)', position: 3 },
        { title: 'Fechamento', color: 'hsl(142, 60%, 45%)', position: 4 },
      ];
      await supabase.from('pipeline_columns').insert(
        defaultCols.map(c => ({ ...c, pipeline_id: pipeline.id }))
      );

      return pipeline;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pipelines'] });
      toast({ title: 'Pipeline criado!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

export function usePipelineColumns(pipelineId: string | null) {
  return useQuery({
    queryKey: ['pipeline_columns', pipelineId],
    queryFn: async () => {
      if (!pipelineId) return [];
      const { data, error } = await supabase
        .from('pipeline_columns')
        .select('*')
        .eq('pipeline_id', pipelineId)
        .order('position');
      if (error) throw error;
      return (data ?? []) as DbPipelineColumn[];
    },
    enabled: !!pipelineId,
  });
}

export function useCreateColumn() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { pipeline_id: string; title: string; color?: string; position: number }) => {
      const { data: col, error } = await supabase
        .from('pipeline_columns')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return col;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipeline_columns'] }),
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

export function usePipelineCards(pipelineId: string | null) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['pipeline_cards', pipelineId],
    queryFn: async () => {
      if (!pipelineId) return [];
      // Get column ids for this pipeline
      const { data: cols } = await supabase
        .from('pipeline_columns')
        .select('id')
        .eq('pipeline_id', pipelineId);
      if (!cols?.length) return [];

      const colIds = cols.map(c => c.id);
      const { data, error } = await supabase
        .from('pipeline_cards')
        .select(`*, contacts ( name )`)
        .in('column_id', colIds)
        .order('position');
      if (error) throw error;

      return (data ?? []).map((c: any) => ({
        ...c,
        contact_name: c.contacts?.name ?? null,
      })) as DbPipelineCard[];
    },
    enabled: !!pipelineId,
  });

  // Realtime
  useEffect(() => {
    if (!pipelineId) return;
    const channel = supabase
      .channel(`cards-${pipelineId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pipeline_cards' }, () => {
        qc.invalidateQueries({ queryKey: ['pipeline_cards', pipelineId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [pipelineId, qc]);

  return query;
}

export function useCreateCard() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      column_id: string;
      title: string;
      contact_id?: string;
      value?: number;
      priority?: string;
      tags?: string[];
      due_date?: string;
      position: number;
    }) => {
      const { data: card, error } = await supabase
        .from('pipeline_cards')
        .insert({ ...data, tags: data.tags ?? [] })
        .select()
        .single();
      if (error) throw error;
      return card;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pipeline_cards'] });
      toast({ title: 'Card criado!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

export function useMoveCard() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; column_id: string; position: number }) => {
      const { error } = await supabase
        .from('pipeline_cards')
        .update({ column_id: data.column_id, position: data.position, updated_at: new Date().toISOString() })
        .eq('id', data.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pipeline_cards'] }),
  });
}

export function useUpdateCard() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<DbPipelineCard>) => {
      const { error } = await supabase
        .from('pipeline_cards')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pipeline_cards'] });
      toast({ title: 'Card atualizado!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

export function useDeleteCard() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pipeline_cards').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pipeline_cards'] });
      toast({ title: 'Card removido!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}
