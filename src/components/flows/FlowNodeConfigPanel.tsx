import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Node } from '@xyflow/react';

interface FlowNodeConfigPanelProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, any>) => void;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

export function FlowNodeConfigPanel({ node, onUpdate, onClose, onDelete }: FlowNodeConfigPanelProps) {
  const data = node.data as Record<string, any>;
  const update = (key: string, value: any) => onUpdate(node.id, { ...data, [key]: value });

  return (
    <div className="w-80 border-l border-border/50 bg-card/50 backdrop-blur-sm flex flex-col animate-fade-in">
      <div className="h-12 px-4 flex items-center justify-between border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Configurar Bloco</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Common fields */}
        <div className="space-y-2">
          <Label className="text-xs">Nome do bloco</Label>
          <Input value={data.label || ''} onChange={e => update('label', e.target.value)} className="h-8 text-sm bg-muted/50" />
        </div>

        {/* Type-specific fields */}
        {(node.type === 'message' || node.type === 'send') && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Conteúdo da mensagem</Label>
              <Textarea value={data.content || ''} onChange={e => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[80px]" placeholder="Digite a mensagem..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Tipo de mídia</Label>
              <Select value={data.mediaType || 'none'} onValueChange={v => update('mediaType', v === 'none' ? undefined : v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem mídia</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {node.type === 'question' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Pergunta</Label>
              <Textarea value={data.content || ''} onChange={e => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Digite a pergunta..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Tipo de resposta esperada</Label>
              <Select value={data.responseType || 'text'} onValueChange={v => update('responseType', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto livre</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Salvar em variável</Label>
              <Input value={data.variable || ''} onChange={e => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{nome_variavel}}" />
            </div>
          </>
        )}

        {node.type === 'menu' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Texto do menu</Label>
              <Textarea value={data.content || ''} onChange={e => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Escolha uma opção:" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Botões (um por linha)</Label>
              <Textarea
                value={(data.buttons || []).join('\n')}
                onChange={e => update('buttons', e.target.value.split('\n').filter(Boolean))}
                className="text-sm bg-muted/50 min-h-[80px] font-mono"
                placeholder="Vendas&#10;Suporte&#10;Financeiro"
              />
            </div>
          </>
        )}

        {node.type === 'condition' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Variável a verificar</Label>
              <Input value={data.variable || ''} onChange={e => update('variable', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="{{variavel}}" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Operador</Label>
              <Select value={data.operator || 'equals'} onValueChange={v => update('operator', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="starts_with">Começa com</SelectItem>
                  <SelectItem value="gt">Maior que</SelectItem>
                  <SelectItem value="lt">Menor que</SelectItem>
                  <SelectItem value="exists">Existe</SelectItem>
                  <SelectItem value="regex">Regex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Valor</Label>
              <Input value={data.conditionValue || ''} onChange={e => update('conditionValue', e.target.value)} className="h-8 text-sm bg-muted/50" />
            </div>
          </>
        )}

        {node.type === 'delay' && (
          <div className="space-y-2">
            <Label className="text-xs">Duração</Label>
            <div className="flex gap-2">
              <Input type="number" value={data.delayValue || ''} onChange={e => update('delayValue', e.target.value)} className="h-8 text-sm bg-muted/50 w-20" placeholder="5" />
              <Select value={data.delayUnit || 'minutes'} onValueChange={v => update('delayUnit', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Segundos</SelectItem>
                  <SelectItem value="minutes">Minutos</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                  <SelectItem value="days">Dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {node.type === 'ai' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Prompt do sistema</Label>
              <Textarea value={data.content || ''} onChange={e => update('content', e.target.value)} className="text-sm bg-muted/50 min-h-[80px]" placeholder="Você é um assistente de vendas..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Modelo</Label>
              <Select value={data.model || 'gpt-5-mini'} onValueChange={v => update('model', v)}>
                <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                  <SelectItem value="gpt-5">GPT-5</SelectItem>
                  <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Usar contexto da conversa</Label>
              <Switch checked={data.useContext ?? true} onCheckedChange={v => update('useContext', v)} />
            </div>
          </>
        )}

        {node.type === 'transfer' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Departamento</Label>
              <Input value={data.department || ''} onChange={e => update('department', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="Ex: Vendas" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Mensagem de transferência</Label>
              <Textarea value={data.transferMessage || ''} onChange={e => update('transferMessage', e.target.value)} className="text-sm bg-muted/50 min-h-[60px]" placeholder="Vou transferir você..." />
            </div>
          </>
        )}

        {(node.type === 'webhook' || node.type === 'http') && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">URL</Label>
              <Input value={data.url || ''} onChange={e => update('url', e.target.value)} className="h-8 text-sm bg-muted/50 font-mono" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Método</Label>
              <Select value={data.method || 'POST'} onValueChange={v => update('method', v)}>
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
            <div className="space-y-2">
              <Label className="text-xs">Headers (JSON)</Label>
              <Textarea value={data.headers || ''} onChange={e => update('headers', e.target.value)} className="text-sm bg-muted/50 font-mono min-h-[60px]" placeholder='{"Authorization": "Bearer ..."}' />
            </div>
          </>
        )}

        {node.type === 'start' && (
          <div className="space-y-2">
            <Label className="text-xs">Tipo de gatilho</Label>
            <Select value={data.triggerType || 'message_received'} onValueChange={v => update('triggerType', v)}>
              <SelectTrigger className="h-8 text-sm bg-muted/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="message_received">Mensagem recebida</SelectItem>
                <SelectItem value="keyword">Palavra-chave</SelectItem>
                <SelectItem value="webhook">Webhook externo</SelectItem>
                <SelectItem value="schedule">Agendamento</SelectItem>
                <SelectItem value="new_contact">Novo contato</SelectItem>
              </SelectContent>
            </Select>
            {data.triggerType === 'keyword' && (
              <div className="space-y-2 mt-2">
                <Label className="text-xs">Palavra-chave</Label>
                <Input value={data.keyword || ''} onChange={e => update('keyword', e.target.value)} className="h-8 text-sm bg-muted/50" placeholder="Ex: oi, olá, menu" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/50">
        <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(node.id)}>
          Excluir bloco
        </Button>
      </div>
    </div>
  );
}
