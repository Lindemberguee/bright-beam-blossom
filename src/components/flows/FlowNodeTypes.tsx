import { Handle, Position } from '@xyflow/react';
import {
  MessageSquare, HelpCircle, GitBranch, Timer, Webhook, Tag,
  Brain, XCircle, Zap, User, Send, ListChecks, Image, FileText,
  MapPin, Globe, ShieldCheck, Repeat, Clock, Music, Video,
  Variable, Sparkles,
} from 'lucide-react';

/* ── Shared Shell ────────────────────────────────────────────── */

function NodeShell({
  children,
  className = '',
  targetHandleColor = '!bg-primary',
  sourceHandleColor = '!bg-primary',
  hasTarget = true,
  hasSource = true,
  sourceHandles,
  selected,
}: {
  children: React.ReactNode;
  className?: string;
  targetHandleColor?: string;
  sourceHandleColor?: string;
  hasTarget?: boolean;
  hasSource?: boolean;
  sourceHandles?: { id: string; position: string; color: string }[];
  selected?: boolean;
}) {
  return (
    <div
      className={`
        rounded-xl px-4 py-3 min-w-[210px] max-w-[260px] shadow-lg
        transition-all duration-200 hover:shadow-xl
        ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        ${className}
      `}
    >
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className={`${targetHandleColor} !w-3 !h-3 !border-2 !border-background !-top-1.5 transition-transform hover:!scale-125`}
        />
      )}
      {children}
      {sourceHandles
        ? sourceHandles.map((h) => (
            <Handle
              key={h.id}
              type="source"
              position={Position.Bottom}
              id={h.id}
              style={{ left: h.position }}
              className={`${h.color} !w-3 !h-3 !border-2 !border-background !-bottom-1.5 transition-transform hover:!scale-125`}
            />
          ))
        : hasSource && (
            <Handle
              type="source"
              position={Position.Bottom}
              className={`${sourceHandleColor} !w-3 !h-3 !border-2 !border-background !-bottom-1.5 transition-transform hover:!scale-125`}
            />
          )}
    </div>
  );
}

