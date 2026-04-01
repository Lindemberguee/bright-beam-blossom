import { useEffect } from 'react';
import { useBusinessHours } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export default function SettingsBusinessHours() {
  const { items, isLoading, create, update } = useBusinessHours();
  const qc = useQueryClient();

  // Seed default hours if empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      (async () => {
        const { data: profile } = await supabase.from('profiles').select('current_organization_id').single();
        if (!profile?.current_organization_id) return;
        const rows = Array.from({ length: 7 }, (_, i) => ({
          organization_id: profile.current_organization_id,
          day_of_week: i,
          start_time: '08:00',
          end_time: '18:00',
          is_active: i >= 1 && i <= 5,
        }));
        await (supabase.from as any)('business_hours').insert(rows);
        qc.invalidateQueries({ queryKey: ['business_hours'] });
      })();
    }
  }, [isLoading, items.length]);

  const sorted = [...items].sort((a, b) => a.day_of_week - b.day_of_week);

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Horários de Atendimento</h1>
          <p className="text-sm text-muted-foreground">Configure os horários de funcionamento por dia da semana</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((bh) => (
            <div key={bh.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-4">
              <Switch checked={bh.is_active} onCheckedChange={(v) => update.mutate({ id: bh.id, is_active: v } as any)} />
              <span className={`text-sm font-medium w-32 ${bh.is_active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {dayNames[bh.day_of_week]}
              </span>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={bh.start_time?.substring(0, 5) || '08:00'}
                  onChange={(e) => update.mutate({ id: bh.id, start_time: e.target.value } as any)}
                  className="w-28"
                  disabled={!bh.is_active}
                />
                <span className="text-muted-foreground text-sm">até</span>
                <Input
                  type="time"
                  value={bh.end_time?.substring(0, 5) || '18:00'}
                  onChange={(e) => update.mutate({ id: bh.id, end_time: e.target.value } as any)}
                  className="w-28"
                  disabled={!bh.is_active}
                />
              </div>
              {!bh.is_active && <span className="text-xs text-muted-foreground ml-auto">Fechado</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
