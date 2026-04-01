import { Contact, Conversation, Message, Pipeline, Flow, TeamMember, Campaign, Connection, Webhook, AuditLog } from '@/types';

export const mockContacts: Contact[] = [
  { id: '1', name: 'Ana Silva', phone: '+55 11 99876-5432', email: 'ana@empresa.com', company: 'TechCorp', tags: ['VIP', 'Enterprise'], score: 85, status: 'customer', source: 'WhatsApp', assignedTo: 'Carlos Mendes', lastInteraction: '2 min atrás', createdAt: '2024-01-15' },
  { id: '2', name: 'Bruno Costa', phone: '+55 21 98765-4321', email: 'bruno@startup.io', company: 'StartupX', tags: ['Lead Quente'], score: 72, status: 'lead', source: 'Webchat', assignedTo: 'Maria Souza', lastInteraction: '15 min atrás', createdAt: '2024-02-20' },
  { id: '3', name: 'Carla Ferreira', phone: '+55 31 97654-3210', email: 'carla@loja.com', company: 'Loja Online', tags: ['Suporte'], score: 45, status: 'active', source: 'WhatsApp', lastInteraction: '1h atrás', createdAt: '2024-03-10' },
  { id: '4', name: 'Diego Santos', phone: '+55 41 96543-2109', tags: ['Novo'], score: 30, status: 'lead', source: 'Campanha', lastInteraction: '3h atrás', createdAt: '2024-03-25' },
  { id: '5', name: 'Elena Rodrigues', phone: '+55 51 95432-1098', email: 'elena@corp.com', company: 'MegaCorp', tags: ['Enterprise', 'Ativo'], score: 92, status: 'customer', source: 'API', assignedTo: 'Carlos Mendes', lastInteraction: '30 min atrás', createdAt: '2023-11-05' },
  { id: '6', name: 'Fernando Lima', phone: '+55 61 94321-0987', company: 'AgênciaDigital', tags: ['Parceiro'], score: 68, status: 'active', source: 'WhatsApp', lastInteraction: '5h atrás', createdAt: '2024-01-30' },
  { id: '7', name: 'Gabriela Alves', phone: '+55 71 93210-9876', email: 'gabi@email.com', tags: ['Inativo'], score: 15, status: 'inactive', source: 'Webchat', lastInteraction: '7 dias atrás', createdAt: '2023-09-12' },
  { id: '8', name: 'Henrique Martins', phone: '+55 81 92109-8765', company: 'ConsultPro', tags: ['VIP', 'Recorrente'], score: 88, status: 'customer', source: 'WhatsApp', assignedTo: 'Maria Souza', lastInteraction: '10 min atrás', createdAt: '2023-08-20' },
];

export const mockConversations: Conversation[] = [
  { id: '1', contactId: '1', contactName: 'Ana Silva', contactPhone: '+55 11 99876-5432', lastMessage: 'Preciso de ajuda com a integração da API', lastMessageTime: '2 min', unreadCount: 3, status: 'open', channel: 'whatsapp', assignedTo: 'carlos', assignedName: 'Carlos Mendes', department: 'Suporte', tags: ['VIP'], priority: 'high', isPinned: true },
  { id: '2', contactId: '2', contactName: 'Bruno Costa', contactPhone: '+55 21 98765-4321', lastMessage: 'Quero saber mais sobre o plano Enterprise', lastMessageTime: '15 min', unreadCount: 1, status: 'open', channel: 'webchat', assignedTo: 'maria', assignedName: 'Maria Souza', department: 'Comercial', tags: ['Lead Quente'], priority: 'medium' },
  { id: '3', contactId: '3', contactName: 'Carla Ferreira', contactPhone: '+55 31 97654-3210', lastMessage: 'Obrigada pelo suporte! Resolveu meu problema.', lastMessageTime: '1h', unreadCount: 0, status: 'resolved', channel: 'whatsapp', department: 'Suporte', tags: [], priority: 'low' },
  { id: '4', contactId: '5', contactName: 'Elena Rodrigues', contactPhone: '+55 51 95432-1098', lastMessage: 'Quando posso agendar a reunião de onboarding?', lastMessageTime: '30 min', unreadCount: 2, status: 'pending', channel: 'whatsapp', assignedTo: 'carlos', assignedName: 'Carlos Mendes', department: 'CS', tags: ['Enterprise'], priority: 'high' },
  { id: '5', contactId: '8', contactName: 'Henrique Martins', contactPhone: '+55 81 92109-8765', lastMessage: 'Preciso renovar minha assinatura', lastMessageTime: '10 min', unreadCount: 1, status: 'open', channel: 'whatsapp', assignedTo: 'maria', assignedName: 'Maria Souza', department: 'Financeiro', tags: ['VIP'], priority: 'medium' },
  { id: '6', contactId: '4', contactName: 'Diego Santos', contactPhone: '+55 41 96543-2109', lastMessage: 'Vi a campanha de vocês, quero saber mais', lastMessageTime: '3h', unreadCount: 0, status: 'pending', channel: 'whatsapp', tags: ['Novo'], priority: 'low' },
];

