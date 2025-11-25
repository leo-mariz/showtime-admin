import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";

interface ClientModalProps {
  clientUid: string | null;
  open: boolean;
  onClose: () => void;
}

export const ClientModal = ({ clientUid, open, onClose }: ClientModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Modal de detalhes do cliente em desenvolvimento.
          </p>
          <p className="text-sm">Cliente UID: {clientUid}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};