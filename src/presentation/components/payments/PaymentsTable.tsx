
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/presentation/components/ui/table";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Button } from "@/core/presentation/components/ui/button";
import { 
  Eye, 
  DollarSign, 
  RotateCcw, 
  FileText,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/presentation/components/ui/dropdown-menu";
import { PaymentDetailModal } from "./PaymentDetailModal";

interface Payment {
  id: string;
  eventName: string;
  clientName: string;
  clientEmail: string;
  artistName: string;
  artistEmail: string;
  eventDate: string;
  value: number;
  clientPaymentStatus: "Aguardando pagamento" | "Pago" | "Estornado";
  artistPaymentStatus: "Aguardando apresentação" | "Aguardando liberação" | "Pago";
  presentationStatus: "Agendada" | "Realizada" | "Cancelada";
  invoiceUrl?: string;
  adminNotes: string;
}

interface PaymentsTableProps {
  payments: Payment[];
}

export const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pago":
      case "Realizada":
        return "default";
      case "Aguardando pagamento":
      case "Aguardando apresentação":
      case "Aguardando liberação":
      case "Agendada":
        return "secondary";
      case "Estornado":
      case "Cancelada":
        return "destructive";
      default:
        return "outline";
    }
  };

  const canPayArtist = (payment: Payment) => {
    return payment.presentationStatus === "Realizada" && 
           payment.clientPaymentStatus === "Pago" &&
           payment.artistPaymentStatus !== "Pago";
  };

  const canRefundClient = (payment: Payment) => {
    return payment.presentationStatus !== "Realizada" && 
           payment.clientPaymentStatus === "Pago";
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Artista</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Pagamento Cliente</TableHead>
              <TableHead>Pagamento Artista</TableHead>
              <TableHead>Apresentação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {payment.eventName}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{payment.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.clientEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{payment.artistName}</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.artistEmail}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(payment.eventDate)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(payment.value)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(payment.clientPaymentStatus)}>
                    {payment.clientPaymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(payment.artistPaymentStatus)}>
                    {payment.artistPaymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(payment.presentationStatus)}>
                    {payment.presentationStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      {canPayArtist(payment) && (
                        <DropdownMenuItem>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Pagar artista
                        </DropdownMenuItem>
                      )}
                      {canRefundClient(payment) && (
                        <DropdownMenuItem>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Estornar cliente
                        </DropdownMenuItem>
                      )}
                      {payment.invoiceUrl && (
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Ver nota fiscal
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  );
};
