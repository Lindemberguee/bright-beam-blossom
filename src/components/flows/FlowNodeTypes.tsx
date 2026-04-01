import { Handle, Position } from '@xyflow/react';
import {
  MessageSquare, HelpCircle, GitBranch, Timer, Webhook, Tag,
  Brain, XCircle, Zap, User, Send, ListChecks, Image, FileText,
  MapPin, Phone, Globe, ShieldCheck, Repeat, Clock,
} from 'lucide-react';

function NodeShell({ children, className = '', targetHandleColor = '!bg-primary', sourceHandleColor = '!bg-primary', hasTarget = true, hasSource = true, sourceHandles }: {
  children: React.ReactNode;
  className?: string;
  targetHandleColor?: string;
  sourceHandleColor?: string;
  hasTarget?: boolean;
  hasSource?: boolean;
  sourceHandles?: { id: string; position: string; color: string }[];
}) {
  return (
    <div className={`rounded-xl px-4 py-3 min-w-[200px] shadow-lg ${className}`}>
      {hasTarget && <Handle type="target" position={Position.Top} className={`${targetHandleColor} !w-3 !h-3 !border-2 !border-background`} />}
      {children}
      {sourceHandles ? sourceHandles.map(h => (
        <Handle key={h.id} type="source" position={Position.Bottom} id={h.id} style={{ left: h.position }} className={`${h.color} !w-3 !h-3 !border-2 !border-background`} />
      )) : hasSource && <Handle type="source" position={Position.Bottom} className={`${sourceHandleColor} !w-3 !h-3 !border-2 !border-background`} />}
    </div>
  );
}

function NodeHeader({ icon: Icon, label, iconBg, iconColor }: { icon: any; label: string; iconBg: string; iconColor: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className={`h-7 w-7 rounded-lg ${iconBg} flex items-center justify-center`}>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </div>
  );
}

export function StartNode({ data }: any) {
  return (
    <NodeShell className="bg-success/20 border-2 border-success" hasTarget={false} sourceHandleColor="!bg-success">
      <div className="flex items-center gap-2 justify-center">
        <Zap className="h-4 w-4 text-success" />
        <span className="text-sm font-semibold text-success">{data.label}</span>
      </div>
      {data.triggerType && <p className="text-[10px] text-success/70 text-center mt-1">{data.triggerType}</p>}
    </NodeShell>
  );
}

export function MessageNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border">
      <NodeHeader icon={MessageSquare} label={data.label} iconBg="bg-primary/20" iconColor="text-primary" />
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{data.content || 'Configurar mensagem...'}</p>
      {data.mediaType && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
          {data.mediaType === 'image' && <Image className="h-3 w-3" />}
          {data.mediaType === 'document' && <FileText className="h-3 w-3" />}
          <span>{data.mediaType}</span>
        </div>
      )}
    </NodeShell>
  );
}

export function QuestionNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-info/30" targetHandleColor="!bg-info" sourceHandleColor="!bg-info">
      <NodeHeader icon={HelpCircle} label={data.label} iconBg="bg-info/20" iconColor="text-info" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Configurar pergunta...'}</p>
      {data.options && (
        <div className="mt-2 space-y-1">
          {(data.options as string[]).slice(0, 3).map((opt: string, i: number) => (
            <div key={i} className="text-[10px] bg-info/5 border border-info/10 rounded px-2 py-0.5 text-info">
              {opt}
            </div>
          ))}
        </div>
      )}
    </NodeShell>
  );
}

export function MenuNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-primary/30" sourceHandleColor="!bg-primary">
      <NodeHeader icon={ListChecks} label={data.label} iconBg="bg-primary/20" iconColor="text-primary" />
      <p className="text-[11px] text-muted-foreground mb-2">{data.content || 'Menu interativo...'}</p>
      {data.buttons && (
        <div className="space-y-1">
          {(data.buttons as string[]).slice(0, 4).map((btn: string, i: number) => (
            <div key={i} className="text-[10px] bg-primary/5 border border-primary/10 rounded-md px-2 py-1 text-primary text-center font-medium">
              {btn}
            </div>
          ))}
        </div>
      )}
    </NodeShell>
  );
}

export function ConditionNode({ data }: any) {
  return (
    <NodeShell
      className="bg-card border border-warning/30"
      targetHandleColor="!bg-warning"
      hasSource={false}
      sourceHandles={[
        { id: 'yes', position: '30%', color: '!bg-success' },
        { id: 'no', position: '70%', color: '!bg-destructive' },
      ]}
    >
      <NodeHeader icon={GitBranch} label={data.label} iconBg="bg-warning/20" iconColor="text-warning" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Configurar condição...'}</p>
      <div className="flex justify-between mt-2 text-[9px] font-medium">
        <span className="text-success">✓ Sim</span>
        <span className="text-destructive">✗ Não</span>
      </div>
    </NodeShell>
  );
}

