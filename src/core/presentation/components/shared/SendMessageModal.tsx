
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { Mail } from "lucide-react";
import { toast } from "sonner";

interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  recipientName: string;
  recipientEmail: string;
  recipientType: "artista" | "cliente" | "conjunto";
}

export const SendMessageModal = ({ 
  open, 
  onClose, 
  recipientName, 
  recipientEmail,
  recipientType 
}: SendMessageModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    // Simular envio de email (implementação SMTP será feita posteriormente)
    console.log("Enviando mensagem:", {
      to: recipientEmail,
      subject,
      message,
      recipientType
    });

    // Simular delay
    setTimeout(() => {
      setLoading(false);
      toast.success(`Mensagem enviada para ${recipientName} com sucesso!`);
      setSubject("");
      setMessage("");
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Mensagem
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Destinatário</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{recipientName}</p>
              <p className="text-sm text-muted-foreground">{recipientEmail}</p>
              <p className="text-xs text-muted-foreground capitalize">{recipientType}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto *</Label>
            <Input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Digite o assunto da mensagem..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="min-h-[120px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-showtime hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar Mensagem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
