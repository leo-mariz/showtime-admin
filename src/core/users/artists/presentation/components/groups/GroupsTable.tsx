
import { useState } from "react";
import { Group } from "@/utils/mockData";
import { Button } from "@/core/presentation/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/presentation/components/ui/table";
import { Badge } from "@/core/presentation/components/ui/badge";
import { GroupModal } from "./GroupModal";

interface GroupsTableProps {
  groups: Group[];
  visibleColumns: string[];
}

export const GroupsTable = ({ groups, visibleColumns }: GroupsTableProps) => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Ativo
          </Badge>
        );
      case "Inativo":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Inativo
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {groups.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("name") && <TableHead>Conjunto</TableHead>}
                  {visibleColumns.includes("type") && <TableHead>Tipo</TableHead>}
                  {visibleColumns.includes("members") && <TableHead>Membros</TableHead>}
                  {visibleColumns.includes("events") && <TableHead>Eventos</TableHead>}
                  {visibleColumns.includes("registrationDate") && <TableHead>Data de Cadastro</TableHead>}
                  {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id} className="hover:bg-muted/50">
                    {visibleColumns.includes("name") && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img
                              src={group.avatar}
                              alt={group.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{group.name}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("type") && <TableCell>{group.type}</TableCell>}
                    {visibleColumns.includes("members") && <TableCell>{group.members}</TableCell>}
                    {visibleColumns.includes("events") && <TableCell>{group.events}</TableCell>}
                    {visibleColumns.includes("registrationDate") && <TableCell>{formatDate(group.registrationDate)}</TableCell>}
                    {visibleColumns.includes("status") && <TableCell>{getStatusBadge(group.status)}</TableCell>}
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedGroup(group)}
                      >
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">Nenhum conjunto encontrado</p>
          </div>
        )}
      </div>

      <GroupModal
        group={selectedGroup}
        open={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
    </>
  );
};
