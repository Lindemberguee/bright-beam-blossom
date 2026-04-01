import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function MetricCard({ label, value, change, changeLabel, icon: Icon, iconColor = 'text-primary', className }: MetricCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5 animate-fade-in group hover:border-primary/30 transition-all duration-300", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", change >= 0 ? "text-success bg-success/10" : "text-destructive bg-destructive/10")}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
            </div>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors", iconColor)}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