function NodeHeader({
  icon: Icon,
  label,
  iconBg,
  iconColor,
  badge,
}: {
  icon: any;
  label: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className={`h-7 w-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
      </div>
      <span className="text-xs font-semibold text-foreground truncate flex-1">{label}</span>
      {badge && (
        <span className="text-[8px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full shrink-0">
          {badge}
        </span>
      )}
    </div>
  );
}

function NodeContent({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] text-muted-foreground leading-relaxed">{children}</div>;
}

function VariableBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1.5">
      <Variable className="h-2.5 w-2.5" />
      {name}
    </span>
  );
}

function MediaIndicator({ type }: { type: string }) {
  const icons: Record<string, any> = { image: Image, document: FileText, audio: Music, video: Video };
  const labels: Record<string, string> = { image: 'Imagem', document: 'Documento', audio: 'Áudio', video: 'Vídeo' };
  const Icon = icons[type] || FileText;
  return (
    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 rounded-md px-2 py-1">
      <Icon className="h-3 w-3" />
      <span>{labels[type] || type}</span>
    </div>
  );
}

/* ── Trigger Nodes ───────────────────────────────────────────── */

export function StartNode({ data, selected }: any) {
  const triggerLabels: Record<string, string> = {
    message_received: '📩 Mensagem recebida',
    keyword: '🔑 Palavra-chave',
    webhook: '🔗 Webhook',
    schedule: '📅 Agendamento',
    new_contact: '👤 Novo contato',
  };
  return (
    <NodeShell className="bg-success/15 border-2 border-success/60 backdrop-blur-sm" hasTarget={false} sourceHandleColor="!bg-success" selected={selected}>
      <div className="flex items-center gap-2 justify-center">
        <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
          <Zap className="h-4 w-4 text-success" />
        </div>
        <div className="text-left">
          <span className="text-sm font-bold text-success block">{data.label}</span>
          <span className="text-[10px] text-success/70">{triggerLabels[data.triggerType] || 'Gatilho'}</span>
        </div>
      </div>
      {data.keyword && (
        <div className="mt-2 text-[10px] bg-success/10 text-success rounded-md px-2 py-1 text-center font-mono">
          "{data.keyword}"
        </div>
      )}
    </NodeShell>
  );
}

/* ── Message Nodes ───────────────────────────────────────────── */

export function MessageNode({ data, selected }: any) {
  const isEmpty = !data.content;
  return (
    <NodeShell className="bg-card border border-border hover:border-primary/40" selected={selected}>
      <NodeHeader icon={MessageSquare} label={data.label} iconBg="bg-primary/15" iconColor="text-primary" />
      <NodeContent>
        {isEmpty ? (
          <p className="italic text-muted-foreground/50">✏️ Clique para escrever sua mensagem de texto, imagem ou arquivo...</p>
        ) : (
          <p className="line-clamp-3">{data.content}</p>
        )}
      </NodeContent>
      {data.mediaType && data.mediaType !== 'none' && <MediaIndicator type={data.mediaType} />}
      {data.variable && <VariableBadge name={data.variable} />}
    </NodeShell>
  );
}

export function QuestionNode({ data, selected }: any) {
  const responseLabels: Record<string, string> = {
    text: 'Texto', number: 'Número', email: 'E-mail', phone: 'Telefone', cpf: 'CPF', date: 'Data',
  };
  return (
    <NodeShell className="bg-card border border-info/40 hover:border-info/60" targetHandleColor="!bg-info" sourceHandleColor="!bg-info" selected={selected}>
      <NodeHeader icon={HelpCircle} label={data.label} iconBg="bg-info/15" iconColor="text-info" badge={responseLabels[data.responseType] || undefined} />
      <NodeContent>
        {data.content ? (
          <p className="line-clamp-2">{data.content}</p>
        ) : (
          <p className="italic text-muted-foreground/50">❓ Defina a pergunta e o tipo de resposta esperada...</p>
        )}
      </NodeContent>
      {data.options && (
        <div className="mt-2 space-y-1">
          {(data.options as string[]).slice(0, 3).map((opt: string, i: number) => (
            <div key={i} className="text-[10px] bg-info/5 border border-info/15 rounded-md px-2 py-0.5 text-info">{opt}</div>
          ))}
          {(data.options as string[]).length > 3 && (
            <span className="text-[9px] text-info/60">+{(data.options as string[]).length - 3} mais</span>
          )}
        </div>
      )}
      {data.variable && <VariableBadge name={data.variable} />}
    </NodeShell>
  );
}

export function MenuNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-primary/30 hover:border-primary/50" sourceHandleColor="!bg-primary" selected={selected}>
      <NodeHeader icon={ListChecks} label={data.label} iconBg="bg-primary/15" iconColor="text-primary" badge="Menu" />
      <NodeContent>
        {data.content ? (
          <p className="mb-2">{data.content}</p>
        ) : (
          <p className="mb-2 italic text-muted-foreground/50">📋 Configure o texto e os botões do menu...</p>
        )}
      </NodeContent>
      {data.buttons && (data.buttons as string[]).length > 0 && (
        <div className="space-y-1">
          {(data.buttons as string[]).slice(0, 4).map((btn: string, i: number) => (
            <div key={i} className="text-[10px] bg-primary/5 border border-primary/15 rounded-md px-2.5 py-1 text-primary text-center font-medium">
              {btn}
            </div>
          ))}
          {(data.buttons as string[]).length > 4 && (
            <span className="text-[9px] text-primary/60 block text-center">+{(data.buttons as string[]).length - 4} mais</span>
          )}
        </div>
      )}
    </NodeShell>
  );
}

export function LocationNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-destructive/30 hover:border-destructive/50" selected={selected}>
      <NodeHeader icon={MapPin} label={data.label} iconBg="bg-destructive/10" iconColor="text-destructive" />
      <NodeContent>
        <p>{data.content || 'Solicitar localização do contato...'}</p>
      </NodeContent>
      {data.variable && <VariableBadge name={data.variable} />}
    </NodeShell>
  );
}

/* ── Logic Nodes ─────────────────────────────────────────────── */

export function ConditionNode({ data, selected }: any) {
  const opLabels: Record<string, string> = {
    equals: '=', contains: '⊃', starts_with: 'A...', gt: '>', lt: '<', exists: '∃', regex: '/./',
  };
  return (
    <NodeShell
      className="bg-card border border-warning/40 hover:border-warning/60"
      targetHandleColor="!bg-warning"
      hasSource={false}
      selected={selected}
      sourceHandles={[
        { id: 'yes', position: '30%', color: '!bg-success' },
        { id: 'no', position: '70%', color: '!bg-destructive' },
      ]}
    >
      <NodeHeader icon={GitBranch} label={data.label} iconBg="bg-warning/15" iconColor="text-warning" badge="IF" />
      <NodeContent>
        {data.variable && data.operator ? (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-mono text-warning bg-warning/10 px-1 rounded">{data.variable}</span>
            <span className="font-bold text-foreground">{opLabels[data.operator] || data.operator}</span>
            {data.conditionValue && <span className="font-mono text-foreground bg-muted px-1 rounded">{data.conditionValue}</span>}
          </div>
        ) : (
          <p>{data.content || 'Configurar condição...'}</p>
        )}
      </NodeContent>
      <div className="flex justify-between mt-2.5 text-[9px] font-semibold">
        <span className="flex items-center gap-1 text-success bg-success/10 px-2 py-0.5 rounded-full">✓ Sim</span>
        <span className="flex items-center gap-1 text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">✗ Não</span>
      </div>
    </NodeShell>
  );
}

export function ValidationNode({ data, selected }: any) {
  const typeLabels: Record<string, string> = {
    email: 'E-mail', cpf: 'CPF', cnpj: 'CNPJ', phone: 'Telefone', number: 'Número', date: 'Data', custom: 'Regex',
  };
  return (
    <NodeShell
      className="bg-card border border-info/40 hover:border-info/60"
      targetHandleColor="!bg-info"
      hasSource={false}
      selected={selected}
      sourceHandles={[
        { id: 'valid', position: '30%', color: '!bg-success' },
        { id: 'invalid', position: '70%', color: '!bg-destructive' },
      ]}
    >
      <NodeHeader
        icon={ShieldCheck}
        label={data.label}
        iconBg="bg-info/15"
        iconColor="text-info"
        badge={typeLabels[data.validationType] || undefined}
      />
      <NodeContent>
        <p>{data.content || 'Validar dado recebido...'}</p>
      </NodeContent>
      {data.variable && <VariableBadge name={data.variable} />}
      <div className="flex justify-between mt-2.5 text-[9px] font-semibold">
        <span className="text-success bg-success/10 px-2 py-0.5 rounded-full">✓ Válido</span>
        <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">✗ Inválido</span>
      </div>
    </NodeShell>
  );
}

/* ── Action Nodes ────────────────────────────────────────────── */

export function AINode({ data, selected }: any) {
  return (
    <NodeShell
      className="bg-card border border-primary/50 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.2)] hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.3)]"
      selected={selected}
    >
      <NodeHeader icon={Brain} label={data.label} iconBg="bg-primary/20" iconColor="text-primary" badge={data.model || 'IA'} />
      <NodeContent>
        <p className="line-clamp-2">{data.content || 'Resposta inteligente com IA...'}</p>
      </NodeContent>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {data.model && (
          <span className="text-[9px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" />{data.model}
          </span>
        )}
        {data.useContext !== false && (
          <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">+ contexto</span>
        )}
      </div>
    </NodeShell>
  );
}

export function TransferNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-success/40 hover:border-success/60" targetHandleColor="!bg-success" sourceHandleColor="!bg-success" selected={selected}>
      <NodeHeader icon={User} label={data.label} iconBg="bg-success/15" iconColor="text-success" />
      <NodeContent>
        {data.department ? (
          <div className="flex items-center gap-1.5">
            <span className="bg-success/10 text-success text-[10px] font-medium px-2 py-0.5 rounded-md">{data.department}</span>
          </div>
        ) : (
          <p>Selecionar destino...</p>
        )}
      </NodeContent>
      {data.transferMessage && (
        <p className="text-[10px] text-muted-foreground/70 mt-1.5 line-clamp-1 italic">"{data.transferMessage}"</p>
      )}
    </NodeShell>
  );
}

export function ActionNode({ data, selected }: any) {
  const actionLabels: Record<string, string> = {
    add_tag: '🏷 Adicionar tag', remove_tag: '🗑 Remover tag',
    set_variable: '📝 Definir variável', update_contact: '👤 Atualizar contato',
    move_pipeline: '📊 Mover no pipeline', close_conversation: '🔒 Fechar conversa',
  };
  return (
    <NodeShell className="bg-card border border-border hover:border-primary/40" selected={selected}>
      <NodeHeader icon={Tag} label={data.label} iconBg="bg-primary/10" iconColor="text-primary" />
      <NodeContent>
        {data.actionType ? (
          <span className="text-[10px] font-medium">{actionLabels[data.actionType] || data.actionType}</span>
        ) : (
          <p>Configurar ação...</p>
        )}
        {data.actionType === 'add_tag' && data.tagValue && (
          <div className="mt-1.5">
            <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{data.tagValue}</span>
          </div>
        )}
        {data.actionType === 'set_variable' && data.variable && (
          <VariableBadge name={`${data.variable} = ${data.variableValue || '...'}`} />
        )}
      </NodeContent>
    </NodeShell>
  );
}

export function SendNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-info/30 hover:border-info/50" targetHandleColor="!bg-info" sourceHandleColor="!bg-info" selected={selected}>
      <NodeHeader icon={Send} label={data.label} iconBg="bg-info/15" iconColor="text-info" />
      <NodeContent>
        <p className="line-clamp-2">{data.content || 'Disparar mensagem/notificação...'}</p>
      </NodeContent>
      {data.mediaType && data.mediaType !== 'none' && <MediaIndicator type={data.mediaType} />}
    </NodeShell>
  );
}

/* ── Integration Nodes ───────────────────────────────────────── */

export function WebhookNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-border hover:border-primary/40" selected={selected}>
      <NodeHeader icon={Webhook} label={data.label} iconBg="bg-primary/10" iconColor="text-primary" />
      <NodeContent>
        {data.url ? (
          <>
            <div className="flex items-center gap-1.5">
              {data.method && (
                <span className="text-[9px] font-mono font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">{data.method}</span>
              )}
              <span className="truncate max-w-[150px] font-mono text-[10px]">{data.url}</span>
            </div>
          </>
        ) : (
          <p>Configurar webhook...</p>
        )}
      </NodeContent>
    </NodeShell>
  );
}

export function HttpNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-border hover:border-accent-foreground/40" selected={selected}>
      <NodeHeader icon={Globe} label={data.label} iconBg="bg-accent" iconColor="text-accent-foreground" />
      <NodeContent>
        {data.url ? (
          <div className="flex items-center gap-1.5">
            {data.method && (
              <span className="text-[9px] font-mono font-bold bg-accent text-accent-foreground px-1.5 py-0.5 rounded">{data.method}</span>
            )}
            <span className="truncate max-w-[150px] font-mono text-[10px]">{data.url}</span>
          </div>
        ) : (
          <p>Configurar requisição HTTP...</p>
        )}
      </NodeContent>
      {data.variable && <VariableBadge name={data.variable} />}
    </NodeShell>
  );
}

/* ── Flow Control Nodes ──────────────────────────────────────── */

export function DelayNode({ data, selected }: any) {
  const unitLabels: Record<string, string> = { seconds: 'seg', minutes: 'min', hours: 'h', days: 'd' };
  return (
    <NodeShell className="bg-card border border-border hover:border-muted-foreground/40" targetHandleColor="!bg-muted-foreground" sourceHandleColor="!bg-muted-foreground" selected={selected}>
      <NodeHeader icon={Timer} label={data.label} iconBg="bg-muted" iconColor="text-muted-foreground" />
      <NodeContent>
        {data.delayValue ? (
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-foreground">{data.delayValue}</span>
            <span className="text-xs text-muted-foreground">{unitLabels[data.delayUnit] || data.delayUnit || 'min'}</span>
          </div>
        ) : (
          <p>{data.duration || 'Configurar tempo...'}</p>
        )}
      </NodeContent>
    </NodeShell>
  );
}

export function ScheduleNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-border hover:border-accent-foreground/40" targetHandleColor="!bg-accent-foreground" sourceHandleColor="!bg-accent-foreground" selected={selected}>
      <NodeHeader icon={Clock} label={data.label} iconBg="bg-accent" iconColor="text-accent-foreground" />
      <NodeContent>
        {data.scheduleTime ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{data.scheduleTime}</span>
            {data.scheduleDays && <span className="text-[9px] text-muted-foreground">{data.scheduleDays}</span>}
          </div>
        ) : (
          <p>{data.content || 'Agendar horário...'}</p>
        )}
      </NodeContent>
    </NodeShell>
  );
}

export function LoopNode({ data, selected }: any) {
  return (
    <NodeShell className="bg-card border border-warning/30 hover:border-warning/50" targetHandleColor="!bg-warning" sourceHandleColor="!bg-warning" selected={selected}>
      <NodeHeader icon={Repeat} label={data.label} iconBg="bg-warning/10" iconColor="text-warning" />
      <NodeContent>
        {data.maxIterations ? (
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-foreground">{data.maxIterations}x</span>
            <span className="text-[10px] text-muted-foreground">repetições</span>
          </div>
        ) : (
          <p>{data.content || 'Configurar loop...'}</p>
        )}
        {data.loopCondition && (
          <p className="text-[10px] text-warning/70 mt-1 font-mono">até: {data.loopCondition}</p>
        )}
      </NodeContent>
    </NodeShell>
  );
}

export function EndNode({ data, selected }: any) {
  const reasonLabels: Record<string, string> = {
    resolved: '✅ Resolvido', closed: '🔒 Fechado', timeout: '⏰ Timeout', transferred: '➡️ Transferido',
  };
  return (
    <NodeShell className="bg-destructive/15 border-2 border-destructive/50" hasSource={false} targetHandleColor="!bg-destructive" selected={selected}>
      <div className="flex items-center gap-2 justify-center">
        <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
          <XCircle className="h-4 w-4 text-destructive" />
        </div>
        <div className="text-left">
          <span className="text-sm font-bold text-destructive block">{data.label}</span>
          {data.endReason && (
            <span className="text-[10px] text-destructive/70">{reasonLabels[data.endReason] || data.endReason}</span>
          )}
        </div>
      </div>
      {data.endMessage && (
        <p className="text-[10px] text-destructive/60 mt-1.5 text-center italic line-clamp-1">"{data.endMessage}"</p>
      )}
    </NodeShell>
  );
}

/* ── Export ───────────────────────────────────────────────────── */

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
