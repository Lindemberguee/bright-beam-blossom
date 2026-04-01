import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DbWhatsAppNumber {
  id: string;
  organization_id: string;
  phone: string;
  session_name: string;
  connection_status: string;
  stage: string;
  health_score: number;
  daily_limit: number;
  hourly_limit: number;
  current_daily_sent: number;
  current_daily_received: number;
  current_daily_responded: number;
  total_sent: number;
  total_received: number;
  total_responded: number;
  response_rate: number;
  avg_response_time_seconds: number | null;
  active_plan_id: string | null;
  current_phase: number;
  send_window_start: string;
  send_window_end: string;
  message_interval_seconds: number;
  auto_pause_enabled: boolean;
  is_paused: boolean;
  pause_reason: string | null;
  connected_at: string | null;
  last_activity_at: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DbWarmingPlan {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  total_duration_days: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbWarmingPhase {
  id: string;
  plan_id: string;
  phase_number: number;
  name: string;
  description: string | null;
  duration_days: number;
  daily_limit: number;
  hourly_limit: number;
  message_interval_seconds: number;
  target_stage: string;
  priority_contacts_only: boolean;
  min_response_rate: number;
  created_at: string;
}

export interface DbNumberEvent {
  id: string;
  number_id: string;
  event_type: string;
  severity: string;
  title: string;
  details: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

// ── Numbers ──
export function useWhatsAppNumbers() {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;
  return useQuery({
    queryKey: ['whatsapp-numbers', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('whatsapp_numbers')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as DbWhatsAppNumber[];
    },
    enabled: !!orgId,
  });
}

export function useWhatsAppNumber(id: string | undefined) {
  return useQuery({
    queryKey: ['whatsapp-number', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('whatsapp_numbers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as DbWhatsAppNumber;
    },
    enabled: !!id,
  });
}

export function useCreateWhatsAppNumber() {
  const qc = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (num: { phone: string; session_name: string; daily_limit?: number; hourly_limit?: number }) => {
      if (!profile?.current_organization_id) throw new Error('No org');
      const { data, error } = await supabase
        .from('whatsapp_numbers')
        .insert({ ...num, organization_id: profile.current_organization_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['whatsapp-numbers'] });
      toast({ title: 'Número adicionado com sucesso!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

export function useUpdateWhatsAppNumber() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<DbWhatsAppNumber>) => {
      const { data, error } = await supabase
        .from('whatsapp_numbers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['whatsapp-numbers'] });
      qc.invalidateQueries({ queryKey: ['whatsapp-number'] });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

export function useDeleteWhatsAppNumber() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('whatsapp_numbers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['whatsapp-numbers'] });
      toast({ title: 'Número removido!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

// ── Plans ──
export function useWarmingPlans() {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;
  return useQuery({
    queryKey: ['warming-plans', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('warming_plans')
        .select('*, warming_phases(*)')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as (DbWarmingPlan & { warming_phases: DbWarmingPhase[] })[];
    },
    enabled: !!orgId,
  });
}

export function useCreateWarmingPlan() {
  const qc = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (plan: { name: string; description?: string; total_duration_days?: number; phases: Omit<DbWarmingPhase, 'id' | 'plan_id' | 'created_at'>[] }) => {
      if (!profile?.current_organization_id) throw new Error('No org');
      const { data, error } = await supabase
        .from('warming_plans')
        .insert({ name: plan.name, description: plan.description, total_duration_days: plan.total_duration_days ?? 30, organization_id: profile.current_organization_id })
        .select()
        .single();
      if (error) throw error;
      if (plan.phases.length > 0) {
        const phases = plan.phases.map(p => ({ ...p, plan_id: data.id }));
        const { error: phaseErr } = await supabase.from('warming_phases').insert(phases);
        if (phaseErr) throw phaseErr;
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['warming-plans'] });
      toast({ title: 'Plano criado com sucesso!' });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });
}

// ── Events ──
export function useNumberEvents(numberId: string | undefined) {
  return useQuery({
    queryKey: ['number-events', numberId],
    queryFn: async () => {
      if (!numberId) return [];
      const { data, error } = await supabase
        .from('number_events')
        .select('*')
        .eq('number_id', numberId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as DbNumberEvent[];
    },
    enabled: !!numberId,
  });
}

export function useCreateNumberEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: { number_id: string; event_type: string; severity?: string; title: string; details?: string }) => {
      const { error } = await supabase.from('number_events').insert(event);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['number-events', vars.number_id] });
    },
  });
}
