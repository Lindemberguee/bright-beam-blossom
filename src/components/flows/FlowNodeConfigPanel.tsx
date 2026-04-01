import { X, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { Node } from '@xyflow/react';
import { blockTypes } from './FlowBlockPalette';
import { cn } from '@/lib/utils';

interface FlowNodeConfigPanelProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Label className="text-xs font-medium">{children}</Label>
      {hint && (
        <span className="text-[9px] text-muted-foreground/60" title={hint}>
          <Info className="h-3 w-3" />
        </span>
      )}
    </div>
  );
}

export function FlowNodeConfigPanel({ node, onUpdate, onClose, onDelete }: FlowNodeConfigPanelProps) {
  const data = node.data as Record<string, any>;
  const update = (key: string, value: any) => onUpdate(node.id, { ...data, [key]: value });
  const blockInfo = blockTypes.find((b) => b.type === node.type);

  return (
    <div className="w-80 border-l border-border/50 bg-card/80 backdrop-blur-md flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {blockInfo && <blockInfo.icon className={cn('h-4 w-4', blockInfo.color)} />}
            <h3 className="text-sm font-bold text-foreground">{blockInfo?.label || 'Bloco'}</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {blockInfo && <p className="text-[10px] text-muted-foreground">{blockInfo.description}</p>}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4 space-y-5">
        {/* Common: Name */}
        <Section title="Identificação">
          <div className="space-y-1.5">
            <FieldLabel>Nome do bloco</FieldLabel>
            <Input value={data.label || ''} onChange={(e) => update('label', e.target.value)} className="h-8 text-sm bg-muted/50" />
          </div>
        </Section>

        <Separator className="bg-border/30" />

        {/* ─── START ─── */}
        {node.type === 'start' && (
          <Section title="Gatilho">
            <div className="space-y-1.5">
              <FieldLabel hint="Define como o fluxo será iniciado">Tipo de gatilho</FieldLabel>
              <Select value={data.triggerType || 'message_received'} onValueChange={(v) => update('triggerType', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="message_received">📩 Mensagem recebida</SelectItem>
                  <SelectItem value="keyword">🔑 Palavra-chave</SelectItem>
                  <SelectItem value="webhook">🔗 Webhook externo</SelectItem>
                  <SelectItem value="schedule">📅 Agendamento</SelectItem>
                  <SelectItem value="new_contact">👤 Novo contato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data.triggerType === 'keyword' && (
              <div className="space-y-1.5">
                <FieldLabel hint="Separe múltiplas palavras por vírgula">Palavra-chave</FieldLabel>
                <Input value={data.keyword || ''} onChange={(e) => update('keyword', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="oi, olá, menu, ajuda" />
              </div>
            )}
            {data.triggerType === 'schedule' && (
              <>
                <div className="space-y-1.5">
                  <FieldLabel>Horário</FieldLabel>
                  <Input type="time" value={data.scheduleTime || ''} onChange={(e) => update('scheduleTime', e.target.value)} className="h-8 text-sm bg-muted/50" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Dias da semana</FieldLabel>
                  <Input value={data.scheduleDays || ''} onChange={(e) => update('scheduleDays', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="seg, ter, qua..." />
                </div>
              </>
            )}
          </Section>
        )}

        {/* ─── MESSAGE / SEND ─── */}
        {(node.type === 'message' || node.type === 'send') && (
          <Section title="Conteúdo">
            <div className="space-y-1.5">
              <FieldLabel hint="Use {{variavel}} para inserir dados dinâmicos">Mensagem</FieldLabel>
              <Textarea value={data.content || ''} onChange={(e) => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[100px]" placeholder="Olá {{nome}}! 👋 Como posso ajudar?" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Tipo de mídia</FieldLabel>
              <Select value={data.mediaType || 'none'} onValueChange={(v) => update('mediaType', v === 'none' ? undefined : v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem mídia</SelectItem>
                  <SelectItem value="image">🖼 Imagem</SelectItem>
                  <SelectItem value="document">📄 Documento</SelectItem>
                  <SelectItem value="audio">🎵 Áudio</SelectItem>
                  <SelectItem value="video">🎥 Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data.mediaType && data.mediaType !== 'none' && (
              <div className="space-y-1.5">
                <FieldLabel>URL da mídia</FieldLabel>
                <Input value={data.mediaUrl || ''} onChange={(e) => update('mediaUrl', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="https://..." />
              </div>
            )}
          </Section>
        )}

        {/* ─── QUESTION ─── */}
        {node.type === 'question' && (
          <Section title="Pergunta">
            <div className="space-y-1.5">
              <FieldLabel>Texto da pergunta</FieldLabel>
              <Textarea value={data.content || ''} onChange={(e) => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[70px]" placeholder="Qual é o seu nome?" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel hint="Define a validação automática da resposta">Tipo de resposta</FieldLabel>
              <Select value={data.responseType || 'text'} onValueChange={(v) => update('responseType', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">📝 Texto livre</SelectItem>
                  <SelectItem value="number">🔢 Número</SelectItem>
                  <SelectItem value="email">📧 E-mail</SelectItem>
                  <SelectItem value="phone">📱 Telefone</SelectItem>
                  <SelectItem value="cpf">🪪 CPF</SelectItem>
                  <SelectItem value="date">📅 Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel hint="A resposta será armazenada nessa variável">Salvar em variável</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{nome}}" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Mensagem se inválido</FieldLabel>
              <Input value={data.invalidMessage || ''} onChange={(e) => update('invalidMessage', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="Resposta inválida, tente novamente" />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel>Permitir pular</FieldLabel>
              <Switch checked={data.allowSkip || false} onCheckedChange={(v) => update('allowSkip', v)} />
            </div>
          </Section>
        )}

        {/* ─── MENU ─── */}
        {node.type === 'menu' && (
          <Section title="Menu Interativo">
            <div className="space-y-1.5">
              <FieldLabel>Texto do menu</FieldLabel>
              <Textarea value={data.content || ''} onChange={(e) => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Escolha uma opção:" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel hint="Cada linha vira um botão no WhatsApp">Botões (um por linha)</FieldLabel>
              <Textarea
                value={(data.buttons || []).join('\n')}
                onChange={(e) => update('buttons', e.target.value.split('\n').filter(Boolean))}
                className="text-sm bg-muted/50 min-h-[80px] font-mono"
                placeholder={"Vendas\nSuporte\nFinanceiro"}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Salvar escolha em</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{opcao}}" />
            </div>
          </Section>
        )}

        {/* ─── CONDITION ─── */}
        {node.type === 'condition' && (
          <Section title="Condição">
            <div className="space-y-1.5">
              <FieldLabel hint="Use variáveis capturadas anteriormente">Variável</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{opcao}}" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Operador</FieldLabel>
              <Select value={data.operator || 'equals'} onValueChange={(v) => update('operator', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="not_equals">Diferente de</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="not_contains">Não contém</SelectItem>
                  <SelectItem value="starts_with">Começa com</SelectItem>
                  <SelectItem value="ends_with">Termina com</SelectItem>
                  <SelectItem value="gt">Maior que</SelectItem>
                  <SelectItem value="gte">Maior ou igual</SelectItem>
                  <SelectItem value="lt">Menor que</SelectItem>
                  <SelectItem value="lte">Menor ou igual</SelectItem>
                  <SelectItem value="exists">Existe (não vazio)</SelectItem>
                  <SelectItem value="not_exists">Não existe</SelectItem>
                  <SelectItem value="regex">Regex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data.operator !== 'exists' && data.operator !== 'not_exists' && (
              <div className="space-y-1.5">
                <FieldLabel>Valor de comparação</FieldLabel>
                <Input value={data.conditionValue || ''} onChange={(e) => update('conditionValue', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="vendas" />
              </div>
            )}
          </Section>
        )}

        {/* ─── VALIDATION ─── */}
        {node.type === 'validation' && (
          <Section title="Validação">
            <div className="space-y-1.5">
              <FieldLabel>Variável a validar</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{email}}" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Tipo de validação</FieldLabel>
              <Select value={data.validationType || 'email'} onValueChange={(v) => update('validationType', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">📧 E-mail</SelectItem>
                  <SelectItem value="cpf">🪪 CPF</SelectItem>
                  <SelectItem value="cnpj">🏢 CNPJ</SelectItem>
                  <SelectItem value="phone">📱 Telefone</SelectItem>
                  <SelectItem value="number">🔢 Número</SelectItem>
                  <SelectItem value="date">📅 Data</SelectItem>
                  <SelectItem value="url">🔗 URL</SelectItem>
                  <SelectItem value="custom">⚙️ Regex personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data.validationType === 'custom' && (
              <div className="space-y-1.5">
                <FieldLabel>Expressão Regex</FieldLabel>
                <Input value={data.customRegex || ''} onChange={(e) => update('customRegex', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="^[A-Z]{3}\\d{4}$" />
              </div>
            )}
            <div className="space-y-1.5">
              <FieldLabel>Mensagem se inválido</FieldLabel>
              <Input value={data.invalidMessage || ''} onChange={(e) => update('invalidMessage', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="Dado inválido, tente novamente" />
            </div>
          </Section>
        )}

        {/* ─── DELAY ─── */}
        {node.type === 'delay' && (
          <Section title="Tempo de Espera">
            <div className="space-y-1.5">
              <FieldLabel>Duração</FieldLabel>
              <div className="flex gap-2">
                <Input type="number" min="1" value={data.delayValue || ''} onChange={(e) => update('delayValue', e.target.value)} className="h-8 text-sm bg-muted/50 w-24" placeholder="5" />
                <Select value={data.delayUnit || 'minutes'} onValueChange={(v) => update('delayUnit', v)}>
                  <SelectTrigger className="h-8 text-sm bg-muted/50 flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Segundos</SelectItem>
                    <SelectItem value="minutes">Minutos</SelectItem>
                    <SelectItem value="hours">Horas</SelectItem>
                    <SelectItem value="days">Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel hint="Aguarda resposta do contato antes de continuar">Aguardar resposta</FieldLabel>
              <Switch checked={data.waitForReply || false} onCheckedChange={(v) => update('waitForReply', v)} />
            </div>
          </Section>
        )}

        {/* ─── SCHEDULE ─── */}
        {node.type === 'schedule' && (
          <Section title="Agendamento">
            <div className="space-y-1.5">
              <FieldLabel>Horário</FieldLabel>
              <Input type="time" value={data.scheduleTime || ''} onChange={(e) => update('scheduleTime', e.target.value)} className="h-8 text-sm bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel hint="Deixe vazio para todos os dias">Dias da semana</FieldLabel>
              <Input value={data.scheduleDays || ''} onChange={(e) => update('scheduleDays', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="seg, ter, qua, qui, sex" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Fuso horário</FieldLabel>
              <Select value={data.timezone || 'America/Sao_Paulo'} onValueChange={(v) => update('timezone', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">São Paulo (BRT)</SelectItem>
                  <SelectItem value="America/Manaus">Manaus (AMT)</SelectItem>
                  <SelectItem value="America/Recife">Recife (BRT)</SelectItem>
                  <SelectItem value="America/Cuiaba">Cuiabá (AMT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>
        )}

        {/* ─── LOOP ─── */}
        {node.type === 'loop' && (
          <Section title="Repetição">
            <div className="space-y-1.5">
              <FieldLabel>Máximo de repetições</FieldLabel>
              <Input type="number" min="1" max="100" value={data.maxIterations || ''} onChange={(e) => update('maxIterations', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="3" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel hint="Opcional: parar o loop quando essa condição for verdadeira">Condição de parada</FieldLabel>
              <Input value={data.loopCondition || ''} onChange={(e) => update('loopCondition', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{resposta}} == sim" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Mensagem em cada iteração</FieldLabel>
              <Textarea value={data.loopMessage || ''} onChange={(e) => update('loopMessage', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Não entendi. Pode repetir?" />
            </div>
          </Section>
        )}

        {/* ─── AI ─── */}
        {node.type === 'ai' && (
          <Section title="Inteligência Artificial">
            <div className="space-y-1.5">
              <FieldLabel hint="Instrua a IA sobre o comportamento esperado">Prompt do sistema</FieldLabel>
              <Textarea value={data.content || ''} onChange={(e) => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[100px]" placeholder="Você é um assistente de vendas da empresa X. Seja cordial e objetivo..." />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Modelo de IA</FieldLabel>
              <Select value={data.model || 'gpt-5-mini'} onValueChange={(v) => update('model', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5-nano">GPT-5 Nano (rápido)</SelectItem>
                  <SelectItem value="gpt-5-mini">GPT-5 Mini (equilibrado)</SelectItem>
                  <SelectItem value="gpt-5">GPT-5 (avançado)</SelectItem>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Temperatura</FieldLabel>
              <Input type="number" min="0" max="1" step="0.1" value={data.temperature ?? 0.7} onChange={(e) => update('temperature', parseFloat(e.target.value))} className="h-8 text-sm bg-muted/50 w-24" />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel hint="Inclui o histórico da conversa no prompt">Usar contexto</FieldLabel>
              <Switch checked={data.useContext ?? true} onCheckedChange={(v) => update('useContext', v)} />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel hint="Permite múltiplas trocas com a IA">Modo diálogo</FieldLabel>
              <Switch checked={data.dialogMode || false} onCheckedChange={(v) => update('dialogMode', v)} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Salvar resposta em</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{resposta_ia}}" />
            </div>
          </Section>
        )}

        {/* ─── TRANSFER ─── */}
        {node.type === 'transfer' && (
          <Section title="Transferência">
            <div className="space-y-1.5">
              <FieldLabel>Departamento</FieldLabel>
              <Input value={data.department || ''} onChange={(e) => update('department', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="Vendas" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel hint="Opcional: atribuir a um agente específico">Agente</FieldLabel>
              <Input value={data.agent || ''} onChange={(e) => update('agent', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="Deixe vazio para fila" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Mensagem de transferência</FieldLabel>
              <Textarea value={data.transferMessage || ''} onChange={(e) => update('transferMessage', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Vou transferir você para nosso time de {{departamento}}..." />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel hint="Notifica o contato quando atendente aceitar">Notificar contato</FieldLabel>
              <Switch checked={data.notifyContact ?? true} onCheckedChange={(v) => update('notifyContact', v)} />
            </div>
          </Section>
        )}

        {/* ─── ACTION ─── */}
        {node.type === 'action' && (
          <Section title="Ação">
            <div className="space-y-1.5">
              <FieldLabel>Tipo de ação</FieldLabel>
              <Select value={data.actionType || 'add_tag'} onValueChange={(v) => update('actionType', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add_tag">🏷 Adicionar tag</SelectItem>
                  <SelectItem value="remove_tag">🗑 Remover tag</SelectItem>
                  <SelectItem value="set_variable">📝 Definir variável</SelectItem>
                  <SelectItem value="update_contact">👤 Atualizar contato</SelectItem>
                  <SelectItem value="move_pipeline">📊 Mover no pipeline</SelectItem>
                  <SelectItem value="close_conversation">🔒 Fechar conversa</SelectItem>
                  <SelectItem value="assign_agent">👥 Atribuir agente</SelectItem>
                  <SelectItem value="add_note">📋 Adicionar nota</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(data.actionType === 'add_tag' || data.actionType === 'remove_tag') && (
              <div className="space-y-1.5">
                <FieldLabel>Nome da tag</FieldLabel>
                <Input value={data.tagValue || ''} onChange={(e) => update('tagValue', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="lead-quente" />
              </div>
            )}
            {data.actionType === 'set_variable' && (
              <>
                <div className="space-y-1.5">
                  <FieldLabel>Variável</FieldLabel>
                  <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{etapa}}" />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Valor</FieldLabel>
                  <Input value={data.variableValue || ''} onChange={(e) => update('variableValue', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="qualificado" />
                </div>
              </>
            )}
            {data.actionType === 'update_contact' && (
              <>
                <div className="space-y-1.5">
                  <FieldLabel>Campo do contato</FieldLabel>
                  <Select value={data.contactField || 'name'} onValueChange={(v) => update('contactField', v)}>
                    <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nome</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="company">Empresa</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Valor (aceita variáveis)</FieldLabel>
                  <Input value={data.contactValue || ''} onChange={(e) => update('contactValue', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="{{nome}}" />
                </div>
              </>
            )}
            {data.actionType === 'add_note' && (
              <div className="space-y-1.5">
                <FieldLabel>Conteúdo da nota</FieldLabel>
                <Textarea value={data.noteContent || ''} onChange={(e) => update('noteContent', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Cliente interessado em..." />
              </div>
            )}
          </Section>
        )}

        {/* ─── LOCATION ─── */}
        {node.type === 'location' && (
          <Section title="Localização">
            <div className="space-y-1.5">
              <FieldLabel>Mensagem de solicitação</FieldLabel>
              <Textarea value={data.content || ''} onChange={(e) => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Compartilhe sua localização para encontrarmos a unidade mais próxima" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Salvar em variável</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{localizacao}}" />
            </div>
          </Section>
        )}

        {/* ─── WEBHOOK / HTTP ─── */}
        {(node.type === 'webhook' || node.type === 'http') && (
          <Section title="Requisição">
            <div className="space-y-1.5">
              <FieldLabel>URL</FieldLabel>
              <Input value={data.url || ''} onChange={(e) => update('url', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="https://api.exemplo.com/webhook" />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Método HTTP</FieldLabel>
              <Select value={data.method || 'POST'} onValueChange={(v) => update('method', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Headers (JSON)</FieldLabel>
              <Textarea value={data.headers || ''} onChange={(e) => update('headers', e.target.value)} className="text-sm bg-muted/50 font-mono min-h-[60px]" placeholder={'{\n  "Authorization": "Bearer {{token}}"\n}'} />
            </div>
            {data.method !== 'GET' && (
              <div className="space-y-1.5">
                <FieldLabel hint="Aceita variáveis dinâmicas">Body (JSON)</FieldLabel>
                <Textarea value={data.body || ''} onChange={(e) => update('body', e.target.value)} className="text-sm bg-muted/50 font-mono min-h-[60px]" placeholder={'{\n  "nome": "{{nome}}",\n  "telefone": "{{telefone}}"\n}'} />
              </div>
            )}
            <div className="space-y-1.5">
              <FieldLabel hint="Salva a resposta da API para uso posterior">Salvar resposta em</FieldLabel>
              <Input value={data.variable || ''} onChange={(e) => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{api_response}}" />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel hint="Pausa o fluxo se a requisição falhar">Parar em caso de erro</FieldLabel>
              <Switch checked={data.stopOnError ?? false} onCheckedChange={(v) => update('stopOnError', v)} />
            </div>
          </Section>
        )}

        {/* ─── END ─── */}
        {node.type === 'end' && (
          <Section title="Encerramento">
            <div className="space-y-1.5">
              <FieldLabel>Motivo do encerramento</FieldLabel>
              <Select value={data.endReason || 'resolved'} onValueChange={(v) => update('endReason', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="resolved">✅ Resolvido</SelectItem>
                  <SelectItem value="closed">🔒 Fechado pelo bot</SelectItem>
                  <SelectItem value="timeout">⏰ Timeout</SelectItem>
                  <SelectItem value="transferred">➡️ Transferido</SelectItem>
                  <SelectItem value="no_response">🔇 Sem resposta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Mensagem de encerramento</FieldLabel>
              <Textarea value={data.endMessage || ''} onChange={(e) => update('endMessage', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Obrigado pelo contato! 😊 Até logo!" />
            </div>
            <div className="flex items-center justify-between">
              <FieldLabel hint="Fecha a conversa automaticamente no CRM">Fechar conversa</FieldLabel>
              <Switch checked={data.closeConversation ?? true} onCheckedChange={(v) => update('closeConversation', v)} />
            </div>
          </Section>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <p className="text-[9px] text-muted-foreground/50 text-center font-mono">ID: {node.id}</p>
        {node.type !== 'start' && (
          <Button variant="destructive" size="sm" className="w-full gap-2" onClick={() => onDelete(node.id)}>
            <Trash2 className="h-3.5 w-3.5" /> Excluir bloco
          </Button>
        )}
      </div>
    </div>
  );
}
