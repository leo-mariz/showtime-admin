import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";

export function ApproveDocumentsModal({ open, onClose, onApprove, loading }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Aprovação</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja aprovar <b>todos os documentos</b> deste artista?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={onApprove} disabled={loading}>
            {loading ? "Aprovando..." : "Aprovar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