export const mockMessages: Message[] = [
  { id: '1', conversationId: '1', content: 'Olá! Preciso de ajuda com a integração da API', type: 'text', sender: 'contact', senderName: 'Ana Silva', timestamp: '14:30', status: 'read' },
  { id: '2', conversationId: '1', content: 'Claro, Ana! Vou te ajudar. Qual endpoint você está tentando utilizar?', type: 'text', sender: 'agent', senderName: 'Carlos Mendes', timestamp: '14:31', status: 'read' },
  { id: '3', conversationId: '1', content: 'Estou tentando usar o endpoint de criação de contatos, mas está retornando erro 422', type: 'text', sender: 'contact', senderName: 'Ana Silva', timestamp: '14:33', status: 'read' },
  { id: '4', conversationId: '1', content: 'Verificando nos logs internos...', type: 'internal_note', sender: 'agent', senderName: 'Carlos Mendes', timestamp: '14:34' },
  { id: '5', conversationId: '1', content: 'Entendi o problema! O campo "phone" precisa incluir o código do país. Vou te enviar a documentação atualizada.', type: 'text', sender: 'agent', senderName: 'Carlos Mendes', timestamp: '14:35', status: 'delivered' },
  { id: '6', conversationId: '1', content: 'Perfeito! Vou ajustar aqui. Obrigada pela ajuda rápida!', type: 'text', sender: 'contact', senderName: 'Ana Silva', timestamp: '14:37', status: 'read' },
];

export const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Vendas B2B',
    columns: [
      { id: 'c1', title: 'Novos Leads', color: 'hsl(210, 80%, 55%)', cards: [
        { id: 'k1', title: 'Proposta TechCorp', contactName: 'Ana Silva', value: 45000, assignedTo: 'Carlos M.', tags: ['Enterprise'], priority: 'high', createdAt: '2024-03-20', dueDate: '2024-04-15' },
        { id: 'k2', title: 'Demo StartupX', contactName: 'Bruno Costa', value: 12000, assignedTo: 'Maria S.', tags: ['Startup'], priority: 'medium', createdAt: '2024-03-22' },
      ]},
      { id: 'c2', title: 'Qualificação', color: 'hsl(38, 90%, 55%)', cards: [
        { id: 'k3', title: 'Análise MegaCorp', contactName: 'Elena Rodrigues', value: 85000, assignedTo: 'Carlos M.', tags: ['Enterprise', 'VIP'], priority: 'high', createdAt: '2024-03-15' },
      ]},
      { id: 'c3', title: 'Proposta Enviada', color: 'hsl(263, 70%, 58%)', cards: [
        { id: 'k4', title: 'Plano Premium ConsultPro', contactName: 'Henrique Martins', value: 28000, assignedTo: 'Maria S.', tags: ['Recorrente'], priority: 'medium', createdAt: '2024-03-18', dueDate: '2024-04-01' },
      ]},
      { id: 'c4', title: 'Negociação', color: 'hsl(280, 80%, 65%)', cards: [] },
      { id: 'c5', title: 'Fechamento', color: 'hsl(142, 60%, 45%)', cards: [
        { id: 'k5', title: 'Renovação AgênciaDigital', contactName: 'Fernando Lima', value: 18000, assignedTo: 'Carlos M.', tags: ['Parceiro'], priority: 'low', createdAt: '2024-03-10' },
      ]},
    ],
  },
];

