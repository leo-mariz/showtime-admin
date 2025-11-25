
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Button } from "@/core/presentation/components/ui/button";
import { Separator } from "@/core/presentation/components/ui/separator";
import { Calendar, User, Mail, DollarSign, FileText } from "lucide-react";

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

interface PaymentDetailModalProps {
  payment: Payment;
  open: boolean;
  onClose: () => void;
}

export const PaymentDetailModal = ({ payment, open, onClose }: PaymentDetailModalProps) => {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes do Pagamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Evento */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Informações do Evento</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Evento:</span>
                </div>
                <p>{payment.eventName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Data:</span>
                </div>
                <p>{formatDate(payment.eventDate)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Valor:</span>
                </div>
                <p className="text-lg font-semibold">{formatCurrency(payment.value)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do Cliente */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nome:</span>
                </div>
                <p>{payment.clientName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">E-mail:</span>
                </div>
                <p>{payment.clientEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações do Artista */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Artista</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Nome:</span>
                </div>
                <p>{payment.artistName}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">E-mail:</span>
                </div>
                <p>{payment.artistEmail}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status dos Pagamentos */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Status</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <span className="font-medium">Pagamento Cliente:</span>
                <div>
                  <Badge variant={getStatusBadgeVariant(payment.clientPaymentStatus)}>
                    {payment.clientPaymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <span className="font-medium">Pagamento Artista:</span>
                <div>
                  <Badge variant={getStatusBadgeVariant(payment.artistPaymentStatus)}>
                    {payment.artistPaymentStatus}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <span className="font-medium">Apresentação:</span>
                <div>
                  <Badge variant={getStatusBadgeVariant(payment.presentationStatus)}>
                    {payment.presentationStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Observações Administrativas */}
          {payment.adminNotes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Observações Administrativas</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {payment.adminNotes}
                </p>
              </div>
            </>
          )}

          {/* Nota Fiscal */}
          {payment.invoiceUrl && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">Nota Fiscal</h3>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Visualizar Nota Fiscal
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
