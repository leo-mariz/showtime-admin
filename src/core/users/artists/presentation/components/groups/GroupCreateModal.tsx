
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/presentation/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface GroupCreateModalProps {
  open: boolean;
  onClose: () => void;
}

interface GroupFormData {
  name: string;
  type: string;
  description: string;
  members: string;
  contactEmail: string;
  contactPhone: string;
  hourlyRate: string;
}

export const GroupCreateModal = ({ open, onClose }: GroupCreateModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<GroupFormData>({
    defaultValues: {
      name: "",
      type: "",
      description: "",
      members: "",
      contactEmail: "",
      contactPhone: "",
      hourlyRate: "",
    },
  });

  const onSubmit = async (data: GroupFormData) => {
    setIsLoading(true);
    try {
      console.log("Criando conjunto:", data);
      // Simulação de criação - aqui você implementará a nova camada de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Conjunto criado com sucesso!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar conjunto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Conjunto</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo conjunto artístico na plataforma.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Conjunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Banda Rock Stars" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Conjunto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                      <SelectItem value="MPB">MPB</SelectItem>
                      <SelectItem value="Sertanejo">Sertanejo</SelectItem>
                      <SelectItem value="Eletrônica">Eletrônica</SelectItem>
                      <SelectItem value="Clássica">Clássica</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Membros</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 4" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email de Contato</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="contato@conjunto.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone de Contato</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o estilo e especialidades do conjunto..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor por Hora (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 800" 
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
                {isLoading ? "Criando..." : "Criar Conjunto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
