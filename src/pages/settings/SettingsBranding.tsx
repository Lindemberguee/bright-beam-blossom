import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Palette, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const themeColors = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#10b981', label: 'Verde' },
  { value: '#f59e0b', label: 'Âmbar' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#ec4899', label: 'Rosa' },
];

export default function SettingsBranding() {
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [companyName, setCompanyName] = useState('');

  const handleSave = () => {
    toast.success('Branding atualizado');
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/settings"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Branding</h1>
          <p className="text-sm text-muted-foreground">Personalize a identidade visual do seu workspace</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5">
        <div>
          <Label>Nome da Empresa</Label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Minha Empresa" className="mt-1" />
        </div>

        <div>
          <Label>Logo</Label>
          <div className="mt-2 border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-primary/30 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Clique ou arraste para enviar</p>
            <p className="text-xs text-muted-foreground/60">PNG, SVG — Máx. 2MB</p>
          </div>
        </div>

        <div>
          <Label>Cor Principal</Label>
          <div className="flex gap-3 mt-2">
            {themeColors.map((c) => (
              <button key={c.value} onClick={() => setPrimaryColor(c.value)}
                className={`h-10 w-10 rounded-xl border-2 transition-all ${primaryColor === c.value ? 'border-foreground scale-110 shadow-lg' : 'border-transparent'}`}
                style={{ backgroundColor: c.value }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Prévia</Label>
          <div className="mt-2 rounded-xl p-4 border border-border/50" style={{ backgroundColor: primaryColor + '15' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                <Palette className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold" style={{ color: primaryColor }}>{companyName || 'Minha Empresa'}</span>
            </div>
            <div className="flex gap-2">
              <div className="h-8 px-4 rounded-lg flex items-center text-xs text-white font-medium" style={{ backgroundColor: primaryColor }}>Botão Primário</div>
              <div className="h-8 px-4 rounded-lg flex items-center text-xs font-medium border" style={{ borderColor: primaryColor, color: primaryColor }}>Botão Secundário</div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Salvar Branding</Button>
      </div>
    </div>
  );
}
