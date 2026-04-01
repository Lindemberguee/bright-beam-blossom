import {
  MessageSquare, HelpCircle, GitBranch, Timer, Webhook, Tag,
  Brain, XCircle, Zap, User, Send, ListChecks, Globe, ShieldCheck,
  Repeat, Clock, MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BlockType {
  type: string;
  icon: any;
  label: string;
  color: string;
  category: string;
  description: string;
}

export const blockCategories = [
  { id: 'triggers', label: 'Gatilhos' },
  { id: 'messages', label: 'Mensagens' },
  { id: 'logic', label: 'Lógica' },
  { id: 'actions', label: 'Ações' },
  { id: 'integrations', label: 'Integrações' },
  { id: 'flow', label: 'Controle de Fluxo' },
];

export const blockTypes: BlockType[] = [
  { type: 'start', icon: Zap, label: 'Início', color: 'text-success', category: 'triggers', description: 'Ponto de entrada do fluxo' },
  { type: 'message', icon: MessageSquare, label: 'Mensagem', color: 'text-primary', category: 'messages', description: 'Enviar texto, imagem ou arquivo' },
  { type: 'question', icon: HelpCircle, label: 'Pergunta', color: 'text-info', category: 'messages', description: 'Perguntar e aguardar resposta' },
  { type: 'menu', icon: ListChecks, label: 'Menu', color: 'text-primary', category: 'messages', description: 'Menu interativo com botões' },
  { type: 'condition', icon: GitBranch, label: 'Condição', color: 'text-warning', category: 'logic', description: 'Lógica condicional Se/Senão' },
  { type: 'validation', icon: ShieldCheck, label: 'Validação', color: 'text-info', category: 'logic', description: 'Validar dado recebido' },
  { type: 'delay', icon: Timer, label: 'Delay', color: 'text-muted-foreground', category: 'flow', description: 'Aguardar tempo antes de continuar' },
  { type: 'schedule', icon: Clock, label: 'Agendar', color: 'text-accent-foreground', category: 'flow', description: 'Agendar ação para horário' },
  { type: 'loop', icon: Repeat, label: 'Loop', color: 'text-warning', category: 'flow', description: 'Repetir bloco N vezes' },
  { type: 'ai', icon: Brain, label: 'IA', color: 'text-primary', category: 'actions', description: 'Resposta inteligente com IA' },
  { type: 'transfer', icon: User, label: 'Transferir', color: 'text-success', category: 'actions', description: 'Transferir para atendente' },
  { type: 'action', icon: Tag, label: 'Tag/Ação', color: 'text-primary', category: 'actions', description: 'Adicionar tag ou ação CRM' },
  { type: 'send', icon: Send, label: 'Disparar', color: 'text-info', category: 'actions', description: 'Disparar notificação' },
  { type: 'location', icon: MapPin, label: 'Localização', color: 'text-destructive', category: 'messages', description: 'Solicitar localização' },
  { type: 'webhook', icon: Webhook, label: 'Webhook', color: 'text-primary', category: 'integrations', description: 'Chamar webhook externo' },
  { type: 'http', icon: Globe, label: 'HTTP', color: 'text-accent-foreground', category: 'integrations', description: 'Requisição HTTP personalizada' },
  { type: 'end', icon: XCircle, label: 'Encerrar', color: 'text-destructive', category: 'flow', description: 'Finalizar atendimento' },
];

interface FlowBlockPaletteProps {
  onDragStart: (type: string, label: string) => void;
}

export function FlowBlockPalette({ onDragStart }: FlowBlockPaletteProps) {
  return (
    <div className="w-60 border-r border-border/50 bg-card/30 p-3 overflow-auto">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        Blocos
      </p>
      {blockCategories.map(cat => {
        const blocks = blockTypes.filter(b => b.category === cat.id);
        if (blocks.length === 0) return null;
        return (
          <div key={cat.id} className="mb-4">
            <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1.5 px-1">{cat.label}</p>
            <div className="space-y-0.5">
              {blocks.map((block) => (
                <button
                  key={block.type}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow-type', block.type);
                    e.dataTransfer.setData('application/reactflow-label', block.label);
                    e.dataTransfer.effectAllowed = 'move';
                    onDragStart(block.type, block.label);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-grab active:cursor-grabbing group"
                  title={block.description}
                >
                  <block.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", block.color)} />
                  <div className="text-left">
                    <span className="block">{block.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
