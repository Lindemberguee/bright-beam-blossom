import { useState } from 'react';
import { useTags, Tag } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const colorOptions = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#f59e0b', label: 'Âmbar' },
  { value: '#10b981', label: 'Verde' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#06b6d4', label: 'Ciano' },
];

const moduleOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'contacts', label: 'Contatos' },
  { value: 'conversations', label: 'Conversas' },
  { value: 'campaigns', label: 'Campanhas' },
];

export default function SettingsTags() {
  const { items: tags, isLoading, create, remove } = useTags();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [module, setModule] = useState('all');

  const handleCreate = () => {
    if (!name.trim()) return;
    create.mutate({ name: name.trim(), color, module } as any, { onSuccess: () => { setOpen(false); setName(''); } });
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Etiquetas</h1>
          <p className="text-sm text-muted-foreground">Organize conversas e contatos com tags coloridas</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nova Etiqueta</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
      ) : tags.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <TagIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">Nenhuma etiqueta criada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div key={tag.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tag.color }} />
                <span className="text-sm font-medium text-foreground">{tag.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{tag.module}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove.mutate(tag.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nova Etiqueta</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: VIP, Urgente..." />
            </div>
            <div>
              <Label>Cor</Label>
              <div className="flex gap-2 mt-1">
                {colorOptions.map((c) => (
                  <button key={c.value} onClick={() => setColor(c.value)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${color === c.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }} />
                ))}
              </div>
            </div>
            <div>
              <Label>Módulo</Label>
              <Select value={module} onValueChange={setModule}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{moduleOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || create.isPending}>{create.isPending ? 'Criando...' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
