import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ReactFlow, Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  type Node, type Edge, type Connection, Handle, Position,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Save, Play, Undo, Redo, ZoomIn, ZoomOut,
  MessageSquare, HelpCircle, GitBranch, Timer, Webhook, Tag,
  User, Brain, Send, XCircle, Zap, Plus, Settings,
} from 'lucide-react';

const nodeTypes = {
  start: StartNode,
  message: MessageNode,
  question: QuestionNode,
  condition: ConditionNode,
  delay: DelayNode,
  webhook: WebhookNode,
  action: ActionNode,
  ai: AINode,
  end: EndNode,
};

function StartNode({ data }: any) {
  return (
    <div className="bg-success/20 border-2 border-success rounded-xl px-5 py-3 text-center min-w-[140px]">
      <div className="flex items-center gap-2 justify-center">
        <Zap className="h-4 w-4 text-success" />
        <span className="text-sm font-semibold text-success">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-success !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function MessageNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[200px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center"><MessageSquare className="h-3.5 w-3.5 text-primary" /></div>
        <span className="text-xs font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{data.content || 'Configurar mensagem...'}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function QuestionNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[200px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-info !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-6 w-6 rounded bg-info/20 flex items-center justify-center"><HelpCircle className="h-3.5 w-3.5 text-info" /></div>
        <span className="text-xs font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">{data.content || 'Configurar pergunta...'}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-info !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function ConditionNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[180px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-warning !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2 mb-1.5">
        <div className="h-6 w-6 rounded bg-warning/20 flex items-center justify-center"><GitBranch className="h-3.5 w-3.5 text-warning" /></div>
        <span className="text-xs font-semibold text-foreground">{data.label}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">{data.content || 'Configurar condição...'}</p>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: '30%' }} className="!bg-success !w-3 !h-3 !border-2 !border-background" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: '70%' }} className="!bg-destructive !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function DelayNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[160px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-muted flex items-center justify-center"><Timer className="h-3.5 w-3.5 text-muted-foreground" /></div>
        <span className="text-xs font-semibold text-foreground">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function WebhookNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[180px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-accent-foreground !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center"><Webhook className="h-3.5 w-3.5 text-primary" /></div>
        <span className="text-xs font-semibold text-foreground">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent-foreground !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function ActionNode({ data }: any) {
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 min-w-[180px] shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center"><Tag className="h-3.5 w-3.5 text-primary" /></div>
        <span className="text-xs font-semibold text-foreground">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function AINode({ data }: any) {
  return (
    <div className="bg-card border border-primary/30 rounded-xl px-4 py-3 min-w-[200px] shadow-lg glow-primary">
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2 mb-1">
        <div className="h-6 w-6 rounded bg-primary/20 flex items-center justify-center"><Brain className="h-3.5 w-3.5 text-primary" /></div>
        <span className="text-xs font-semibold text-primary">{data.label}</span>
      </div>
      <p className="text-[11px] text-muted-foreground">{data.content || 'Resposta com IA...'}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
}

function EndNode({ data }: any) {
  return (
    <div className="bg-destructive/20 border-2 border-destructive rounded-xl px-5 py-3 text-center min-w-[140px]">
      <Handle type="target" position={Position.Top} className="!bg-destructive !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-2 justify-center">
        <XCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm font-semibold text-destructive">{data.label}</span>
      </div>
    </div>
  );
}

const initialNodes: Node[] = [
  { id: '1', type: 'start', position: { x: 300, y: 50 }, data: { label: 'Início' } },
  { id: '2', type: 'message', position: { x: 260, y: 170 }, data: { label: 'Boas-vindas', content: 'Olá! 👋 Seja bem-vindo(a)! Como posso ajudar?' } },
  { id: '3', type: 'question', position: { x: 240, y: 320 }, data: { label: 'Menu Principal', content: '1️⃣ Vendas\n2️⃣ Suporte\n3️⃣ Financeiro' } },
  { id: '4', type: 'condition', position: { x: 240, y: 480 }, data: { label: 'Verificar Opção', content: 'Opção = Vendas?' } },
  { id: '5', type: 'ai', position: { x: 60, y: 640 }, data: { label: 'IA - Vendas', content: 'Assistente de vendas com IA' } },
  { id: '6', type: 'action', position: { x: 420, y: 640 }, data: { label: 'Transferir Suporte' } },
  { id: '7', type: 'delay', position: { x: 60, y: 800 }, data: { label: 'Aguardar 5 min' } },
  { id: '8', type: 'webhook', position: { x: 60, y: 940 }, data: { label: 'Notificar CRM' } },
  { id: '9', type: 'end', position: { x: 300, y: 1060 }, data: { label: 'Encerrar' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5', sourceHandle: 'yes', label: 'Sim' },
  { id: 'e4-6', source: '4', target: '6', sourceHandle: 'no', label: 'Não' },
  { id: 'e5-7', source: '5', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e6-9', source: '6', target: '9' },
];

const blockTypes = [
  { icon: MessageSquare, label: 'Mensagem', color: 'text-primary' },
  { icon: HelpCircle, label: 'Pergunta', color: 'text-info' },
  { icon: GitBranch, label: 'Condição', color: 'text-warning' },
  { icon: Timer, label: 'Delay', color: 'text-muted-foreground' },
  { icon: Brain, label: 'IA', color: 'text-primary' },
  { icon: Webhook, label: 'Webhook', color: 'text-primary' },
  { icon: Tag, label: 'Ação', color: 'text-primary' },
  { icon: User, label: 'Transferir', color: 'text-success' },
  { icon: Send, label: 'Disparar', color: 'text-info' },
  { icon: XCircle, label: 'Encerrar', color: 'text-destructive' },
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col animate-fade-in">
      {/* Editor Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link to="/flows">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Boas-vindas WhatsApp</h2>
            <p className="text-[10px] text-muted-foreground">Editando · Última alteração há 2 min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Redo className="h-4 w-4" /></Button>
          <div className="h-6 w-px bg-border mx-1" />
          <Button variant="outline" size="sm" className="gap-2 h-8"><Play className="h-3.5 w-3.5" /> Testar</Button>
          <Button size="sm" className="gap-2 h-8"><Save className="h-3.5 w-3.5" /> Salvar</Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Block Palette */}
        <div className="w-56 border-r border-border/50 bg-card/30 p-3 overflow-auto">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Blocos</p>
          <div className="space-y-1.5">
            {blockTypes.map((block) => (
              <button
                key={block.label}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <block.icon className={cn("h-4 w-4", block.color)} />
                <span>{block.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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
      </div>
    </div>
  );
}