export const mockFlows: Flow[] = [
  { id: '1', name: 'Boas-vindas WhatsApp', description: 'Fluxo inicial para novos contatos via WhatsApp', status: 'active', nodesCount: 12, executionCount: 3458, successRate: 94.2, updatedAt: '2024-03-25', createdAt: '2024-01-10', folder: 'Onboarding' },
  { id: '2', name: 'Qualificação de Leads', description: 'Coleta dados e qualifica leads automaticamente', status: 'active', nodesCount: 18, executionCount: 1205, successRate: 87.5, updatedAt: '2024-03-24', createdAt: '2024-02-15', folder: 'Vendas' },
  { id: '3', name: 'Suporte Nível 1', description: 'Triagem automática de tickets de suporte', status: 'active', nodesCount: 24, executionCount: 5670, successRate: 91.8, updatedAt: '2024-03-23', createdAt: '2024-01-20', folder: 'Suporte' },
  { id: '4', name: 'Reativação 30 dias', description: 'Reengajamento de contatos inativos', status: 'paused', nodesCount: 8, executionCount: 890, successRate: 45.3, updatedAt: '2024-03-20', createdAt: '2024-03-01', folder: 'Marketing' },
  { id: '5', name: 'Pesquisa NPS', description: 'Coleta Net Promoter Score pós-atendimento', status: 'draft', nodesCount: 6, executionCount: 0, successRate: 0, updatedAt: '2024-03-26', createdAt: '2024-03-26' },
  { id: '6', name: 'Agendamento Reunião', description: 'Bot para agendamento automático', status: 'active', nodesCount: 15, executionCount: 2340, successRate: 89.1, updatedAt: '2024-03-22', createdAt: '2024-02-01', folder: 'Vendas' },
];

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Carlos Mendes', email: 'carlos@empresa.com', role: 'admin', status: 'online', department: 'Suporte', activeChats: 5, resolvedToday: 12, avgResponseTime: '2m 30s' },
  { id: '2', name: 'Maria Souza', email: 'maria@empresa.com', role: 'operator', status: 'online', department: 'Comercial', activeChats: 3, resolvedToday: 8, avgResponseTime: '1m 45s' },
  { id: '3', name: 'João Oliveira', email: 'joao@empresa.com', role: 'operator', status: 'away', department: 'Suporte', activeChats: 0, resolvedToday: 15, avgResponseTime: '3m 10s' },
  { id: '4', name: 'Luciana Pereira', email: 'luciana@empresa.com', role: 'manager', status: 'online', department: 'CS', activeChats: 2, resolvedToday: 6, avgResponseTime: '4m 20s' },
  { id: '5', name: 'Rafael Nunes', email: 'rafael@empresa.com', role: 'analyst', status: 'offline', department: 'Marketing', activeChats: 0, resolvedToday: 0, avgResponseTime: '-' },
];

export const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Black Friday 2024', status: 'completed', type: 'mass', targetCount: 5000, sentCount: 4850, deliveredCount: 4720, responseCount: 1230, failedCount: 130, completedAt: '2024-03-20', createdAt: '2024-03-18' },
  { id: '2', name: 'Reativação Q1', status: 'running', type: 'reactivation', targetCount: 1200, sentCount: 890, deliveredCount: 856, responseCount: 234, failedCount: 34, createdAt: '2024-03-25' },
  { id: '3', name: 'Lançamento Premium', status: 'scheduled', type: 'segmented', targetCount: 3500, sentCount: 0, deliveredCount: 0, responseCount: 0, failedCount: 0, scheduledAt: '2024-04-01', createdAt: '2024-03-26' },
  { id: '4', name: 'Pesquisa de Satisfação', status: 'draft', type: 'segmented', targetCount: 800, sentCount: 0, deliveredCount: 0, responseCount: 0, failedCount: 0, createdAt: '2024-03-24' },
];

