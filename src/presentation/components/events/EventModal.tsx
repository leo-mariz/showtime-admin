
import { Event } from "@/utils/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/core/presentation/components/ui/dialog";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Separator } from "@/core/presentation/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { CalendarDays, Clock, MapPin, Users, DollarSign, Check } from "lucide-react";

interface EventModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export const EventModal = ({ event, open, onClose }: EventModalProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Pendente";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{event.name}</DialogTitle>
            <Badge 
              variant="outline" 
              className={`
                ${event.status === 'Agendado' ? 'bg-blue-100 text-blue-800' : ''}
                ${event.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${event.status === 'Concluído' ? 'bg-green-100 text-green-800' : ''}
                ${event.status === 'Cancelado' ? 'bg-red-100 text-red-800' : ''}
              `}
            >
              {event.status}
            </Badge>
          </div>
          <DialogDescription>
            <Badge variant="outline" className="mt-1">ID: {event.id}</Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">{formatDate(event.date)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duração</p>
              <p className="font-medium">{event.duration}</p>
            </div>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Local</p>
              <p className="font-medium">{event.location}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Convidados</p>
              <p className="font-medium">{event.attendees}</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Descrição
              </h4>
              <p className="mt-1">{event.description}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Cliente
                </h4>
                <p className="mt-1">{event.clientName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Artista
                </h4>
                <p className="mt-1">{event.artistName}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-medium">Timeline do Evento</h4>
              <div className="space-y-4">
                {event.timeline.map((stage, index) => (
                  <div
                    key={index}
                    className="flex items-start"
                  >
                    <div className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${stage.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {stage.completed ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{stage.stage}</p>
                      <p className="text-sm text-muted-foreground">
                        {stage.date ? formatDate(stage.date) : "Pendente"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="mt-4">
            <div className="space-y-4">
              <div className="showtime-card !p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-semibold">Valor Total</h4>
                    <p className="text-sm text-muted-foreground">Valor acordado para o evento</p>
                  </div>
                  <div className="text-2xl font-bold">{formatCurrency(event.value)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="showtime-card">
                  <h4 className="font-medium">Status de Pagamento</h4>
                  <Badge 
                    variant="outline" 
                    className={`
                      mt-2
                      ${event.payment.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${event.payment.status === 'Pago' ? 'bg-green-100 text-green-800' : ''}
                      ${event.payment.status === 'Reembolsado' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {event.payment.status}
                  </Badge>
                </div>
                <div className="showtime-card">
                  <h4 className="font-medium">Método de Pagamento</h4>
                  <p className="mt-2">{event.payment.method}</p>
                </div>
              </div>
              
              <div className="showtime-card">
                <h4 className="font-medium">Detalhamento</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <p>Entrada (50%)</p>
                    <p>{formatCurrency(event.value * 0.5)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Pagamento Final (50%)</p>
                    <p>{formatCurrency(event.value * 0.5)}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <p>Total</p>
                    <p>{formatCurrency(event.value)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
