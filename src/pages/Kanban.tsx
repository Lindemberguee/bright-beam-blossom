import { useState } from 'react';
import { mockPipelines } from '@/data/mockData';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, MoreHorizontal, GripVertical, Calendar, User, DollarSign, Tag } from 'lucide-react';

export default function Kanban() {
  const pipeline = mockPipelines[0];

  const priorityColors: Record<string, string> = {
    high: 'border-l-destructive',
    medium: 'border-l-warning',
    low: 'border-l-info',
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">{pipeline.name}</h1>
          <p className="text-sm text-muted-foreground">Gerencie oportunidades e pipeline de vendas</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground">
            <option>Vendas B2B</option>
            <option>Suporte</option>
          </select>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Novo Card</Button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {pipeline.columns.map((col) => (
            <div key={col.id} className="w-72 flex flex-col bg-muted/30 rounded-xl border border-border/30">
              {/* Column Header */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                  <span className="text-sm font-semibold text-foreground">{col.title}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{col.cards.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><Plus className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-auto px-2 pb-2 space-y-2">
                {col.cards.map((card) => (
                  <div
                    key={card.id}
                    className={cn(
                      "glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all duration-200 border-l-2",
                      priorityColors[card.priority]
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground leading-tight">{card.title}</h4>
                      <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{card.contactName}</span>
                      </div>
                      {card.value && (
                        <div className="flex items-center gap-1.5 text-xs text-success">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-medium">R$ {card.value.toLocaleString('pt-BR')}</span>
                        </div>
                      )}
                      {card.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{card.dueDate}</span>
                        </div>
                      )}
                    </div>
                    {card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{tag}</span>
                        ))}
                      </div>
                    )}
                    {card.assignedTo && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">
                          {card.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {col.cards.length === 0 && (
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
          ))}

          {/* Add Column */}
          <button className="w-72 h-fit flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Nova Coluna</span>
          </button>
        </div>
      </div>
    </div>
  );
}
