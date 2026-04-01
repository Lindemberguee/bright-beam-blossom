import { DbPipelineCard } from '@/hooks/useKanban';
import { cn } from '@/lib/utils';
import { GripVertical, User, DollarSign, Calendar, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  card: DbPipelineCard;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
}

const priorityConfig: Record<string, { border: string; badge: string; label: string }> = {
  high: { border: 'border-l-destructive', badge: 'bg-destructive/10 text-destructive', label: 'Alta' },
  medium: { border: 'border-l-warning', badge: 'bg-warning/10 text-warning', label: 'Média' },
  low: { border: 'border-l-info', badge: 'bg-info/10 text-info', label: 'Baixa' },
};

export function KanbanCard({ card, onDelete, onDragStart }: Props) {
  const priority = priorityConfig[card.priority] ?? priorityConfig.medium;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, card.id)}
      className={cn(
        "group glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all duration-200 border-l-2 active:scale-[0.98] active:shadow-lg",
        priority.border
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground leading-tight flex-1">{card.title}</h4>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete(card.id)} className="text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
        </div>
      </div>

      {card.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{card.description}</p>
      )}

      <div className="space-y-1.5">
        {card.contact_name && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{card.contact_name}</span>
          </div>
        )}
        {(card.value ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <DollarSign className="h-3 w-3" />
            <span className="font-semibold">R$ {Number(card.value).toLocaleString('pt-BR')}</span>
          </div>
        )}
        {card.due_date && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(card.due_date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      {(card.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.tags!.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", priority.badge)}>
          {priority.label}
        </span>
      </div>
    </div>
  );
}
