import { useCallback, useMemo, useState, useRef, DragEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  type Node, type Edge, type Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Play, Undo, Redo } from 'lucide-react';
import { flowNodeTypes } from '@/components/flows/FlowNodeTypes';
import { FlowBlockPalette } from '@/components/flows/FlowBlockPalette';
import { FlowNodeConfigPanel } from '@/components/flows/FlowNodeConfigPanel';
import { useFlow, useFlowNodes, useFlowEdges, useSaveFlow } from '@/hooks/useFlows';
import { Skeleton } from '@/components/ui/skeleton';

const defaultStartNodes: Node[] = [
  { id: 'start-1', type: 'start', position: { x: 300, y: 50 }, data: { label: 'Início', triggerType: 'message_received' } },
];

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
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

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

  const handleSave = useCallback(() => {
    if (!id) return;
    saveFlow.mutate({ flowId: id, nodes, edges, name: flow?.name });
  }, [id, nodes, edges, flow, saveFlow]);

  if (isLoading && id) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/flows">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
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
          <Button size="sm" className="gap-2 h-8" onClick={handleSave} disabled={saveFlow.isPending || !id}>
            <Save className="h-3.5 w-3.5" /> {saveFlow.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <FlowBlockPalette onDragStart={() => {}} />

        <div className="flex-1" ref={reactFlowWrapper}>
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
            onPaneClick={() => setSelectedNode(null)}
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
    </div>
  );
}
