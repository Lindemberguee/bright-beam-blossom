import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsGeneral() {
  const [autoAssign, setAutoAssign] = useState(true);
  const [notifyNewChat, setNotifyNewChat] = useState(true);
  const [notifyMention, setNotifyMention] = useState(true);
  const [inactiveTimeout, setInactiveTimeout] = useState('30');

  const handleSave = () => toast.success('Configurações salvas');

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Configurações Gerais</h1>
          <p className="text-sm text-muted-foreground">Ajustes gerais do workspace</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Atendimento</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Atribuição automática</p>
            <p className="text-xs text-muted-foreground">Distribuir novas conversas automaticamente</p>
          </div>
          <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
        </div>
        <div>
          <Label>Timeout de inatividade (minutos)</Label>
          <Input type="number" value={inactiveTimeout} onChange={(e) => setInactiveTimeout(e.target.value)} className="w-32 mt-1" min="5" />
          <p className="text-xs text-muted-foreground mt-1">Tempo até marcar conversa como inativa</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Nova conversa</p>
            <p className="text-xs text-muted-foreground">Notificar quando um novo chat chegar</p>
          </div>
          <Switch checked={notifyNewChat} onCheckedChange={setNotifyNewChat} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-foreground">Menções</p>
            <p className="text-xs text-muted-foreground">Notificar quando for mencionado</p>
          </div>
          <Switch checked={notifyMention} onCheckedChange={setNotifyMention} />
        </div>
      </div>

      <Button onClick={handleSave}>Salvar Configurações</Button>
    </div>
  );
}
