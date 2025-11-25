
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

interface ArtistCreateModalProps {
  open: boolean;
  onClose: () => void;
}

interface ArtistFormData {
  name: string;
  email: string;
  phone: string;
  type: string;
  description: string;
  experience: string;
  hourlyRate: string;
}

export const ArtistCreateModal = ({ open, onClose }: ArtistCreateModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ArtistFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "",
      description: "",
      experience: "",
      hourlyRate: "",
    },
  });

  const onSubmit = async (data: ArtistFormData) => {
    setIsLoading(true);
    try {
      console.log("Criando artista:", data);
      // Simulação de criação - aqui você implementará a nova camada de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Artista criado com sucesso!");
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Erro ao criar artista");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Artista</DialogTitle>
          <DialogDescription>
            Preencha os dados para cadastrar um novo artista na plataforma.
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
                    <Input placeholder="Ex: João Silva" {...field} />
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
                      placeholder="joao@exemplo.com" 
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Artista</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cantor">Cantor</SelectItem>
                      <SelectItem value="Músico">Músico</SelectItem>
                      <SelectItem value="DJ">DJ</SelectItem>
                      <SelectItem value="Banda">Banda</SelectItem>
                      <SelectItem value="Mágico">Mágico</SelectItem>
                      <SelectItem value="Comediante">Comediante</SelectItem>
                    </SelectContent>
                  </Select>
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
                      placeholder="Descreva sua experiência e especialidades..."
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
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anos de Experiência</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Ex: 5" 
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
                      placeholder="Ex: 150" 
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
                {isLoading ? "Criando..." : "Criar Artista"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
