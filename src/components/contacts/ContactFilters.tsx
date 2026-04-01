import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, X } from 'lucide-react';

interface Filters {
  status: string;
  source: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

export function ContactFilters({ filters, onChange }: Props) {
  const hasFilters = filters.status !== 'all' || filters.source !== 'all';

  const clear = () => onChange({ status: 'all', source: 'all' });

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 relative">
            <Filter className="h-4 w-4" />
            Filtros
            {hasFilters && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">!</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 space-y-3" align="start">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filtros</span>
            {hasFilters && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={clear}>
                <X className="h-3 w-3" /> Limpar
              </Button>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select value={filters.status} onValueChange={v => onChange({ ...filters, status: v })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="customer">Cliente</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Origem</label>
            <Select value={filters.source} onValueChange={v => onChange({ ...filters, source: v })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="import">Importação</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
