import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DbContact {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  avatar_url: string | null;
  tags: string[];
  score: number;
  status: string;
  source: string;
  assigned_to: string | null;
  notes: string | null;
  custom_fields: Record<string, any>;
  last_interaction: string | null;
  created_at: string;
  updated_at: string;
}

export function useContacts(search?: string) {
  const { profile } = useAuth();
  const orgId = profile?.current_organization_id;

  return useQuery({
    queryKey: ['contacts', orgId, search],
    queryFn: async () => {
      if (!orgId) return [];
      let query = supabase
        .from('contacts')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as DbContact[];
    },
    enabled: !!orgId,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contact: { name: string; phone?: string; email?: string; company?: string; tags?: string[]; source?: string }) => {
      if (!profile?.current_organization_id) throw new Error('No organization');
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          ...contact,
          organization_id: profile.current_organization_id,
          tags: contact.tags ?? [],
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: 'Contato criado com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao criar contato', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<DbContact>) => {
      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: 'Contato atualizado!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar contato', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({ title: 'Contato removido!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao remover contato', description: error.message, variant: 'destructive' });
    },
  });
}
