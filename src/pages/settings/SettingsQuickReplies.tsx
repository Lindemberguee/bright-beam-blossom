import { useState } from 'react';
import { useQuickReplies } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, ArrowLeft, MessageSquare, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsQuickReplies() {
  const { items, isLoading, create, remove } = useQuickReplies();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [category, setCategory] = useState('geral');

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    create.mutate({ title: title.trim(), content: content.trim(), shortcut: shortcut.trim() || null, category } as any, {
      onSuccess: () => { setOpen(false); setTitle(''); setContent(''); setShortcut(''); },
    });
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Respostas Rápidas</h1>
          <p className="text-sm text-muted-foreground">Templates de mensagens para agilizar o atendimento</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Nova Resposta</Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm text-muted-foreground">Nenhuma resposta rápida criada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((qr) => (
            <div key={qr.id} className="glass-card rounded-xl px-4 py-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">{qr.title}</span>
                    {qr.shortcut && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                        <Zap className="h-3 w-3" />/{qr.shortcut}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">{qr.category}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{qr.content}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => remove.mutate(qr.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Nova Resposta Rápida</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Saudação inicial" /></div>
            <div><Label>Conteúdo</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Olá! Como posso ajudar?" rows={3} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Atalho</Label><Input value={shortcut} onChange={(e) => setShortcut(e.target.value)} placeholder="saudacao" /></div>
              <div><Label>Categoria</Label><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="geral" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!title.trim() || !content.trim() || create.isPending}>{create.isPending ? 'Criando...' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