export const mockConnections: Connection[] = [
  { id: '1', name: 'WhatsApp Principal', type: 'whatsapp', status: 'connected', phone: '+55 11 99999-0001', lastSync: '1 min atrás', assignedFlow: 'Boas-vindas WhatsApp', queue: 'Suporte' },
  { id: '2', name: 'WhatsApp Comercial', type: 'whatsapp', status: 'connected', phone: '+55 11 99999-0002', lastSync: '3 min atrás', assignedFlow: 'Qualificação de Leads', queue: 'Comercial' },
  { id: '3', name: 'Webchat Site', type: 'webchat', status: 'connected', lastSync: '5 min atrás', assignedFlow: 'Boas-vindas WhatsApp' },
  { id: '4', name: 'API Integração', type: 'api', status: 'disconnected', lastSync: '2h atrás' },
];

export const mockWebhooks: Webhook[] = [
  { id: '1', name: 'Receber Lead RD Station', url: '/api/webhooks/rd-station', method: 'POST', status: 'active', lastCalled: '5 min atrás', callCount: 1230, errorCount: 12, createdAt: '2024-01-15' },
  { id: '2', name: 'Atualizar CRM Externo', url: '/api/webhooks/crm-sync', method: 'POST', status: 'active', lastCalled: '15 min atrás', callCount: 890, errorCount: 3, createdAt: '2024-02-20' },
  { id: '3', name: 'Notificar Slack', url: '/api/webhooks/slack-notify', method: 'POST', status: 'inactive', lastCalled: '2 dias atrás', callCount: 456, errorCount: 45, createdAt: '2024-03-01' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: '1', action: 'Login realizado', module: 'Auth', user: 'Carlos Mendes', details: 'Login via email', timestamp: '2024-03-26 14:30:00', ip: '192.168.1.100' },
  { id: '2', action: 'Contato criado', module: 'CRM', user: 'Maria Souza', details: 'Novo contato: Ana Silva', timestamp: '2024-03-26 14:25:00' },
  { id: '3', action: 'Fluxo publicado', module: 'Automação', user: 'Carlos Mendes', details: 'Fluxo "Boas-vindas WhatsApp" ativado', timestamp: '2024-03-26 14:20:00' },
  { id: '4', action: 'Campanha criada', module: 'Marketing', user: 'Rafael Nunes', details: 'Campanha "Lançamento Premium"', timestamp: '2024-03-26 14:15:00' },
  { id: '5', action: 'Permissão alterada', module: 'Equipe', user: 'Admin', details: 'João Oliveira → operador', timestamp: '2024-03-26 14:10:00' },
  { id: '6', action: 'Webhook criado', module: 'Integrações', user: 'Carlos Mendes', details: 'Endpoint RD Station configurado', timestamp: '2024-03-26 14:05:00' },
  { id: '7', action: 'Conexão restaurada', module: 'Canais', user: 'Sistema', details: 'WhatsApp Principal reconectado', timestamp: '2024-03-26 14:00:00' },
];

export const dashboardStats = {
  totalChatsToday: 247,
  openChats: 34,
  pendingChats: 12,
  inProgressChats: 18,
  resolvedChats: 183,
  newLeads: 45,
  responseRate: 96.4,
  avgFirstResponse: '1m 23s',
  avgResolution: '8m 45s',
  conversionRate: 23.5,
  activeFlows: 4,
  activeConnections: 3,
  onlineUsers: 4,
  campaignsSent: 2,
  deliveryRate: 97.3,
  failureRate: 2.7,
};
