import { useState } from 'react';
import {
  MessageSquare, HelpCircle, GitBranch, Timer, Webhook, Tag,
  Brain, XCircle, Zap, User, Send, ListChecks, Globe, ShieldCheck,
  Repeat, Clock, MapPin, Search, ChevronDown, ChevronRight, GripVertical,
  CreditCard, Tags, Pause, Headphones, Bell, Shuffle, Link2,
  Crosshair, Hourglass, Building2, Plug, KanbanSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface BlockType {
  type: string;
  icon: any;
  label: string;
  color: string;
  category: string;
  description: string;
}

export const blockCategories = [
  { id: 'triggers', label: 'Gatilhos', emoji: '⚡' },
  { id: 'messages', label: 'Mensagens', emoji: '💬' },
  { id: 'logic', label: 'Lógica', emoji: '🧠' },
  { id: 'actions', label: 'Ações', emoji: '🎯' },
  { id: 'sales', label: 'Vendas', emoji: '💰' },
  { id: 'integrations', label: 'Integrações', emoji: '🔗' },
  { id: 'flow', label: 'Controle', emoji: '⚙️' },
];

export const blockTypes: BlockType[] = [
  // Triggers
  { type: 'start', icon: Zap, label: 'Início', color: 'text-success', category: 'triggers', description: 'Ponto de entrada do fluxo' },
  // Messages
  { type: 'message', icon: MessageSquare, label: 'Mensagem', color: 'text-primary', category: 'messages', description: 'Enviar texto, imagem ou arquivo' },
  { type: 'question', icon: HelpCircle, label: 'Pergunta', color: 'text-info', category: 'messages', description: 'Perguntar e capturar resposta' },
  { type: 'menu', icon: ListChecks, label: 'Menu', color: 'text-primary', category: 'messages', description: 'Menu interativo com botões' },
  { type: 'location', icon: MapPin, label: 'Localização', color: 'text-destructive', category: 'messages', description: 'Solicitar localização GPS' },
  { type: 'notification', icon: Bell, label: 'Notificação', color: 'text-warning', category: 'messages', description: 'Enviar notificação push ou interna' },
  // Logic
  { type: 'condition', icon: GitBranch, label: 'Condição', color: 'text-warning', category: 'logic', description: 'Lógica Se/Senão com variáveis' },
  { type: 'validation', icon: ShieldCheck, label: 'Validação', color: 'text-info', category: 'logic', description: 'Validar CPF, e-mail, telefone...' },
  { type: 'wait_response', icon: Pause, label: 'Aguarda Resposta', color: 'text-muted-foreground', category: 'logic', description: 'Pausar até resposta do contato' },
  { type: 'distributor', icon: Shuffle, label: 'Distribuidor', color: 'text-primary', category: 'logic', description: 'Distribuir aleatório ou round-robin' },
  // Actions
  { type: 'ai', icon: Brain, label: 'IA', color: 'text-primary', category: 'actions', description: 'Resposta inteligente com IA' },
  { type: 'transfer', icon: User, label: 'Transferir', color: 'text-success', category: 'actions', description: 'Transferir para atendente' },
  { type: 'action', icon: Tag, label: 'Tag / Ação', color: 'text-primary', category: 'actions', description: 'Tags, variáveis, CRM' },
  { type: 'tags', icon: Tags, label: 'Etiquetas', color: 'text-warning', category: 'actions', description: 'Gerenciar etiquetas do contato' },
  { type: 'send', icon: Send, label: 'Disparar', color: 'text-info', category: 'actions', description: 'Enviar notificação avulsa' },
  { type: 'department', icon: Building2, label: 'Departamento', color: 'text-primary', category: 'actions', description: 'Encaminhar para departamento' },
  { type: 'chat_controller', icon: Headphones, label: 'Controlador de Chat', color: 'text-info', category: 'actions', description: 'Abrir, fechar ou pausar chat' },
  { type: 'kanban_action', icon: KanbanSquare, label: 'Kanban', color: 'text-primary', category: 'actions', description: 'Criar/mover cards no Kanban' },
  // Sales
  { type: 'pix_button', icon: CreditCard, label: 'Botão PIX', color: 'text-success', category: 'sales', description: 'Gerar cobrança PIX e enviar link' },
  { type: 'pixel', icon: Crosshair, label: 'Pixel', color: 'text-warning', category: 'sales', description: 'Disparar evento de pixel/tracking' },
  // Integrations
  { type: 'webhook', icon: Webhook, label: 'Webhook', color: 'text-primary', category: 'integrations', description: 'Chamar webhook externo' },
  { type: 'http', icon: Globe, label: 'HTTP', color: 'text-accent-foreground', category: 'integrations', description: 'Requisição HTTP completa' },
  { type: 'integration', icon: Plug, label: 'Integração', color: 'text-primary', category: 'integrations', description: 'Conectar com serviço externo' },
  { type: 'flow_link', icon: Link2, label: 'Conexão de Fluxo', color: 'text-info', category: 'integrations', description: 'Conectar a outro fluxo' },
  // Flow control
  { type: 'delay', icon: Timer, label: 'Delay', color: 'text-muted-foreground', category: 'flow', description: 'Aguardar tempo definido' },
  { type: 'smart_delay', icon: Hourglass, label: 'Intervalo Inteligente', color: 'text-warning', category: 'flow', description: 'Delay com horário comercial' },
  { type: 'schedule', icon: Clock, label: 'Agendar', color: 'text-accent-foreground', category: 'flow', description: 'Executar em horário específico' },
  { type: 'loop', icon: Repeat, label: 'Loop', color: 'text-warning', category: 'flow', description: 'Repetir bloco N vezes' },
  { type: 'end', icon: XCircle, label: 'Encerrar', color: 'text-destructive', category: 'flow', description: 'Finalizar atendimento' },
];

interface FlowBlockPaletteProps {
  onDragStart: (type: string, label: string) => void;
}

export function FlowBlockPalette({ onDragStart }: FlowBlockPaletteProps) {
  const [search, setSearch] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(blockCategories.map(c => [c.id, true]))
  );

  const filteredBlocks = blockTypes.filter(
    (b) =>
      b.label.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="w-64 h-full border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border/30">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
          Blocos disponíveis
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar bloco..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-xs pl-8 bg-muted/50 border-border/50"
          />
        </div>
      </div>

      {/* Blocks */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {blockCategories.map((cat) => {
          const blocks = filteredBlocks.filter((b) => b.category === cat.id);
          if (blocks.length === 0) return null;

          return (
            <Collapsible key={cat.id} open={openSections[cat.id]} onOpenChange={() => toggleSection(cat.id)}>
              <CollapsibleTrigger className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:bg-accent/30 transition-colors">
                <span>{cat.emoji}</span>
                <span className="flex-1 text-left">{cat.label}</span>
                {openSections[cat.id] ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0.5 mt-0.5">
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
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
                    <block.icon className={cn('h-4 w-4 transition-transform group-hover:scale-110 shrink-0', block.color)} />
                    <div className="text-left min-w-0">
                      <span className="block font-medium truncate">{block.label}</span>
                      <span className="block text-[10px] text-muted-foreground/60 truncate">{block.description}</span>
                    </div>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-border/30">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Arraste blocos para o canvas
        </p>
      </div>
    </div>
  );
}
