import { DbPipelineColumn, DbPipelineCard } from '@/hooks/useKanban';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Props {
  column: DbPipelineColumn;
  cards: DbPipelineCard[];
  onCreateCard: (columnId: string, title: string) => void;
  onDeleteCard: (id: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  totalValue: number;
}

export function KanbanColumn({ column, cards, onCreateCard, onDeleteCard, onDragStart, onDragOver, onDrop, totalValue }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onCreateCard(column.id, newTitle.trim());
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div
      className={cn(
        "w-72 flex flex-col bg-muted/30 rounded-xl border border-border/30 transition-all duration-200",
        isDragOver && "border-primary/50 bg-primary/5"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); onDragOver(e); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { setIsDragOver(false); onDrop(e, column.id); }}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: column.color ?? '#6366f1' }} />
          <span className="text-sm font-semibold text-foreground">{column.title}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{cards.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setIsAdding(true)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Total value */}
      {totalValue > 0 && (
        <div className="px-3 pb-2">
          <span className="text-xs font-medium text-emerald-500">
            R$ {totalValue.toLocaleString('pt-BR')}
          </span>
        </div>
      )}

      {/* Cards */}
      <div className="flex-1 overflow-auto px-2 pb-2 space-y-2">
        {/* Quick add */}
        {isAdding && (
          <div className="glass-card rounded-lg p-2 space-y-2">
            <Input
              autoFocus
              placeholder="Título do card..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setIsAdding(false); }}
              className="h-8 text-sm"
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-7 text-xs" onClick={handleAdd}>Criar</Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsAdding(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} onDragStart={onDragStart} />
        ))}

        {cards.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-2">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Nenhum card aqui</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">Arraste ou crie um novo</p>
          </div>
        )}
      </div>
    </div>
  );
}
