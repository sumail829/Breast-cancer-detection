import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  className?: string;
  footer?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  footer,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {icon && <div className="h-9 w-9 rounded bg-primary/10 p-2 text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-2 line-clamp-1 text-xs">
            {description}
          </CardDescription>
        )}
        {trend && (
          <p className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                "mr-1 rounded-full px-1",
                trend.positive
                  ? "bg-green-500/20 text-green-700"
                  : "bg-red-500/20 text-red-700"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}%
            </span>
            {trend.label}
          </p>
        )}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}