import { useState, useCallback } from 'react';
import {
  usePipelines, useCreatePipeline, usePipelineColumns, useCreateColumn,
  usePipelineCards, useCreateCard, useMoveCard, useDeleteCard,
} from '@/hooks/useKanban';
import { useAuth } from '@/contexts/AuthContext';
import { KanbanColumn } from '@/components/kanban/KanbanColumn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, BarChart3, DollarSign, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Kanban() {
  const { profile, loading: authLoading } = useAuth();
  const { data: pipelines = [], isLoading: loadingPipelines } = usePipelines();
  const createPipeline = useCreatePipeline();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [showNewPipeline, setShowNewPipeline] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Auto-select first pipeline
  const activePipelineId = selectedPipelineId ?? pipelines[0]?.id ?? null;

  const { data: columns = [] } = usePipelineColumns(activePipelineId);
  const { data: cards = [] } = usePipelineCards(activePipelineId);
  const createCard = useCreateCard();
  const moveCard = useMoveCard();
  const deleteCard = useDeleteCard();
  const createColumn = useCreateColumn();

  const getColumnCards = useCallback(
    (colId: string) => cards.filter(c => c.column_id === colId).sort((a, b) => a.position - b.position),
    [cards]
  );

  const getColumnTotalValue = useCallback(
    (colId: string) => cards.filter(c => c.column_id === colId).reduce((sum, c) => sum + Number(c.value ?? 0), 0),
    [cards]
  );

  const totalPipelineValue = cards.reduce((sum, c) => sum + Number(c.value ?? 0), 0);

  const handleCreatePipeline = () => {
    if (!newPipelineName.trim()) return;
    createPipeline.mutate({ name: newPipelineName.trim() }, {
      onSuccess: (data) => {
        setSelectedPipelineId(data.id);
        setNewPipelineName('');
        setShowNewPipeline(false);
      },
    });
  };

  const handleCreateCard = (columnId: string, title: string) => {
    const colCards = getColumnCards(columnId);
    createCard.mutate({ column_id: columnId, title, position: colCards.length });
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedCardId) return;
    const colCards = getColumnCards(columnId);
    moveCard.mutate({ id: draggedCardId, column_id: columnId, position: colCards.length });
    setDraggedCardId(null);
  };

  const handleAddColumn = () => {
    if (!activePipelineId) return;
    createColumn.mutate({
      pipeline_id: activePipelineId,
      title: 'Nova Etapa',
      position: columns.length,
    });
  };

  if (loadingPipelines) {
    return <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-muted-foreground">Carregando...</div>;
  }

  // No pipelines yet — prompt creation
  if (pipelines.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] animate-fade-in">
        <div className="text-center max-w-md space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Crie seu primeiro Pipeline</h2>
          <p className="text-sm text-muted-foreground">Organize suas oportunidades de venda em etapas visuais com nosso Kanban inteligente.</p>
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Ex: Vendas B2B"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePipeline()}
              className="max-w-xs"
            />
            <Button onClick={handleCreatePipeline} disabled={!newPipelineName.trim()}>
              <Plus className="h-4 w-4 mr-2" /> Criar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {pipelines.find(p => p.id === activePipelineId)?.name ?? 'Kanban'}
            </h1>
            <p className="text-sm text-muted-foreground">Gerencie oportunidades e pipeline de vendas</p>
          </div>
          {/* Metrics mini */}
          <div className="hidden md:flex items-center gap-4 ml-6 pl-6 border-l border-border/50">
            <div className="flex items-center gap-1.5 text-sm">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{cards.length} cards</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="font-semibold text-foreground">R$ {totalPipelineValue.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pipelines.length > 1 && (
            <select
              className="bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              value={activePipelineId ?? ''}
              onChange={(e) => setSelectedPipelineId(e.target.value)}
            >
              {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          <Dialog open={showNewPipeline} onOpenChange={setShowNewPipeline}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Pipeline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo Pipeline</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Nome do pipeline..."
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePipeline()}
                />
                <Button onClick={handleCreatePipeline} disabled={!newPipelineName.trim()} className="w-full">Criar Pipeline</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              cards={getColumnCards(col.id)}
              onCreateCard={handleCreateCard}
              onDeleteCard={(id) => deleteCard.mutate(id)}
              onDragStart={handleDragStart}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              totalValue={getColumnTotalValue(col.id)}
            />
          ))}

          {/* Add Column */}
          <button
            onClick={handleAddColumn}
            className="w-72 h-fit flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">Nova Coluna</span>
          </button>
        </div>
      </div>
    </div>
  );
}
