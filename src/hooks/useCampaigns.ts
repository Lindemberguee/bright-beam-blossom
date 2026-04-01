import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DbCampaign {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: string;
  type: string;
  message_template: string | null;
  message_variables: any[];
  media_url: string | null;
  media_type: string | null;
  target_count: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  response_count: number;
  failed_count: number;
  filters: Record<string, any>;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbContactList {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  filters: Record<string, any>;
  is_dynamic: boolean;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

export function useCampaigns() {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;

  return useQuery({
    queryKey: ['campaigns', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as DbCampaign[];
    },
    enabled: !!orgId,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as DbCampaign;
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (campaign: {
      name: string;
      description?: string;
      type?: string;
      message_template?: string;
      filters?: Record<string, any>;
      scheduled_at?: string;
    }) => {
      if (!profile?.current_organization_id) throw new Error('No organization');
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          ...campaign,
          organization_id: profile.current_organization_id,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'Campanha criada com sucesso!' });
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao criar campanha', description: e.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<DbCampaign>) => {
      const { data, error } = await supabase
        .from('campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      qc.invalidateQueries({ queryKey: ['campaign'] });
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao atualizar campanha', description: e.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      toast({ title: 'Campanha removida!' });
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao remover', description: e.message, variant: 'destructive' });
    },
  });
}

export function useContactLists() {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;

  return useQuery({
    queryKey: ['contact-lists', orgId],
    queryFn: async () => {
      if (!orgId) return [];
      const { data, error } = await supabase
        .from('contact_lists')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as DbContactList[];
    },
    enabled: !!orgId,
  });
}

export function useCreateContactList() {
  const qc = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (list: { name: string; description?: string; filters?: Record<string, any>; is_dynamic?: boolean }) => {
      if (!profile?.current_organization_id) throw new Error('No organization');
      const { data, error } = await supabase
        .from('contact_lists')
        .insert({
          ...list,
          organization_id: profile.current_organization_id,
          filters: list.filters ?? {},
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contact-lists'] });
      toast({ title: 'Lista criada com sucesso!' });
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao criar lista', description: e.message, variant: 'destructive' });
    },
  });
}

export function useCampaignContacts(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaign-contacts', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from('campaign_contacts')
        .select('*, contacts(name, phone, email, tags, status)')
        .eq('campaign_id', campaignId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!campaignId,
  });
}

export function useAddContactsToCampaign() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, contactIds }: { campaignId: string; contactIds: string[] }) => {
      const rows = contactIds.map(cid => ({ campaign_id: campaignId, contact_id: cid }));
      const { error } = await supabase.from('campaign_contacts').upsert(rows, { onConflict: 'campaign_id,contact_id' });
      if (error) throw error;
      // Update target count
      await supabase
        .from('campaigns')
        .update({ target_count: contactIds.length, updated_at: new Date().toISOString() })
        .eq('id', campaignId);
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['campaign-contacts', vars.campaignId] });
      qc.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
