
import { useState } from "react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";
import { FilterSelect } from "@/core/presentation/components/shared/FilterSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { PaymentsTable } from "@/presentation/components/payments/PaymentsTable";
import { mockPayments } from "@/utils/mockData";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const pendingPayments = mockPayments.filter(
    (payment) => payment.artistPaymentStatus !== "Pago"
  );

  const completedPayments = mockPayments.filter(
    (payment) => payment.artistPaymentStatus === "Pago"
  );

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = 
      payment.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.artistEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      payment.clientPaymentStatus === statusFilter ||
      payment.artistPaymentStatus === statusFilter ||
      payment.presentationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pagamentos e Notas Fiscais</h1>
          <p className="text-muted-foreground">
            Gerencie pagamentos de eventos e emissão de notas fiscais
          </p>
        </div>
        <div className="flex gap-2">
          <SearchBar
            placeholder="Buscar por evento, cliente ou artista..."
            onSearch={setSearchQuery}
          />
          <FilterSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: "all", label: "Todos os status" },
              { value: "Aguardando pagamento", label: "Aguardando pagamento" },
              { value: "Pago", label: "Pago" },
              { value: "Estornado", label: "Estornado" },
              { value: "Aguardando apresentação", label: "Aguardando apresentação" },
              { value: "Aguardando liberação", label: "Aguardando liberação" },
              { value: "Agendada", label: "Agendada" },
              { value: "Realizada", label: "Realizada" },
              { value: "Cancelada", label: "Cancelada" },
            ]}
          />
        </div>
      </div>

      {searchQuery || statusFilter !== "all" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Resultados da busca ({filteredPayments.length})
          </h2>
          <PaymentsTable payments={filteredPayments} />
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pagamentos Pendentes ({pendingPayments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Pagamentos Finalizados ({completedPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <PaymentsTable payments={pendingPayments} />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <PaymentsTable payments={completedPayments} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Payments;
