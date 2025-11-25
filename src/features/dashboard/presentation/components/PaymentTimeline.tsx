import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/core/presentation/components/ui/badge";

interface PaymentTimelineItem {
  id: string;
  artistName: string;
  clientName: string;
  value: number;
  deadline: Date;
  hoursRemaining: number;
  status: string;
}

interface PaymentTimelineProps {
  payments: PaymentTimelineItem[];
}

export const PaymentTimeline = ({ payments }: PaymentTimelineProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (hoursRemaining: number, status: string) => {
    if (status === "PAID") {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Pago</Badge>;
    }
    if (hoursRemaining < 0) {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Atrasado</Badge>;
    }
    if (hoursRemaining <= 24) {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Urgente</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Pendente</Badge>;
  };

  const getStatusIcon = (hoursRemaining: number, status: string) => {
    if (status === "PAID") {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
    if (hoursRemaining < 0) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
    if (hoursRemaining <= 24) {
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
    return <Clock className="h-4 w-4 text-blue-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timeline de Pagamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.slice(0, 5).map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {getStatusIcon(payment.hoursRemaining, payment.status)}
                <div className="flex-1">
                  <div className="font-medium">{payment.artistName} → {payment.clientName}</div>
                  <div className="text-sm text-muted-foreground">
                    Vencimento: {formatDate(payment.deadline)}
                  </div>
                  {payment.hoursRemaining >= 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {payment.hoursRemaining.toFixed(0)}h restantes
                    </div>
                  )}
                  {payment.hoursRemaining < 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {(Math.abs(payment.hoursRemaining)).toFixed(0)}h atrasado
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-lg">{formatCurrency(payment.value)}</div>
                </div>
                {getStatusBadge(payment.hoursRemaining, payment.status)}
              </div>
            </div>
          ))}
          {payments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum pagamento pendente no momento
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

