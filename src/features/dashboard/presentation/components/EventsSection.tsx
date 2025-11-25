import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { Calendar, Clock, CheckCircle, FileQuestion } from "lucide-react";

interface EventsSectionProps {
  total: number;
  upcoming: number;
  finished: number;
  requests: number;
  eventsByStatus: {
    pending: number;
    accepted: number;
    confirmed: number;
    finished: number;
    cancelled: number;
  };
}

export const EventsSection = ({
  total,
  upcoming,
  finished,
  requests,
  eventsByStatus
}: EventsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Eventos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{total}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-green-600" />
              <div className="text-sm text-muted-foreground">Próximos</div>
            </div>
            <div className="text-2xl font-bold text-green-600 mt-1">{upcoming}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-gray-600" />
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </div>
            <div className="text-2xl font-bold text-gray-600 mt-1">{finished}</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <FileQuestion className="h-4 w-4 text-orange-600" />
              <div className="text-sm text-muted-foreground">Solicitações</div>
            </div>
            <div className="text-2xl font-bold text-orange-600 mt-1">{requests}</div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm mb-3">Distribuição por Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
              <div className="text-lg font-bold text-yellow-600">{eventsByStatus.pending}</div>
              <div className="text-xs text-muted-foreground">Pendente</div>
            </div>
            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
              <div className="text-lg font-bold text-blue-600">{eventsByStatus.accepted}</div>
              <div className="text-xs text-muted-foreground">Aceito</div>
            </div>
            <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
              <div className="text-lg font-bold text-purple-600">{eventsByStatus.confirmed}</div>
              <div className="text-xs text-muted-foreground">Confirmado</div>
            </div>
            <div className="text-center p-2 bg-gray-50 dark:bg-gray-950/20 rounded">
              <div className="text-lg font-bold text-gray-600">{eventsByStatus.finished}</div>
              <div className="text-xs text-muted-foreground">Finalizado</div>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <div className="text-lg font-bold text-red-600">{eventsByStatus.cancelled}</div>
              <div className="text-xs text-muted-foreground">Cancelado</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

