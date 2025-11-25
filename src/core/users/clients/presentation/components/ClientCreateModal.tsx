
import { useState } from "react";
import { Button } from "@/core/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/presentation/components/ui/form";
import { Input } from "@/core/presentation/components/ui/input";
import { Textarea } from "@/core/presentation/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClientCreateModalProps {
  open: boolean;
  onClose: () => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  notes?: string;
}

export const ClientCreateModal = ({ open, onClose }: ClientCreateModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ClientFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsLoading(true);
    try {
      console.log("Criando cliente:", data);
      // Aqui seria feita a integração com o backend
      toast.success("Cliente criado com sucesso!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar cliente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo cliente na plataforma.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Maria Santos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="maria@exemplo.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(11) 99999-9999" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa (Opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nome da empresa" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Rua, número, bairro, cidade" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informações adicionais sobre o cliente..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-showtime hover:opacity-90"
              >
                {isLoading ? "Criando..." : "Criar Cliente"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
