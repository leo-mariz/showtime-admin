import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/presentation/components/ui/alert-dialog";
import { useAdminUsersConfig } from "../context/AdminUsersConfigContext";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AdminUserDeleteDialogProps {
  adminUid: string | null;
  open: boolean;
  onClose: () => void;
}

export const AdminUserDeleteDialog = ({ adminUid, open, onClose }: AdminUserDeleteDialogProps) => {
  const { adminUsers, deleteAdminUser } = useAdminUsersConfig();
  const [loading, setLoading] = useState(false);

  const adminUser = adminUsers.find(a => a.uid === adminUid);

  if (!adminUser) {
    return null;
  }

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteAdminUser(adminUser.uid);
      toast.success(`Administrador ${adminUser.name} excluído com sucesso!`);
      onClose();
    } catch (error: any) {
      console.error("Erro ao excluir administrador:", error);
      toast.error(error.message || "Erro ao excluir administrador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir o administrador <strong>{adminUser.name}</strong>?
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {adminUser.email}
            </p>
            <p className="text-sm text-red-600 font-semibold mt-2">
              ⚠️ Esta ação não pode ser desfeita. O documento será removido permanentemente do Firestore.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir Administrador
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


