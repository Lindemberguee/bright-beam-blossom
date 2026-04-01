import { Outlet, useLocation, Link } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Bell, ChevronRight, Command } from 'lucide-react';

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  chats: 'Chats ao Vivo',
  kanban: 'Kanban',
  contacts: 'Contatos',
  flows: 'Fluxos',
  webhooks: 'Webhooks',
  team: 'Equipe',
  campaigns: 'Campanhas',
  connections: 'Conexões',
  settings: 'Configurações',
  profile: 'Perfil',
  billing: 'Assinatura',
  audit: 'Auditoria',
  editor: 'Editor',
};

export function AppLayout() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 flex items-center justify-between border-b border-border/50 px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center gap-1.5 text-sm">
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                {segments.map((seg, i) => (
                  <span key={seg} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                    <span className={i === segments.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      {breadcrumbLabels[seg] || seg}
                    </span>
                  </span>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden lg:flex items-center relative">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar..." className="pl-9 pr-20 w-64 h-9 bg-muted/50 border-border/50 text-sm" />
                <kbd className="absolute right-3 flex items-center gap-0.5 text-[10px] text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5">
                  <Command className="h-2.5 w-2.5" /> K
                </kbd>
              </div>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">3</span>
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
                CM
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
