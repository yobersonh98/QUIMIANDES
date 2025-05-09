import { cn } from "@/lib/utils";

interface InfoItemProps {
  label: string;
  value: string | number;
  destacado?: boolean;
  className?:string
}

export function InfoItem({ label, value, destacado = false, className }: InfoItemProps) {
  return (
    <div className={cn(
      "flex flex-col gap-1",className)}>
      <div className="text-sm capitalize font-medium text-muted-foreground">
        {label}
      </div>
      <div className={cn(
        "font-medium",
        destacado 
          ? "font-bold" 
          : ""
      )}>
        {value}
      </div>
    </div>
  );
}