export function DelayNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border" targetHandleColor="!bg-muted-foreground" sourceHandleColor="!bg-muted-foreground">
      <NodeHeader icon={Timer} label={data.label} iconBg="bg-muted" iconColor="text-muted-foreground" />
      {data.duration && <p className="text-[11px] text-muted-foreground">{data.duration}</p>}
    </NodeShell>
  );
}

export function ScheduleNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border" targetHandleColor="!bg-accent-foreground" sourceHandleColor="!bg-accent-foreground">
      <NodeHeader icon={Clock} label={data.label} iconBg="bg-accent" iconColor="text-accent-foreground" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Agendar horário...'}</p>
    </NodeShell>
  );
}

export function WebhookNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border">
      <NodeHeader icon={Webhook} label={data.label} iconBg="bg-primary/10" iconColor="text-primary" />
      {data.url && <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">{data.url}</p>}
      {data.method && <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">{data.method}</span>}
    </NodeShell>
  );
}

export function ActionNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border">
      <NodeHeader icon={Tag} label={data.label} iconBg="bg-primary/10" iconColor="text-primary" />
      {data.actionType && <p className="text-[10px] text-muted-foreground">{data.actionType}</p>}
    </NodeShell>
  );
}

export function TransferNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-success/30" targetHandleColor="!bg-success" sourceHandleColor="!bg-success">
      <NodeHeader icon={User} label={data.label} iconBg="bg-success/10" iconColor="text-success" />
      <p className="text-[11px] text-muted-foreground">{data.department || data.agent || 'Selecionar destino...'}</p>
    </NodeShell>
  );
}

export function AINode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-primary/40 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.15)]">
      <NodeHeader icon={Brain} label={data.label} iconBg="bg-primary/20" iconColor="text-primary" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Resposta com IA...'}</p>
      {data.model && <span className="text-[9px] font-mono bg-primary/5 text-primary px-1.5 py-0.5 rounded mt-1 inline-block">{data.model}</span>}
    </NodeShell>
  );
}

export function SendNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-info/30" targetHandleColor="!bg-info" sourceHandleColor="!bg-info">
      <NodeHeader icon={Send} label={data.label} iconBg="bg-info/10" iconColor="text-info" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Disparar mensagem...'}</p>
    </NodeShell>
  );
}

export function HttpNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border">
      <NodeHeader icon={Globe} label={data.label} iconBg="bg-accent" iconColor="text-accent-foreground" />
      <p className="text-[10px] text-muted-foreground truncate">{data.url || 'Configurar requisição...'}</p>
      {data.method && <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded mt-1 inline-block">{data.method}</span>}
    </NodeShell>
  );
}

export function LoopNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-warning/30" targetHandleColor="!bg-warning" sourceHandleColor="!bg-warning">
      <NodeHeader icon={Repeat} label={data.label} iconBg="bg-warning/10" iconColor="text-warning" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Configurar loop...'}</p>
    </NodeShell>
  );
}

export function ValidationNode({ data }: any) {
  return (
    <NodeShell
      className="bg-card border border-info/30"
      targetHandleColor="!bg-info"
      hasSource={false}
      sourceHandles={[
        { id: 'valid', position: '30%', color: '!bg-success' },
        { id: 'invalid', position: '70%', color: '!bg-destructive' },
      ]}
    >
      <NodeHeader icon={ShieldCheck} label={data.label} iconBg="bg-info/10" iconColor="text-info" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Validar dado...'}</p>
      <div className="flex justify-between mt-2 text-[9px] font-medium">
        <span className="text-success">Válido</span>
        <span className="text-destructive">Inválido</span>
      </div>
    </NodeShell>
  );
}

export function LocationNode({ data }: any) {
  return (
    <NodeShell className="bg-card border border-border">
      <NodeHeader icon={MapPin} label={data.label} iconBg="bg-destructive/10" iconColor="text-destructive" />
      <p className="text-[11px] text-muted-foreground">{data.content || 'Solicitar localização...'}</p>
    </NodeShell>
  );
}

export function EndNode({ data }: any) {
  return (
    <NodeShell className="bg-destructive/20 border-2 border-destructive" hasSource={false} targetHandleColor="!bg-destructive">
      <div className="flex items-center gap-2 justify-center">
        <XCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm font-semibold text-destructive">{data.label}</span>
      </div>
    </NodeShell>
  );
}

export const flowNodeTypes = {
  start: StartNode,
  message: MessageNode,
  question: QuestionNode,
  menu: MenuNode,
  condition: ConditionNode,
  delay: DelayNode,
  schedule: ScheduleNode,
  webhook: WebhookNode,
  action: ActionNode,
  transfer: TransferNode,
  ai: AINode,
  send: SendNode,
  http: HttpNode,
  loop: LoopNode,
  validation: ValidationNode,
  location: LocationNode,
  end: EndNode,
};
