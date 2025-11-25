import { useMemo, useState } from "react";
import { PaymentEntity } from "../../domain/entities/PaymentEntity";
import { Button } from "@/core/presentation/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/presentation/components/ui/table";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Loader2, DollarSign, AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";

interface PaymentsTableProps {
  payments: PaymentEntity[];
  title: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export const PaymentsTable = ({
  payments,
  title,
  emptyMessage = "Nenhum pagamento encontrado",
  isLoading = false,
}: PaymentsTableProps) => {
  const [search, setSearch] = useState("");

  // Função utilitária para normalizar strings
  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "");

  // Filtragem dos pagamentos
  const filteredPayments = useMemo(() => {
    if (!search.trim()) return payments;
    const s = normalize(search);
    return payments.filter((payment) => {
      const artistName = normalize(payment.artistName);
      const clientName = normalize(payment.clientName);
      const eventId = normalize(payment.eventUid);
      const status = normalize(payment.status);

      return (
        artistName.includes(s) ||
        clientName.includes(s) ||
        eventId.includes(s) ||
        status.includes(s)
      );
    });
  }, [payments, search]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", icon: Clock },
      PAID: { label: "Pago", className: "bg-green-100 text-green-800 hover:bg-green-100", icon: CheckCircle },
      CONTESTED: { label: "Em Contestação", className: "bg-orange-100 text-orange-800 hover:bg-orange-100", icon: AlertTriangle },
      OVERDUE: { label: "Atrasado", className: "bg-red-100 text-red-800 hover:bg-red-100", icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDeadline = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getUrgencyColor = (hoursRemaining: number) => {
    if (hoursRemaining < 0) return "text-red-600 font-bold";
    if (hoursRemaining < 24) return "text-orange-600 font-semibold";
    if (hoursRemaining < 48) return "text-yellow-600";
    return "text-gray-600";
  };

  const handleMakePayment = (payment: PaymentEntity) => {
    // TODO: Implementar lógica de pagamento
    console.log("Realizar pagamento:", payment);
  };

  const handleContest = (payment: PaymentEntity) => {
    // TODO: Implementar lógica de contestação
    console.log("Contestar pagamento:", payment);
  };

  const handleViewInvoice = (payment: PaymentEntity) => {
    // TODO: Implementar visualização de nota fiscal
    console.log("Ver nota fiscal:", payment);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Buscar por artista, cliente ou evento..."
          onSearch={setSearch}
          className="w-full sm:w-96"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando pagamentos...</span>
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                <TableHead>Artista</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Valor a Repassar (80%)</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.eventUid} className="hover:bg-muted/50 text-sm">
                  <TableCell className="py-2 px-2 font-medium">
                    {payment.artistName}
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    {payment.clientName}
                  </TableCell>
                  <TableCell className="py-2 px-2 font-mono text-xs">
                    {payment.eventUid.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="py-2 px-2 font-semibold">
                    {formatCurrency(payment.valuePaid)}
                  </TableCell>
                  <TableCell className="py-2 px-2 font-semibold text-green-600">
                    {formatCurrency(payment.valueToTransfer)}
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {formatDeadline(payment.paymentDeadline)}
                      </span>
                      <span className={`text-xs ${getUrgencyColor(payment.hoursRemaining)}`}>
                        {payment.hoursRemaining < 0 
                          ? `Atrasado ${Math.abs(payment.hoursRemaining)}h`
                          : `${payment.hoursRemaining}h restantes`
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 px-2">
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="text-right py-2 px-2">
                    <div className="flex gap-2 justify-end">
                      {(payment.status === "PENDING" || payment.status === "OVERDUE") && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleMakePayment(payment)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <DollarSign className="h-4 w-4 mr-1" />
                            Pagar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContest(payment)}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Contestar
                          </Button>
                        </>
                      )}
                      {payment.status === "PAID" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(payment)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Nota Fiscal
                        </Button>
                      )}
                      {payment.status === "CONTESTED" && (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Aguardando resolução
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

