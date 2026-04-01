import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Shield, Key, Globe, Bell, Laptop, LogOut } from 'lucide-react';

export default function Profile() {
  return (
    <div className="p-6 max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
      </div>

      {/* Avatar */}
      <div className="glass-card rounded-xl p-6 flex items-center gap-5">
        <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">CM</div>
        <div>
          <h3 className="font-semibold text-foreground">Carlos Mendes</h3>
          <p className="text-sm text-muted-foreground">carlos@empresa.com</p>
          <p className="text-xs text-primary mt-1">Administrador</p>
          <Button variant="outline" size="sm" className="mt-2">Alterar foto</Button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Dados Pessoais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Nome completo</Label>
            <Input defaultValue="Carlos Mendes" className="bg-muted/50 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Email</Label>
            <Input defaultValue="carlos@empresa.com" className="bg-muted/50 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Telefone</Label>
            <Input defaultValue="+55 11 99999-0000" className="bg-muted/50 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Cargo</Label>
            <Input defaultValue="CTO" className="bg-muted/50 border-border/50" />
          </div>
        </div>
        <Button>Salvar alterações</Button>
      </div>

      {/* Security */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Segurança</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Alterar senha</p>
              <p className="text-xs text-muted-foreground">Última alteração há 30 dias</p>
            </div>
            <Button variant="outline" size="sm">Alterar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Autenticação 2FA</p>
              <p className="text-xs text-muted-foreground">Não configurado</p>
            </div>
            <Button variant="outline" size="sm">Configurar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sessões ativas</p>
              <p className="text-xs text-muted-foreground">2 dispositivos conectados</p>
            </div>
            <Button variant="outline" size="sm">Gerenciar</Button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Preferências</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Idioma</Label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground">
              <option>Português (BR)</option>
              <option>English</option>
              <option>Español</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground">Timezone</Label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground">
              <option>America/Sao_Paulo (GMT-3)</option>
              <option>America/New_York (GMT-5)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
