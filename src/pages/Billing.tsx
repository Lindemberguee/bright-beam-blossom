import { Button } from '@/components/ui/button';
import { CreditCard, Check, Zap, ArrowUpRight, Download, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  { name: 'Starter', price: 'R$ 197', period: '/mês', features: ['3 usuários', '2 conexões WhatsApp', '1.000 contatos', '5 fluxos', '1.000 disparos/mês', 'Suporte por email'], current: false },
  { name: 'Professional', price: 'R$ 497', period: '/mês', features: ['10 usuários', '5 conexões WhatsApp', '10.000 contatos', 'Fluxos ilimitados', '10.000 disparos/mês', 'Suporte prioritário', 'API completa', 'Webhooks'], current: true },
  { name: 'Enterprise', price: 'R$ 997', period: '/mês', features: ['Usuários ilimitados', 'Conexões ilimitadas', 'Contatos ilimitados', 'Fluxos ilimitados', 'Disparos ilimitados', 'Suporte dedicado', 'SLA garantido', 'White-label', 'Multi-tenant'], current: false },
];

const invoices = [
  { date: '01/03/2024', value: 'R$ 497,00', status: 'Pago', method: 'Cartão ****4532' },
  { date: '01/02/2024', value: 'R$ 497,00', status: 'Pago', method: 'Cartão ****4532' },
  { date: '01/01/2024', value: 'R$ 497,00', status: 'Pago', method: 'Cartão ****4532' },
];

export default function Billing() {
  return (
    <div className="p-6 max-w-5xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground">Assinatura</h1>
        <p className="text-sm text-muted-foreground">Gerencie seu plano, consumo e faturamento</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-xl p-6 border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Plano Professional</h3>
              <p className="text-xs text-muted-foreground">Renovação em 01/04/2024</p>
            </div>
          </div>
          <span className="text-2xl font-bold gradient-text">R$ 497<span className="text-sm text-muted-foreground font-normal">/mês</span></span>
        </div>

        {/* Usage */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Usuários', used: 4, total: 10 },
            { label: 'Conexões', used: 3, total: 5 },
            { label: 'Contatos', used: 2450, total: 10000 },
            { label: 'Disparos', used: 5740, total: 10000 },
          ].map((u) => (
            <div key={u.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{u.label}</span>
                <span className="text-xs font-medium text-foreground">{u.used.toLocaleString()}/{u.total.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(u.used / u.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="font-semibold text-foreground mb-4">Planos disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className={cn("glass-card rounded-xl p-5 transition-all", plan.current ? 'border-primary/50 glow-primary' : 'hover:border-primary/20')}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                {plan.current && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Atual</span>}
              </div>
              <div className="mb-4">
                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-success shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.current ? 'secondary' : 'default'} className="w-full" disabled={plan.current}>
                {plan.current ? 'Plano atual' : 'Fazer upgrade'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Histórico de Faturas</h3>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Exportar</Button>
        </div>
        <div className="space-y-2">
          {invoices.map((inv, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-foreground">{inv.date}</p>
                  <p className="text-xs text-muted-foreground">{inv.method}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{inv.value}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
