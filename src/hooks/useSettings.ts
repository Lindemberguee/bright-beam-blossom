import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ---- Generic helper ----
function useSettingsCrud<T extends { id: string }>(table: string, queryKey: string) {
  const qc = useQueryClient();

  const getOrgId = async () => {
    const { data } = await supabase.from('profiles').select('current_organization_id').single();
    if (!data?.current_organization_id) throw new Error('Organização não encontrada');
    return data.current_organization_id;
  };

  const list = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await (supabase.from as any)(table).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as T[];
    },
  });

  const create = useMutation({
    mutationFn: async (input: Partial<T>) => {
      const orgId = await getOrgId();
      const { data, error } = await (supabase.from as any)(table).insert({ ...input, organization_id: orgId }).select().single();
      if (error) throw error;
      return data as T;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success('Criado com sucesso'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<T>) => {
      const { error } = await (supabase.from as any)(table).update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success('Atualizado'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success('Removido'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return { items: list.data ?? [], isLoading: list.isLoading, create, update, remove };
}

// ---- Typed hooks ----
export interface Tag { id: string; organization_id: string; name: string; color: string; module: string; created_at: string; }
export const useTags = () => useSettingsCrud<Tag>('tags', 'tags');

export interface QuickReply { id: string; organization_id: string; title: string; content: string; category: string; shortcut: string | null; is_active: boolean; created_at: string; }
export const useQuickReplies = () => useSettingsCrud<QuickReply>('quick_replies', 'quick_replies');

export interface Department { id: string; organization_id: string; name: string; description: string | null; color: string; is_active: boolean; created_at: string; }
export const useDepartments = () => useSettingsCrud<Department>('departments', 'departments');

export interface BusinessHour { id: string; organization_id: string; day_of_week: number; start_time: string; end_time: string; is_active: boolean; created_at: string; }
export const useBusinessHours = () => useSettingsCrud<BusinessHour>('business_hours', 'business_hours');

export interface Queue { id: string; organization_id: string; name: string; description: string | null; department_id: string | null; distribution_strategy: string; priority: number; max_concurrent: number; auto_assign: boolean; is_active: boolean; created_at: string; }
export const useQueues = () => useSettingsCrud<Queue>('queues', 'queues');

export interface GlobalVariable { id: string; organization_id: string; key: string; value: string; description: string | null; is_secret: boolean; created_at: string; }
export const useGlobalVariables = () => useSettingsCrud<GlobalVariable>('global_variables', 'global_variables');
