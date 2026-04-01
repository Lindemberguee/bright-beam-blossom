import { useState } from 'react';
import { useGlobalVariables } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowLeft, Variable, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsVariables() {
  const { items, isLoading, create, remove } = useGlobalVariables();
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const handleCreate = () => {
    if (!key.trim() || !value.trim()) return;
    create.mutate({ key: key.trim(), value: value.trim(), description: desc.trim() || null, is_secret: isSecret } as any, {
      onSuccess: () => { setOpen(false); setKey(''); setValue(''); setDesc(''); setIsSecret(false); },
    });
  };

  const toggleSecret = (id: string) => setShowSecrets((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Variáveis Globais</h1>
          <p className="text-sm text-muted-foreground">Variáveis reutilizáveis em fluxos e templates</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nova Variável</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <Variable className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">Nenhuma variável criada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((v) => (
            <div key={v.id} className="glass-card rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">{`{{${v.key}}}`}</code>
                <span className="text-sm text-muted-foreground">=</span>
                {v.is_secret ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-foreground font-mono">{showSecrets[v.id] ? v.value : '••••••••'}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleSecret(v.id)}>
                      {showSecrets[v.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                ) : (
                  <span className="text-sm text-foreground font-mono truncate">{v.value}</span>
                )}
                {v.description && <span className="text-xs text-muted-foreground truncate hidden md:inline">— {v.description}</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => remove.mutate(v.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nova Variável</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Chave</Label><Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="nome_empresa" className="font-mono" /></div>
            <div><Label>Valor</Label><Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Minha Empresa Ltda" /></div>
            <div><Label>Descrição</Label><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Opcional" /></div>
            <div className="flex items-center gap-2">
              <Switch checked={isSecret} onCheckedChange={setIsSecret} />
              <Label>Valor secreto (ocultar na interface)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!key.trim() || !value.trim() || create.isPending}>{create.isPending ? 'Criando...' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
