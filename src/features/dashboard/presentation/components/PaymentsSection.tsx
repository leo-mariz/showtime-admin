import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { CreditCard, AlertTriangle, HelpCircle, Clock, CheckCircle2, DollarSign } from "lucide-react";

interface PaymentsSectionProps {
  overdue: number;
  contested: number;
  dueToday: number;
  pending: number;
  paid: number;
  overdueAmount: number;
  pendingAmount: number;
}

export const PaymentsSection = ({
  overdue,
  contested,
  dueToday,
  pending,
  paid,
  overdueAmount,
  pendingAmount
}: PaymentsSectionProps) => {
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
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Pagamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="text-sm text-muted-foreground">Atrasados</div>
            </div>
            <div className="text-2xl font-bold text-red-600">{overdue}</div>
            <div className="text-xs text-red-600 font-medium mt-1">
              {formatCurrency(overdueAmount)}
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-orange-600" />
              <div className="text-sm text-muted-foreground">Em Contestação</div>
            </div>
            <div className="text-2xl font-bold text-orange-600">{contested}</div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div className="text-sm text-muted-foreground">Hoje</div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{dueToday}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{pending}</div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              {formatCurrency(pendingAmount)}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="text-sm text-muted-foreground">Pagos</div>
            </div>
            <div className="text-2xl font-bold text-green-600">{paid}</div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total em Pendência
            </span>
            <span className="text-lg font-bold text-blue-600">
              {formatCurrency(pendingAmount)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total Atrasado
            </span>
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(overdueAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

