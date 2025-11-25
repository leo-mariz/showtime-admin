import { Alert } from "../../domain/entities/DashboardMetricsEntity";
import { Alert as AlertUI, AlertDescription, AlertTitle } from "@/core/presentation/components/ui/alert";
import { Button } from "@/core/presentation/components/ui/button";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AlertsSectionProps {
  alerts: Alert[];
}

export const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string): "default" | "destructive" => {
    return type === 'error' ? 'destructive' : 'default';
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Alertas & Ações Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {alerts.map((alert) => (
          <AlertUI key={alert.id} variant={getVariant(alert.type)}>
            {getIcon(alert.type)}
            <div className="flex-1">
              <AlertTitle className="flex items-center gap-2">
                {alert.title}
                {alert.count !== undefined && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-background">
                    {alert.count}
                  </span>
                )}
              </AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </div>
            {alert.action && alert.link && (
              <Button
                variant={alert.type === 'error' ? 'default' : 'outline'}
                size="sm"
                onClick={() => navigate(alert.link!)}
                className="ml-auto"
              >
                {alert.action}
              </Button>
            )}
          </AlertUI>
        ))}
      </div>
    </div>
  );
};

