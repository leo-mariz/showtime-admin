
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
import { Input } from "@/core/presentation/components/ui/input";
import { Label } from "@/core/presentation/components/ui/label";
import { Textarea } from "@/core/presentation/components/ui/textarea";

interface SuspendArtistModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (days: number, reason: string) => void;
  artistName: string;
}

export const SuspendArtistModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  artistName 
}: SuspendArtistModalProps) => {
  const [days, setDays] = useState<number>(7);
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (days > 0 && reason.trim()) {
      onConfirm(days, reason);
      setDays(7);
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suspender Artista</DialogTitle>
          <DialogDescription>
            Suspender o artista {artistName}. Defina o período e motivo da suspensão.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="days">Dias de suspensão</Label>
            <Input
              id="days"
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              placeholder="Número de dias"
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Motivo da suspensão</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Digite o motivo da suspensão..."
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
            disabled={!days || !reason.trim()}
            variant="destructive"
          >
            Suspender
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
