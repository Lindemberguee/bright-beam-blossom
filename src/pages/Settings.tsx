import { Link } from 'react-router-dom';
import {
  Tag, Building2, Clock, MessageSquare, Variable, Palette, Globe, Shield,
  Users, Plug, GitBranch, Megaphone, FileText, ChevronRight, Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  {
    title: 'Comunicação',
    items: [
      { icon: Tag, label: 'Etiquetas', description: 'Organize conversas e contatos com tags', url: '/settings/tags' },
      { icon: MessageSquare, label: 'Respostas Rápidas', description: 'Templates de mensagens para agilizar', url: '/settings/quick-replies' },
    ],
  },
  {
    title: 'Operação',
    items: [
      { icon: Building2, label: 'Departamentos', description: 'Organize equipes por área', url: '/settings/departments' },
      { icon: Clock, label: 'Horários de Atendimento', description: 'Configure horários por canal', url: '/settings/business-hours' },
      { icon: Users, label: 'Filas de Atendimento', description: 'Regras de distribuição automática', url: '/settings/queues' },
    ],
  },
  {
    title: 'Personalização',
    items: [
      { icon: Variable, label: 'Variáveis Globais', description: 'Variáveis reutilizáveis em fluxos', url: '/settings/variables' },
      { icon: Palette, label: 'Branding', description: 'Logo, cores e identidade visual', url: '/settings/branding' },
      { icon: Globe, label: 'Idioma e Timezone', description: 'Configurações regionais', url: '/settings/locale' },
    ],
  },
  {
    title: 'Integrações',
    items: [
      { icon: Plug, label: 'Conexões', description: 'Canais de comunicação ativos', url: '/connections' },
      { icon: GitBranch, label: 'Fluxos', description: 'Automações e chatbots', url: '/flows' },
      { icon: Megaphone, label: 'Disparos', description: 'Configuração de campanhas', url: '/campaigns' },
    ],
  },
  {
    title: 'Segurança',
    items: [
      { icon: Shield, label: 'Permissões', description: 'Controle de acesso por papel', url: '/settings/permissions' },
      { icon: SettingsIcon, label: 'Geral', description: 'Configurações gerais do workspace', url: '/settings/general' },
    ],
  },
];

export default function Settings() {
  return (
    <div className="p-6 space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie todos os aspectos do seu workspace</p>
      </div>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{section.title}</h2>
          <div className="space-y-1.5">
            {section.items.map((item) => (
              <Link key={item.label} to={item.url}>
                <div className="glass-card rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
