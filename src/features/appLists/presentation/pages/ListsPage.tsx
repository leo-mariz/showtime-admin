import { useState } from "react";
import { useLists } from "@/features/appLists/presentation/context/ListsContext";
import { useEventTypes } from "@/features/events/presentation/context/EventTypesContext";
import { Input } from "@/core/presentation/components/ui/input";
import { Button } from "@/core/presentation/components/ui/button";
import { Card } from "@/core/presentation/components/ui/card";
import { toast, useToast } from "@/core/presentation/components/ui/use-toast";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/core/presentation/components/ui/accordion";

export default function ListsPage() {
  const { lists, isLoading, updateList } = useLists();
  const { eventTypes, isLoading: isLoadingEventTypes, addEventType, removeEventType } = useEventTypes();
  console.log(lists);
  console.log(isLoading);
  console.log("Event Types:", eventTypes);

  // Estados locais para inputs de novas opções
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newTalent, setNewTalent] = useState("");
  const [newEventType, setNewEventType] = useState("");
  const { toast } = useToast();

  // Adicionar item
  const handleAdd = async (field: "artistSpecialtys" | "hasTalent", value: string) => {
    if (!value.trim() || !lists) return;
    const updated = [...(lists[field] || []), value.trim()];
    await updateList(field, updated);
    toast({ title: "Sucesso", description: "Item adicionado!", variant: "default" });
    if (field === "artistSpecialtys") setNewSpecialty("");
    if (field === "hasTalent") setNewTalent("");
  };

  // Remover item
  const handleRemove = async (field: "artistSpecialtys" | "hasTalent", idx: number) => {
    if (!lists) return;
    const updated = (lists[field] || []).filter((_: string, i: number) => i !== idx);
    await updateList(field, updated);
    toast({ title: "Sucesso", description: "Item removido!", variant: "default" });
  };

  // Adicionar EventType
  const handleAddEventType = async () => {
    if (!newEventType.trim()) return;
    try {
      await addEventType(newEventType.trim());
      toast({ title: "Sucesso", description: "Tipo de evento adicionado!", variant: "default" });
      setNewEventType("");
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao adicionar tipo de evento", variant: "destructive" });
    }
  };

  // Remover EventType
  const handleRemoveEventType = async (uid: string) => {
    try {
      await removeEventType(uid);
      toast({ title: "Sucesso", description: "Tipo de evento removido!", variant: "default" });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao remover tipo de evento", variant: "destructive" });
    }
  };

  if (isLoading || isLoadingEventTypes) return <div className="p-8">Carregando...</div>;
  if (!lists) return <div className="p-8">Nenhuma lista encontrada.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Parâmetros do App</h1>
        <p className="text-muted-foreground">
          Gerencie as listas utilizadas em todo o sistema
        </p>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {/* Especialidades dos Artistas */}
        <AccordionItem value="specialties">
          <AccordionTrigger>
            <span className="text-xl font-semibold">Especialidades de Artistas</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={e => setNewSpecialty(e.target.value)}
                placeholder="Nova especialidade"
              />
              <Button
                onClick={() => handleAdd("artistSpecialtys", newSpecialty)}
                className="bg-showtime-orange text-white"
              >
                Adicionar
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {lists.artistSpecialtys
                ?.slice() // cria uma cópia
                .sort((a, b) => a.localeCompare(b, 'pt-BR')) // ordena alfabeticamente, acentos inclusos
                .map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove("artistSpecialtys", idx)}
                      className="text-red-500"
                    >
                      Remover
                    </Button>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Talentos */}
        <AccordionItem value="talents">
          <AccordionTrigger>
            <span className="text-xl font-semibold">Especialidades que definem estilos musicais</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2">
              <Input
                value={newTalent}
                onChange={e => setNewTalent(e.target.value)}
                placeholder="Especialidades que definem estilos musicais"
              />
              <Button
                onClick={() => handleAdd("hasTalent", newTalent)}
                className="bg-showtime-orange text-white"
              >
                Adicionar
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {lists.hasTalent
                ?.slice()
                .sort((a, b) => a.localeCompare(b, 'pt-BR'))
                .map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                    <span>{item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove("hasTalent", idx)}
                      className="text-red-500"
                    >
                      Remover
                    </Button>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Tipos de Eventos */}
        <AccordionItem value="eventTypes">
          <AccordionTrigger>
            <span className="text-xl font-semibold">Tipos de Eventos</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex gap-2">
              <Input
                value={newEventType}
                onChange={e => setNewEventType(e.target.value)}
                placeholder="Novo tipo de evento"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddEventType();
                  }
                }}
              />
              <Button
                onClick={handleAddEventType}
                className="bg-showtime-orange text-white"
              >
                Adicionar
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {eventTypes
                ?.slice()
                .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                .map((item) => (
                  <li key={item.uid} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                    <span>{item.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEventType(item.uid)}
                      className="text-red-500"
                    >
                      Remover
                    </Button>
                  </li>
                ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Adicione outras listas como novas AccordionItem */}
      </Accordion>
    </div>
  );
}