import { useMemo } from "react";
import { PaymentsTable } from "../components/PaymentsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { usePayments } from "../context/PaymentsContext";
import { PaymentTransformerService } from "../../domain/services/PaymentTransformerService";
import { Alert, AlertDescription } from "@/core/presentation/components/ui/alert";
import { AlertCircle, DollarSign } from "lucide-react";

const Payments = () => {
  const { payments, isLoading, error } = usePayments();

  // Filtra pagamentos por categoria
  const todayPayments = useMemo(() => 
    PaymentTransformerService.filterToday(payments),
    [payments]
  );

  const allPayments = useMemo(() => payments, [payments]);

  const completedPayments = useMemo(() => 
    PaymentTransformerService.filterCompleted(payments),
    [payments]
  );

  const contestedPayments = useMemo(() => 
    PaymentTransformerService.filterContested(payments),
    [payments]
  );

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 space-y-4">
        <div className="flex items-center gap-4">
          <DollarSign className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Pagamentos</h1>
            <p className="text-muted-foreground">
              Gerencie os pagamentos aos artistas
            </p>
          </div>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar pagamentos: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <DollarSign className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Pagamentos</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie os pagamentos aos artistas (prazo de 72h após finalização do evento)
        </p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-yellow-600">{todayPayments.length}</div>
          <div className="text-sm text-muted-foreground">Para Hoje</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold">{allPayments.length}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-green-600">{completedPayments.length}</div>
          <div className="text-sm text-muted-foreground">Concluídos</div>
        </div>
        <div className="bg-card rounded-lg p-4 border">
          <div className="text-2xl font-bold text-orange-600">{contestedPayments.length}</div>
          <div className="text-sm text-muted-foreground">Em Contestação</div>
        </div>
      </div>

      <Tabs defaultValue="today">
        <TabsList className="mb-4">
          <TabsTrigger value="today">Hoje ({todayPayments.length})</TabsTrigger>
          <TabsTrigger value="all">Todos ({allPayments.length})</TabsTrigger>
          <TabsTrigger value="completed">Concluídos ({completedPayments.length})</TabsTrigger>
          <TabsTrigger value="contested">Em Contestação ({contestedPayments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today">
          <PaymentsTable
            payments={todayPayments}
            title="Pagamentos para Hoje"
            emptyMessage="Nenhum pagamento programado para hoje"
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="all">
          <PaymentsTable
            payments={allPayments}
            title="Todos os Pagamentos"
            emptyMessage="Nenhum pagamento encontrado"
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <PaymentsTable
            payments={completedPayments}
            title="Pagamentos Concluídos"
            emptyMessage="Nenhum pagamento concluído encontrado"
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="contested">
          <PaymentsTable
            payments={contestedPayments}
            title="Pagamentos em Contestação"
            emptyMessage="Nenhum pagamento em contestação"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;

