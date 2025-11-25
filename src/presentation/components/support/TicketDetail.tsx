
import { useState } from "react";
import { Ticket, TicketStatus } from "@/utils/mockData";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/core/presentation/components/ui/sheet";
import { Button } from "@/core/presentation/components/ui/button";
import { Separator } from "@/core/presentation/components/ui/separator";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/core/presentation/components/ui/radio-group";
import { Label } from "@/core/presentation/components/ui/label";
import { Check, User, Clock, Mail } from "lucide-react";
import { Badge } from "@/core/presentation/components/ui/badge";
import { toast } from "sonner";

interface TicketDetailProps {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: TicketStatus) => void;
}

export const TicketDetail = ({
  ticket,
  open,
  onClose,
  onStatusChange,
}: TicketDetailProps) => {
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState<TicketStatus>("Aberto");
  const [closingNote, setClosingNote] = useState("");

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

  const handleSubmit = () => {
    if (status === "Resolvido" && closingNote.trim() === "") {
      toast.error("Por favor, adicione uma observação de encerramento.");
      return;
    }

    if (reply.trim() === "" && status !== "Resolvido") {
      toast.error("Por favor, insira uma resposta antes de enviar.");
      return;
    }

    console.log(`Atualizando ticket ${ticket?.id}:`, {
      reply,
      status,
      closingNote
    });

    onStatusChange(status);
    toast.success("Ticket atualizado com sucesso!");
    setReply("");
    setClosingNote("");
    onClose();
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

  if (!ticket) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">{ticket.subject}</SheetTitle>
            {getPriorityBadge(ticket.priority)}
          </div>
          <SheetDescription>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">ID: {ticket.id}</Badge>
              <Badge variant="outline">Categoria: {ticket.category}</Badge>
              <Badge variant="outline">Tipo: Cliente</Badge>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-1 h-4 w-4" /> {ticket.clientName}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-4 w-4" /> cliente@email.com
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" /> {formatDate(ticket.openDate)}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Descrição do Problema</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm">
                {ticket.messages[0]?.content || "Problema com pagamento não processado corretamente."}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Histórico da Conversa</h3>
            <div className="space-y-4">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isAdmin
                        ? "bg-gradient-showtime text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">
                        {message.sender}
                      </span>
                      <span className="text-xs">
                        {formatDate(message.date)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Atualizar Status</h3>
            <RadioGroup
              defaultValue={ticket.status}
              onValueChange={(value) => setStatus(value as TicketStatus)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Aberto" id="aberto" />
                <Label htmlFor="aberto">Em Aberto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Em Andamento" id="emandamento" />
                <Label htmlFor="emandamento">Em Andamento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Resolvido" id="resolvido" />
                <Label htmlFor="resolvido">Finalizado</Label>
              </div>
            </RadioGroup>
          </div>

          {status === "Resolvido" && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Observação de Encerramento *</h3>
              <Textarea
                value={closingNote}
                onChange={(e) => setClosingNote(e.target.value)}
                placeholder="Descreva como o problema foi resolvido..."
                className="min-h-[80px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Adicionar Resposta</h3>
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="min-h-[120px]"
            />
          </div>
        </div>

        <SheetFooter className="mt-6 flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            className="bg-gradient-showtime hover:opacity-90" 
            onClick={handleSubmit}
          >
            <Check className="mr-2 h-4 w-4" />
            Atualizar Ticket
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
