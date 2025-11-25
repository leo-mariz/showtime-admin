import { useMemo, useState } from "react";
import { UserAggregatedInfoEntity } from "@/core/users/domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
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
import { ArtistModal } from "./ArtistModal";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/core/presentation/components/shared/SearchBar";

interface ArtistsTableProps {
  artists: UserAggregatedInfoEntity[];
  title: string;
  emptyMessage?: string;
  visibleColumns: string[];
  isLoading?: boolean;
}

export const ArtistsTable = ({
  artists,
  title,
  emptyMessage = "Nenhum artista encontrado",
  visibleColumns,
  isLoading = false,
}: ArtistsTableProps) => {
  const [selectedArtistUid, setSelectedArtist] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Função utilitária para normalizar strings (remover acentos, espaços, pontuação)
  const normalize = (str?: string) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/gi, "");

  // Filtragem dos artistas
  const filteredArtists = useMemo(() => {
    if (!search.trim()) return artists;
    const s = normalize(search);
    return artists.filter((artist) => {
      const artistName = normalize(artist.artistInfo?.artistName);
      const firstName = normalize(artist.userInfo?.cpfUser?.firstName);
      const lastName = normalize(artist.userInfo?.cpfUser?.lastName);
      const fantasyName = normalize(artist.userInfo?.cnpjUser?.fantasyName);
      const cpf = normalize(artist.userInfo?.cpfUser?.cpf);
      const cnpj = normalize(artist.userInfo?.cnpjUser?.cnpj);

      return (
        artistName.includes(s) ||
        (firstName + lastName).includes(s) ||
        fantasyName.includes(s) ||
        cpf.includes(s) ||
        cnpj.includes(s)
      );
    });
  }, [artists, search]);

  const getStatusBadge = (approved?: boolean) => {
    if (approved === true) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Aprovado
        </Badge>
      );
    }
    if (approved === false) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pendente
        </Badge>
      );
    }
    return null;
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Buscar artista por nome, CPF ou CNPJ..."
          onSearch={setSearch}
          className="w-full sm:w-80"
        />
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando artistas...</span>
        </div>
      ) : filteredArtists.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/50 px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-sm">
                {visibleColumns.includes("artistName") && <TableHead>Nome Artístico</TableHead>}
                {visibleColumns.includes("userName") && <TableHead>Usuário</TableHead>}
                {visibleColumns.includes("cpfOrCnpj") && <TableHead>CPF/CNPJ</TableHead>}
                {visibleColumns.includes("email") && <TableHead>Email</TableHead>}
                {visibleColumns.includes("type") && <TableHead>Tipo</TableHead>}
                {visibleColumns.includes("registrationDate") && <TableHead>Data de Cadastro</TableHead>}
                {visibleColumns.includes("approved") && <TableHead>Status</TableHead>}
                {visibleColumns.includes("active") && <TableHead>Ativo</TableHead>}
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtists.map((artist, idx) => (
                <TableRow key={artist.userInfo?.uid || idx} className="hover:bg-muted/50 text-sm">
                  {visibleColumns.includes("artistName") && (
                    <TableCell className="py-1 px-2">
                      {artist.artistInfo?.artistName || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("userName") && (
                    <TableCell className="py-1 px-2">
                      {artist.userInfo?.cpfUser?.firstName + " " + artist.userInfo?.cpfUser?.lastName ||
                        artist.userInfo?.cnpjUser?.fantasyName ||
                        "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("email") && (
                    <TableCell className="py-1 px-2">
                      {artist.userInfo?.email || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("cpfOrCnpj") && (
                    <TableCell className="py-1 px-2">
                      {artist.userInfo?.cpfUser?.cpf || artist.userInfo?.cnpjUser?.cnpj || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("type") && (
                    <TableCell className="py-1 px-2">
                      {artist.artistInfo?.professionalInfo?.specialty?.join(", ") || "-"}
                    </TableCell>
                  )}
                  {visibleColumns.includes("registrationDate") && (
                    <TableCell className="py-1 px-2">
                      {formatDate(artist.artistInfo?.dateRegistered)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("approved") && (
                    <TableCell className="py-1 px-2">
                      {getStatusBadge(artist.artistInfo?.approved)}
                    </TableCell>
                  )}
                  {visibleColumns.includes("active") && (
                    <TableCell className="py-1 px-2">
                      {artist.artistInfo?.isActive || artist.userInfo?.isActive
                        ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Ativo
                          </Badge>
                        )
                        : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Inativo
                          </Badge>
                        )
                      }
                    </TableCell>
                  )}
                  <TableCell className="text-right py-1 px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedArtist(artist.artistInfo?.uid)}
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
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}

      <ArtistModal
        artistUid={selectedArtistUid}
        open={!!selectedArtistUid}
        onClose={() => setSelectedArtist(null)}
      />
    </div>
  );
};
