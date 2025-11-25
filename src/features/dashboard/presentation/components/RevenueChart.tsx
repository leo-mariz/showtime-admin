import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { RevenueDataPoint } from "../../domain/entities/DashboardMetricsEntity";
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Receita Mensal
          </CardTitle>
          <span className="text-sm text-muted-foreground">Últimos 6 meses</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((point, index) => {
            const percentage = (point.revenue / maxRevenue) * 100;
            const isLast = index === data.length - 1;
            
            return (
              <div key={point.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={isLast ? "font-semibold" : "text-muted-foreground"}>
                    {point.month}
                  </span>
                  <span className={isLast ? "font-bold text-green-600" : "font-medium"}>
                    {formatCurrency(point.revenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isLast ? "bg-green-600" : "bg-blue-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
