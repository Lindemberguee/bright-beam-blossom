import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Shield, Eye, Edit, Trash2, MessageSquare, Users, GitBranch, Megaphone, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const roles = [
  {
    name: 'Owner',
    label: 'Proprietário',
    description: 'Acesso total ao workspace incluindo faturamento e exclusão',
    color: 'text-amber-400',
    permissions: ['Tudo'],
  },
  {
    name: 'Admin',
    label: 'Administrador',
    description: 'Gerencia configurações, equipe e integrações',
    color: 'text-primary',
    permissions: ['Configurações', 'Equipe', 'Integrações', 'Relatórios'],
  },
  {
    name: 'Manager',
    label: 'Gerente',
    description: 'Supervisiona atendimento e visualiza métricas',
    color: 'text-emerald-400',
    permissions: ['Conversas', 'Contatos', 'Relatórios', 'Fluxos (leitura)'],
  },
  {
    name: 'Operator',
    label: 'Operador',
    description: 'Atende conversas e gerencia contatos atribuídos',
    color: 'text-sky-400',
    permissions: ['Conversas (atribuídas)', 'Contatos (leitura)'],
  },
  {
    name: 'Analyst',
    label: 'Analista',
    description: 'Apenas visualização de relatórios e métricas',
    color: 'text-muted-foreground',
    permissions: ['Dashboard (leitura)', 'Relatórios (leitura)'],
  },
];

const modules = [
  { name: 'Chats', icon: MessageSquare },
  { name: 'Contatos', icon: Users },
  { name: 'Fluxos', icon: GitBranch },
  { name: 'Campanhas', icon: Megaphone },
  { name: 'Configurações', icon: Settings },
];

export default function SettingsPermissions() {
  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Permissões</h1>
          <p className="text-sm text-muted-foreground">Controle de acesso por papel dentro do workspace</p>
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-3">
        {roles.map((role) => (
          <div key={role.name} className="glass-card rounded-xl px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className={`h-5 w-5 ${role.color}`} />
                <span className="text-sm font-semibold text-foreground">{role.label}</span>
                <Badge variant="outline" className="text-[10px]">{role.name}</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{role.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {role.permissions.map((p) => (
                <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Matriz de Permissões</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-2 text-muted-foreground font-medium">Módulo</th>
                {roles.map((r) => (
                  <th key={r.name} className="text-center py-2 px-2 text-muted-foreground font-medium">{r.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod.name} className="border-b border-border/20">
                  <td className="py-2.5 px-2 flex items-center gap-2">
                    <mod.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-foreground">{mod.name}</span>
                  </td>
                  <td className="text-center"><PermIcon type="full" /></td>
                  <td className="text-center"><PermIcon type="full" /></td>
                  <td className="text-center"><PermIcon type="edit" /></td>
                  <td className="text-center"><PermIcon type="view" /></td>
                  <td className="text-center"><PermIcon type="none" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PermIcon({ type }: { type: 'full' | 'edit' | 'view' | 'none' }) {
  if (type === 'full') return <span title="Acesso total" className="inline-flex"><Edit className="h-3.5 w-3.5 text-emerald-400" /></span>;
  if (type === 'edit') return <span title="Edição parcial" className="inline-flex"><Edit className="h-3.5 w-3.5 text-amber-400" /></span>;
  if (type === 'view') return <span title="Somente leitura" className="inline-flex"><Eye className="h-3.5 w-3.5 text-sky-400" /></span>;
  return <span title="Sem acesso" className="inline-flex"><Trash2 className="h-3.5 w-3.5 text-muted-foreground/30" /></span>;
}
