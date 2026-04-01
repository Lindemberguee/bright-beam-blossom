import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const timezones = [
  'America/Sao_Paulo', 'America/Fortaleza', 'America/Manaus', 'America/Belem',
  'America/Cuiaba', 'America/Porto_Velho', 'America/Rio_Branco',
  'America/New_York', 'America/Chicago', 'America/Los_Angeles',
  'Europe/London', 'Europe/Lisbon', 'Europe/Madrid',
];

const languages = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
];

export default function SettingsLocale() {
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [language, setLanguage] = useState('pt-BR');
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');

  const handleSave = () => {
    toast.success('Configurações regionais salvas');
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Idioma e Timezone</h1>
          <p className="text-sm text-muted-foreground">Configurações regionais do workspace</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5">
        <div>
          <Label>Idioma</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{languages.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Fuso Horário</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>{timezones.map((tz) => <SelectItem key={tz} value={tz}>{tz.replace('_', ' ')}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Formato de Data</Label>
          <Select value={dateFormat} onValueChange={setDateFormat}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
              <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
              <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSave}>Salvar Configurações</Button>
      </div>
    </div>
  );
}
