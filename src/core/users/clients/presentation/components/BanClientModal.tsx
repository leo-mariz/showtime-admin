
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";

interface BanClientModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  clientName: string;
}

export const BanClientModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  clientName 
}: BanClientModalProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Banir Cliente</DialogTitle>
          <DialogDescription>
            Banir permanentemente o cliente {clientName}. Esta ação impedirá o acesso do cliente à plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Motivo do banimento</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Digite o motivo do banimento..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!reason.trim()}
            variant="destructive"
          >
            Banir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
