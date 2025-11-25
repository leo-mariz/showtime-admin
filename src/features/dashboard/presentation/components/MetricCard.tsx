import { Card, CardContent } from "@/core/presentation/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBgColor?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100"
}: MetricCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  vs. mês anterior
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

