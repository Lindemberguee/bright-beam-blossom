import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Columns3, Users, GitBranch, Webhook,
  UsersRound, Megaphone, Plug, Settings, User, CreditCard, Shield,
  Zap, ChevronDown, Flame,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const mainItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Chats ao Vivo', url: '/chats', icon: MessageSquare },
  { title: 'Kanban', url: '/kanban', icon: Columns3 },
  { title: 'Contatos', url: '/contacts', icon: Users },
  { title: 'Fluxos', url: '/flows', icon: GitBranch },
  { title: 'Campanhas', url: '/campaigns', icon: Megaphone },
];

const integrationItems = [
  { title: 'Conexões', url: '/connections', icon: Plug },
  { title: 'Webhooks', url: '/webhooks', icon: Webhook },
];

const managementItems = [
  { title: 'Equipe', url: '/team', icon: UsersRound },
  { title: 'Configurações', url: '/settings', icon: Settings },
  { title: 'Auditoria', url: '/audit', icon: Shield },
];

const accountItems = [
  { title: 'Meu Perfil', url: '/profile', icon: User },
  { title: 'Assinatura', url: '/billing', icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-3">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <Link
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.url)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive(item.url) ? "text-primary" : "")} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent className="py-2">
        {/* Brand */}
        <div className="px-4 py-3 mb-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Zap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">FlowDesk</h1>
                <p className="text-[10px] text-muted-foreground">Automação Omnichannel</p>
              </div>
            )}
          </div>
        </div>

        {/* Workspace selector */}
        {!collapsed && (
          <div className="px-3 mb-2">
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-accent/50 border border-border/50 text-sm hover:bg-accent transition-colors">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">M</div>
                <span className="text-foreground text-xs font-medium">Minha Empresa</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        )}

        {renderGroup('Principal', mainItems)}
        {renderGroup('Integrações', integrationItems)}
        {renderGroup('Gestão', managementItems)}
        {renderGroup('Conta', accountItems)}
      </SidebarContent>
    </Sidebar>
  );
}
