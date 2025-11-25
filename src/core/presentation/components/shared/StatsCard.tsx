
import { cn } from "@/utils/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn("showtime-card flex flex-col", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-showtime-orange bg-opacity-10 p-2 rounded-lg">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span
            className={cn(
              "text-xs font-medium flex items-center",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%{" "}
            <span className="ml-1 text-gray-500">desde o mês passado</span>
          </span>
        </div>
      )}
    </div>
  );
};
