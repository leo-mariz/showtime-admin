
import { useState } from "react";
import { Group } from "@/utils/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/presentation/components/ui/dialog";
import { Button } from "@/core/presentation/components/ui/button";
import { Badge } from "@/core/presentation/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { Separator } from "@/core/presentation/components/ui/separator";
import { Mail, Calendar, Users, Star, Ban, Clock } from "lucide-react";
import { BanGroupModal } from "./BanGroupModal";
import { SuspendGroupModal } from "./SuspendGroupModal";
import { SendMessageModal } from "@/core/presentation/components/shared/SendMessageModal";

interface GroupModalProps {
  group: Group | null;
  open: boolean;
  onClose: () => void;
}

export const GroupModal = ({ group, open, onClose }: GroupModalProps) => {
  const [showBanModal, setShowBanModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  if (!group) return null;

  const handleBan = (reason: string) => {
    console.log("Banir conjunto:", group.id, "Motivo:", reason);
    // Implementar lógica de banimento
  };

  const handleSuspend = (days: number, reason: string) => {
    console.log("Suspender conjunto:", group.id, "Dias:", days, "Motivo:", reason);
    // Implementar lógica de suspensão
  };

  const handleReactivate = () => {
    console.log("Reativar conjunto:", group.id);
    // Implementar lógica de reativação
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={group.avatar} 
                  alt={group.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold">{group.name}</h2>
                  <Badge variant={group.status === "Ativo" ? "default" : "secondary"}>
                    {group.status}
                  </Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMessageModal(true)}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Enviar Mensagem
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="members">Membros</TabsTrigger>
                <TabsTrigger value="events">Eventos</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4 space-y-4">
                {/* Ações de Moderação */}
                <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2 w-full">Ações de Moderação</h3>
                  <div className="flex gap-2">
                    {group.status === "Ativo" ? (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setShowBanModal(true)}
                          className="flex items-center gap-2"
                        >
                          <Ban className="w-4 h-4" />
                          Banir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSuspendModal(true)}
                          className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                        >
                          <Clock className="w-4 h-4" />
                          Suspender
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReactivate}
                        className="flex items-center gap-2 border-green-300 text-green-600 hover:bg-green-50"
                      >
                        Reativar
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Informações Gerais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informações Gerais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{group.type}</Badge>
                      <span>Tipo de conjunto</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{group.members} membros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Cadastrado em: {formatDate(group.registrationDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{group.events} eventos realizados</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Descrição</h3>
                  <p className="text-gray-600">
                    Conjunto musical especializado em {group.type.toLowerCase()}, 
                    com {group.members} membros experientes e {group.events} eventos realizados com sucesso.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Membros do Conjunto</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-showtime flex items-center justify-center text-white font-medium">
                        JD
                      </div>
                      <div>
                        <h4 className="font-medium">João Silva</h4>
                        <p className="text-sm text-gray-600">Vocalista Principal</p>
                      </div>
                      <Badge variant="outline" className="ml-auto">Líder</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        MP
                      </div>
                      <div>
                        <h4 className="font-medium">Maria Pereira</h4>
                        <p className="text-sm text-gray-600">Guitarrista</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                        CS
                      </div>
                      <div>
                        <h4 className="font-medium">Carlos Santos</h4>
                        <p className="text-sm text-gray-600">Baterista</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Histórico de Eventos</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Festival de Verão 2023</h4>
                        <p className="text-sm text-gray-600">25 de dezembro de 2023</p>
                        <p className="text-sm text-gray-600">Local: Praia de Copacabana</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Concluído
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Casamento Ana & Pedro</h4>
                        <p className="text-sm text-gray-600">10 de novembro de 2023</p>
                        <p className="text-sm text-gray-600">Local: Igreja São José</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Concluído
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Festa Corporativa</h4>
                        <p className="text-sm text-gray-600">15 de janeiro de 2024</p>
                        <p className="text-sm text-gray-600">Local: Hotel Copacabana Palace</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        Agendado
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <BanGroupModal
        open={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={handleBan}
        groupName={group.name}
      />

      <SuspendGroupModal
        open={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        onConfirm={handleSuspend}
        groupName={group.name}
      />

      <SendMessageModal
        open={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        recipientName={group.name}
        recipientEmail={`contato@${group.name.toLowerCase().replace(/\s+/g, '')}.com`}
        recipientType="conjunto"
      />
    </>
  );
};
