import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { EventMetrics } from "../../domain/entities/DashboardMetricsEntity";
import { Filter } from "lucide-react";

interface ConversionFunnelProps {
  metrics: EventMetrics;
}

export const ConversionFunnel = ({ metrics }: ConversionFunnelProps) => {
  const totalRequested = Object.values(metrics.eventsByStatus).reduce((a, b) => a + b, 0);
  
  const funnelStages = [
    { label: "Solicitados", value: totalRequested, color: "bg-blue-500" },
    { label: "Aceitos", value: metrics.eventsByStatus.accepted + metrics.eventsByStatus.confirmed + metrics.eventsByStatus.finished, color: "bg-green-500" },
    { label: "Confirmados", value: metrics.eventsByStatus.confirmed + metrics.eventsByStatus.finished, color: "bg-purple-500" },
    { label: "Finalizados", value: metrics.eventsByStatus.finished, color: "bg-orange-500" }
  ];

  const maxValue = funnelStages[0].value;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Funil de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {funnelStages.map((stage, index) => {
            const percentage = (stage.value / maxValue) * 100;
            const conversionRate = index > 0 
              ? ((stage.value / funnelStages[index - 1].value) * 100).toFixed(1)
              : 100;

            return (
              <div key={stage.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{stage.value} eventos</span>
                    {index > 0 && (
                      <span className="text-xs font-semibold text-green-600">
                        {conversionRate}%
                      </span>
                    )}
                  </div>
                </div>
                <div 
                  className={`h-12 ${stage.color} rounded-md flex items-center justify-center text-white font-semibold transition-all duration-500`}
                  style={{ width: `${percentage}%`, minWidth: '120px' }}
                >
                  {percentage.toFixed(0)}%
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Conversão Total</span>
              <span className="text-lg font-bold text-green-600">
                {metrics.conversionRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

