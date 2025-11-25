import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { UserCircle2, Users, CalendarCheck, Repeat, CheckCircle2 } from "lucide-react";

interface ClientsSectionProps {
  total: number;
  active: number;
  withEvents: number;
  recurrent: number;
}

export const ClientsSection = ({
  total,
  active,
  withEvents,
  recurrent
}: ClientsSectionProps) => {
  const conversionRate = total > 0 ? ((withEvents / total) * 100).toFixed(1) : 0;
  const retentionRate = withEvents > 0 ? ((recurrent / withEvents) * 100).toFixed(1) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-blue-600" />
          Anfitriões
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div className="text-sm text-muted-foreground">Total Cadastrados</div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mt-1">{total}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="text-sm text-muted-foreground">Ativos</div>
            </div>
            <div className="text-3xl font-bold text-green-600 mt-1">{active}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((active / total) * 100).toFixed(1)}% do total
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="h-4 w-4 text-purple-600" />
              <div className="text-sm text-muted-foreground">Solicitaram Eventos</div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mt-1">{withEvents}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {conversionRate}% de conversão
            </div>
          </div>
        </div>

        {/* Clientes Recorrentes */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-2">
            <Repeat className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold">Clientes Recorrentes</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold text-orange-600">{recurrent}</div>
            <div className="text-sm text-muted-foreground">
              ({retentionRate}% dos que solicitaram eventos)
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Clientes que fizeram 2+ eventos
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

