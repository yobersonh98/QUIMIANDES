import { cn } from "@/lib/utils";

interface InfoItemProps {
  label: string;
  value: string | number;
  destacado?: boolean;
}

export function InfoItem({ label, value, destacado = false }: InfoItemProps) {
  return (
    <div>
      <div className="text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </div>
      <div className={cn(
        "font-medium",
        destacado 
          ? "text-slate-900 dark:text-white" 
          : "text-slate-700 dark:text-slate-300"
      )}>
        {value}
      </div>
    </div>
  );
}