import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/presentation/components/ui/card";
import { EventEntity } from "../../domain/entities/EventEntity";
import { useEvents } from "../context/EventsContext";
import { Calendar, Clock, MapPin, User, Users, DollarSign, CreditCard, ExternalLink } from "lucide-react";
import { Button } from "@/core/presentation/components/ui/button";

interface EventModalProps {
  eventUid: string | null;
  open: boolean;
  onClose: () => void;
}

export const EventModal = ({ eventUid, open, onClose }: EventModalProps) => {
  const { events } = useEvents();
  const event = events.find(e => e.uid === eventUid);

  if (!event) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Evento não encontrado</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      weekday: "long"
    }).format(date);
  };

  const formatDuration = (hours: number) => {
    if (!hours) return "-";
    if (hours === 1) return "1 hora";
    return `${hours} horas`;
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getEventStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      ACCEPTED: { label: "Aceito", className: "bg-green-100 text-green-800" },
      REFUSED: { label: "Recusado", className: "bg-red-100 text-red-800" },
      CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-800" },
      IN_PROGRESS: { label: "Em Andamento", className: "bg-purple-100 text-purple-800" },
      FINISHED: { label: "Finalizado", className: "bg-gray-100 text-gray-800" },
      CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge variant="outline" className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800" },
      PAID: { label: "Pago", className: "bg-green-100 text-green-800" },
      REFUNDED: { label: "Reembolsado", className: "bg-orange-100 text-orange-800" },
      CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge variant="outline" className={`${config.className} hover:${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const formatAddress = (address: any) => {
    if (!address) return "Endereço não informado";
    
    const parts = [];
    if (address.logradouro) parts.push(address.logradouro);
    if (address.number) parts.push(address.number);
    if (address.bairro) parts.push(address.bairro);
    if (address.localidade) parts.push(address.localidade);
    if (address.uf) parts.push(address.uf);
    if (address.cep) parts.push(`CEP: ${address.cep}`);
    
    return parts.length > 0 ? parts.join(", ") : "Endereço não informado";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes do Evento</DialogTitle>
            <div className="flex gap-2">
              {getEventStatusBadge(event.status)}
              {getPaymentStatusBadge(event.statusPayment)}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data</label>
                <p className="font-medium">{formatDate(event.date)}</p>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Horário</label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <p className="font-medium">{event.time}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Duração</label>
                  <p className="font-medium">{formatDuration(event.duration)}</p>
                </div>
              </div>

              {event.eventType && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Evento</label>
                  <p className="font-medium">{event.eventType.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participantes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Artista</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <p className="font-medium">{event.nameArtist || "Não informado"}</p>
                </div>
                {/* {event.refArtist && (
                  <p className="text-xs text-muted-foreground">ID: {event.refArtist}</p>
                )} */}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Contratante</label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <p className="font-medium">{event.nameContractor || "Não informado"}</p>
                </div>
                {/* {event.refContractor && (
                  <p className="text-xs text-muted-foreground">ID: {event.refContractor}</p>
                )} */}
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                <p className="font-medium">{formatAddress(event.address)}</p>
              </div>
              
              {event.address?.complement && (
                <div className="mt-2">
                  <label className="text-sm font-medium text-muted-foreground">Complemento</label>
                  <p className="font-medium">{event.address.complement}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Financeiras */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor do Evento</label>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(event.value)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Status do Pagamento
                  </label>
                  <div className="mt-1">
                    {getPaymentStatusBadge(event.statusPayment)}
                  </div>
                </div>

                {/* {event.linkPayment && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Link de Pagamento</label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 w-full"
                      onClick={() => window.open(event.linkPayment, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir Link
                    </Button>
                  </div>
                )} */}
              </div>
            </CardContent>
          </Card>

          {/* Informações Técnicas
          {event.uid && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-muted-foreground">ID do Evento</label>
                    <p className="font-mono bg-muted p-1 rounded text-xs break-all">{event.uid}</p>
                  </div>
                  {event.refArtist && (
                    <div>
                      <label className="text-muted-foreground">Ref. Artista</label>
                      <p className="font-mono bg-muted p-1 rounded text-xs break-all">{event.refArtist}</p>
                    </div>
                  )}
                  {event.refContractor && (
                    <div>
                      <label className="text-muted-foreground">Ref. Contratante</label>
                      <p className="font-mono bg-muted p-1 rounded text-xs break-all">{event.refContractor}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
