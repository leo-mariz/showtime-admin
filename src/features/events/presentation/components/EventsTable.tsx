import { useMemo, useState } from "react";
import { EventEntity } from "../../domain/entities/EventEntity";
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
import { EventModal } from "./EventModal";
import { Loader2, Calendar, Clock, MapPin } from "lucide-react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";

interface EventsTableProps {
  events: EventEntity[];
  title: string;
  emptyMessage?: string;
  visibleColumns: string[];
  isLoading?: boolean;
}

export const EventsTable = ({
  events,
  title,
  emptyMessage = "Nenhum evento encontrado",
  visibleColumns,
  isLoading = false,
}: EventsTableProps) => {
  const [selectedEventUid, setSelectedEvent] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Função utilitária para normalizar strings (remover acentos, espaços, pontuação)
  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "");

  // Filtragem dos eventos
  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const s = normalize(search);
    return events.filter((event) => {
      const artistName = normalize(event.nameArtist);
      const contractorName = normalize(event.nameContractor);
      const eventType = normalize(event.eventType?.name);
      const location = normalize(event.address?.localidade);
      const status = normalize(event.status);

      return (
        artistName.includes(s) ||
        contractorName.includes(s) ||
        eventType.includes(s) ||
        location.includes(s) ||
        status.includes(s)
      );
    });
  }, [events, search]);

  const getEventStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      ACCEPTED: { label: "Aceito", className: "bg-green-100 text-green-800 hover:bg-green-100" },
      REFUSED: { label: "Recusado", className: "bg-red-100 text-red-800 hover:bg-red-100" },
      CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
      IN_PROGRESS: { label: "Em Andamento", className: "bg-purple-100 text-purple-800 hover:bg-purple-100" },
      FINISHED: { label: "Finalizado", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" },
      CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800 hover:bg-red-100" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pendente", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      PAID: { label: "Pago", className: "bg-green-100 text-green-800 hover:bg-green-100" },
      REFUNDED: { label: "Reembolsado", className: "bg-orange-100 text-orange-800 hover:bg-orange-100" },
      CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800 hover:bg-red-100" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const formatDuration = (hours: number) => {
    if (!hours) return "-";
    if (hours === 1) return "1 hora";
    return `${hours} horas`;
  };

  const getLocation = (event: EventEntity) => {
    if (!event.address) return "-";
    const parts = [];
    if (event.address.bairro) parts.push(event.address.bairro);
    if (event.address.localidade) parts.push(event.address.localidade);
    if (event.address.uf) parts.push(event.address.uf);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Buscar por artista, contratante, tipo ou localização..."
          onSearch={setSearch}
          className="w-full sm:w-96"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando eventos...</span>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                {visibleColumns.includes("date") && <TableHead>Data</TableHead>}
                {visibleColumns.includes("time") && <TableHead>Horário</TableHead>}
                {visibleColumns.includes("duration") && <TableHead>Duração</TableHead>}
                {visibleColumns.includes("artist") && <TableHead>Artista</TableHead>}
                {visibleColumns.includes("contractor") && <TableHead>Contratante</TableHead>}
                {visibleColumns.includes("eventType") && <TableHead>Tipo</TableHead>}
                {visibleColumns.includes("location") && <TableHead>Localização</TableHead>}
                {visibleColumns.includes("status") && <TableHead>Status Evento</TableHead>}
                {visibleColumns.includes("statusPayment") && <TableHead>Status Pagamento</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event, idx) => (
                <TableRow key={event.uid || idx} className="hover:bg-muted/50 text-sm">
                  {visibleColumns.includes("date") && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(event.date)}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("time") && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {event.time || "-"}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("duration") && (
                    <TableCell className="py-1 px-2">
                      {formatDuration(event.duration)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("artist") && (
                    <TableCell className="py-1 px-2">
                      {event.nameArtist || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("contractor") && (
                    <TableCell className="py-1 px-2">
                      {event.nameContractor || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("eventType") && (
                    <TableCell className="py-1 px-2">
                      {event.eventType?.name || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("location") && (
                    <TableCell className="py-1 px-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {getLocation(event)}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell className="py-1 px-2">
                      {getEventStatusBadge(event.status)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("statusPayment") && (
                    <TableCell className="py-1 px-2">
                      {getPaymentStatusBadge(event.statusPayment)}
                    </TableCell>
                  )}
                  <TableCell className="text-right py-1 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEvent(event.uid || null)}
                    >
                      Ver Detalhes
                    </Button>
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

      <EventModal
        eventUid={selectedEventUid}
        open={!!selectedEventUid}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
