import { useState } from 'react';
import { useContactLists, useCreateContactList } from '@/hooks/useCampaigns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, List, Users, Zap, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ContactListsTab() {
  const { data: lists = [], isLoading } = useContactLists();
  const createList = useCreateContactList();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDynamic, setIsDynamic] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [filterTag, setFilterTag] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const filters: Record<string, any> = {};
    if (filterStatus !== 'all') filters.status = filterStatus;
    if (filterSource !== 'all') filters.source = filterSource;
    if (filterTag.trim()) filters.tags = filterTag.split(',').map(t => t.trim());
    createList.mutate(
      { name, description, is_dynamic: isDynamic, filters },
      { onSuccess: () => { setOpen(false); setName(''); setDescription(''); } }
    );
  };

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Listas de Contatos</h2>
          <p className="text-xs text-muted-foreground">Crie listas estáticas ou dinâmicas para segmentar suas campanhas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Nova Lista</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><List className="h-5 w-5 text-primary" /> Nova Lista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input placeholder="Ex: Clientes VIP" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Descrição</Label>
                <Input placeholder="Descrição opcional..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Lista Dinâmica</Label>
                  <p className="text-xs text-muted-foreground">Atualiza automaticamente com base nos filtros</p>
                </div>
                <Switch checked={isDynamic} onCheckedChange={setIsDynamic} />
              </div>
              {isDynamic && (
                <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-xs font-medium text-foreground flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Filtros Dinâmicos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
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
                    <div className="space-y-1">
                      <Label className="text-xs">Origem</Label>
                      <Select value={filterSource} onValueChange={setFilterSource}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tags (separar por vírgula)</Label>
                    <Input placeholder="VIP, Enterprise, Lead Quente" className="h-8" value={filterTag} onChange={e => setFilterTag(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={!name.trim() || createList.isPending}>
                  {createList.isPending ? 'Criando...' : 'Criar Lista'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <List className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nenhuma lista criada ainda</p>
          <p className="text-xs">Crie listas para segmentar suas campanhas</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {lists.map(list => (
            <div key={list.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  {list.is_dynamic ? <Zap className="h-4 w-4 text-primary" /> : <Users className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{list.name}</p>
                  <p className="text-xs text-muted-foreground">{list.description || 'Sem descrição'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" /> {list.contact_count}
                </Badge>
                <Badge variant={list.is_dynamic ? 'default' : 'secondary'} className="text-[10px]">
                  {list.is_dynamic ? 'Dinâmica' : 'Estática'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
