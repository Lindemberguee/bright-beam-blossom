import { useCallback, useMemo, useState, useRef, useEffect, DragEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  type Node, type Edge, type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Undo, Redo, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { flowNodeTypes, NodeActionsContext } from '@/components/flows/FlowNodeTypes';
import { FlowBlockPalette, blockTypes, blockCategories } from '@/components/flows/FlowBlockPalette';
import { FlowNodeConfigPanel } from '@/components/flows/FlowNodeConfigPanel';
import { useFlow, useFlowNodes, useFlowEdges, useSaveFlow } from '@/hooks/useFlows';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const defaultStartNodes: Node[] = [
  { id: 'start-1', type: 'start', position: { x: 300, y: 50 }, data: { label: 'Início', triggerType: 'message_received' } },
];

function QuickBlockPicker({ position, onSelect, onClose }: { position: { x: number; y: number }; onSelect: (type: string, label: string) => void; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = blockTypes.filter(b => b.label.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      className="fixed z-50 w-72 max-h-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in"
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2 border-b border-border/50">
        <input
          autoFocus
          placeholder="Buscar bloco..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-8 px-3 text-xs bg-muted/50 border border-border/50 rounded-lg outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
        />
      </div>
      <div className="overflow-auto max-h-64 p-1">
        {blockCategories.map(cat => {
          const blocks = filtered.filter(b => b.category === cat.id);
          if (!blocks.length) return null;
          return (
            <div key={cat.id}>
              <p className="px-2 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{cat.emoji} {cat.label}</p>
              {blocks.map(block => (
                <button
                  key={block.type}
                  onClick={() => { onSelect(block.type, block.label); onClose(); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <block.icon className={cn('h-4 w-4 shrink-0', block.color)} />
                  <div className="text-left min-w-0">
                    <span className="block font-medium truncate">{block.label}</span>
                    <span className="block text-[10px] text-muted-foreground/50 truncate">{block.description}</span>
                  </div>
                </button>
              ))}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nenhum bloco encontrado</p>}
      </div>
    </div>
  );
}

export default function FlowEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: flow, isLoading: flowLoading } = useFlow(id);
  const { data: dbNodes, isLoading: nodesLoading } = useFlowNodes(id);
  const { data: dbEdges, isLoading: edgesLoading } = useFlowEdges(id);
  const saveFlow = useSaveFlow();

  const isLoading = flowLoading || nodesLoading || edgesLoading;
  const isNew = !id;

  const [initialized, setInitialized] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultStartNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [quickPicker, setQuickPicker] = useState<{ x: number; y: number; flowPos: { x: number; y: number } } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChanges = useRef(false);
  const lastSavedRef = useRef<string>('');

  // Load from DB once
  if (!initialized && !isLoading && id) {
    if (dbNodes && dbNodes.length > 0) {
      setNodes(dbNodes);
    }
    if (dbEdges) {
      setEdges(dbEdges);
    }
    setInitialized(true);
  }
  if (!initialized && isNew) {
    setInitialized(true);
  }

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2, stroke: 'hsl(263, 70%, 58%)' } }, eds)),
    [setEdges]
  );

  const memoizedNodeTypes = useMemo(() => flowNodeTypes, []);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow-type');
    const label = event.dataTransfer.getData('application/reactflow-label');
    if (!type || !reactFlowInstance) return;

    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: label || type },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const handleNodeClick = useCallback((_: any, node: Node) => setSelectedNode(node), []);

  const handleNodeUpdate = useCallback((nodeId: string, data: Record<string, any>) => {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data } : n)));
    setSelectedNode((prev) => (prev?.id === nodeId ? { ...prev, data } : prev));
  }, [setNodes]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const handleNodeAddBelow = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setQuickPicker({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      flowPos: { x: position.x, y: position.y + 150 },
    });
  }, []);

  const handleNodeDuplicate = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const original = nds.find((n) => n.id === nodeId);
      if (!original) return nds;
      const newNode: Node = {
        ...original,
        id: `${original.type}-${Date.now()}`,
        position: { x: original.position.x + 30, y: original.position.y + 60 },
        data: { ...original.data as Record<string, any> },
        selected: false,
      };
      return nds.concat(newNode);
    });
  }, [setNodes]);

  const nodeActionsValue = useMemo(() => ({
    onAddBelow: handleNodeAddBelow,
    onDuplicate: handleNodeDuplicate,
    onDelete: handleNodeDelete,
  }), [handleNodeAddBelow, handleNodeDuplicate, handleNodeDelete]);

  const handleSave = useCallback(() => {
    if (!id) return;
    const snapshot = JSON.stringify({ nodes, edges });
    if (snapshot === lastSavedRef.current) return;
    saveFlow.mutate(
      { flowId: id, nodes, edges, name: flow?.name },
      {
        onSuccess: () => {
          lastSavedRef.current = snapshot;
          hasChanges.current = false;
        },
      }
    );
  }, [id, nodes, edges, flow, saveFlow]);

  // Silent auto-save with 1.5s debounce
  useEffect(() => {
    if (!initialized || !id) return;
    const snapshot = JSON.stringify({ nodes, edges });
    if (snapshot === lastSavedRef.current) return;
    hasChanges.current = true;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      handleSave();
    }, 1500);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [nodes, edges, initialized, id, handleSave]);

  // Ctrl+S shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  // Save on blur (tab switch)
  useEffect(() => {
    const handler = () => {
      if (hasChanges.current && id) handleSave();
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [handleSave, id]);

  const handlePaneDoubleClick = useCallback((event: React.MouseEvent) => {
    if (!reactFlowInstance) return;
    const flowPos = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    setQuickPicker({ x: event.clientX, y: event.clientY, flowPos });
  }, [reactFlowInstance]);

  const handleQuickBlockSelect = useCallback((type: string, label: string) => {
    if (!quickPicker) return;
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: quickPicker.flowPos,
      data: { label },
    };
    setNodes((nds) => nds.concat(newNode));
    setQuickPicker(null);
  }, [quickPicker, setNodes]);

  if (isLoading && id) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/flows">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => setShowPalette(!showPalette)}
            title={showPalette ? 'Esconder painel de blocos' : 'Mostrar painel de blocos'}
          >
            {showPalette ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
          <div>
            <h2 className="text-sm font-semibold text-foreground">{flow?.name || 'Novo Fluxo'}</h2>
            <p className="text-[10px] text-muted-foreground">
              {flow?.status === 'active' ? '🟢 Ativo' : flow?.status === 'paused' ? '⏸ Pausado' : '📝 Rascunho'}
              {' · '}{nodes.length} blocos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Redo className="h-4 w-4" /></Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="outline" size="sm" className="gap-2 h-8"><Play className="h-3.5 w-3.5" /> Testar</Button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {showPalette && <FlowBlockPalette onDragStart={() => {}} />}

        <div className="flex-1" ref={reactFlowWrapper}>
          <NodeActionsContext.Provider value={nodeActionsValue}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={handleNodeClick}
              onPaneClick={() => { setSelectedNode(null); setQuickPicker(null); }}
              onDoubleClick={handlePaneDoubleClick}
              nodeTypes={memoizedNodeTypes}
              fitView
              defaultEdgeOptions={{ style: { strokeWidth: 2, stroke: 'hsl(263, 70%, 58%)' } }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(225, 15%, 15%)" />
              <Controls className="!bg-card !border-border !rounded-lg !shadow-lg" />
              <MiniMap
                nodeStrokeColor="hsl(263, 70%, 58%)"
                nodeColor="hsl(225, 25%, 14%)"
                maskColor="hsla(225, 25%, 8%, 0.8)"
                className="!rounded-lg"
              />
            </ReactFlow>
          </NodeActionsContext.Provider>
        </div>

        {selectedNode && (
          <FlowNodeConfigPanel
            node={selectedNode}
            onUpdate={handleNodeUpdate}
            onClose={() => setSelectedNode(null)}
            onDelete={handleNodeDelete}
          />
        )}
      </div>

      {/* Quick Block Picker on double-click */}
      {quickPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setQuickPicker(null)} />
          <QuickBlockPicker
            position={{ x: quickPicker.x, y: quickPicker.y }}
            onSelect={handleQuickBlockSelect}
            onClose={() => setQuickPicker(null)}
          />
        </>
      )}
    </div>
  );
}
