
import { useState } from "react";
import { Ticket, TicketStatus } from "@/utils/mockData";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/presentation/components/ui/select";
import { TicketDetail } from "./TicketDetail";
import { toast } from "sonner";

interface TicketsTableProps {
  tickets: Ticket[];
}

export const TicketsTable = ({ tickets }: TicketsTableProps) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketStatuses, setTicketStatuses] = useState<{[key: string]: TicketStatus}>({});

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Aberto":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Em Aberto
          </Badge>
        );
      case "Em Andamento":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Em Andamento
          </Badge>
        );
      case "Resolvido":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Finalizado
          </Badge>
        );
      default:
        return null;
    }
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alta</Badge>;
      case "Média":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Média</Badge>;
      case "Baixa":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baixa</Badge>;
      default:
        return null;
    }
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTicketStatuses(prev => ({
      ...prev,
      [ticketId]: newStatus
    }));
    
    toast.success(`Status do ticket ${ticketId} alterado para ${newStatus}`);
  };

  const getCurrentStatus = (ticket: Ticket): TicketStatus => {
    return ticketStatuses[ticket.id] || ticket.status;
  };

  return (
    <div className="space-y-4">
      {tickets.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono">{ticket.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>{ticket.clientName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    cliente@email.com
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Cliente</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(ticket.openDate)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>
                    <Select
                      value={getCurrentStatus(ticket)}
                      onValueChange={(value: TicketStatus) => handleStatusChange(ticket.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberto">Em Aberto</SelectItem>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Resolvido">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket)}
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
          <p className="text-muted-foreground">Nenhum ticket encontrado</p>
        </div>
      )}

      <TicketDetail
        ticket={selectedTicket}
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={(newStatus) => {
          if (selectedTicket) {
            handleStatusChange(selectedTicket.id, newStatus);
          }
        }}
      />
    </div>
  );
};
