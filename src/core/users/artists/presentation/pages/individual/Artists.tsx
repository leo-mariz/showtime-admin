import { useState } from "react";
import { ArtistsTable } from "@/core/users/artists/presentation/components/individual/ArtistsTable";
import { ArtistCreateModal } from "@/core/users/artists/presentation/components/individual/ArtistCreateModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/presentation/components/ui/tabs";
import { useUsers } from "@/core/users/presentation/context/UsersContext";
import { UserAggregatedInfoEntity } from "@/core/users/domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { DocumentsModel } from "../../../data/models/individual/DocumentsModel";

const Artists = () => {
  const { users, isLoading } = useUsers();
  console.dir(users, { depth: null });
  const [visibleColumns, setVisibleColumns] = useState([
    "artistName", "userName", "email", "cpfOrCnpj", "type", "registrationDate", "approved", "active"
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtra apenas os usuários que têm info de artista
  const artists = users.filter(u => u.artistInfo);

  // Ordena por nome artístico (alfabético)
  const sortByArtistName = (arr: typeof artists) =>
    arr.slice().sort((a, b) => {
      const nameA = a.artistInfo?.artistName?.toLowerCase() || "";
      const nameB = b.artistInfo?.artistName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });

    function hasAllRequiredDocsPending(artist: UserAggregatedInfoEntity) {
      const docs = artist.artistInfo?.documents || [];
      const requiredDocTypes = DocumentsModel.documentTypes();
    
      // Todos os documentos obrigatórios foram enviados (status != 0)
      const allSent = requiredDocTypes.every(type => {
        const doc = docs.find(d => d.documentType === type);
        return doc && doc.status !== 0;
      });
    
      // Pelo menos um documento está em análise (status 1)
      const hasAtLeastOnePending = requiredDocTypes.some(type => {
        const doc = docs.find(d => d.documentType === type);
        return doc && doc.status === 1;
      });
    
      return allSent && hasAtLeastOnePending;
    }

  const allArtists = sortByArtistName(artists);
  const pendingArtists = sortByArtistName(
    artists.filter(
      u =>
        u.artistInfo?.approved === false &&
        hasAllRequiredDocsPending(u)
    )
  );
  const approvedArtists = sortByArtistName(
    artists.filter(u => u.artistInfo?.approved === true)
  );

  const handleCreateArtist = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-2">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Artistas</h1>
        <p className="text-muted-foreground">
          Gerencie artistas cadastrados na plataforma
        </p>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes de Aprovação</TabsTrigger>
          <TabsTrigger value="approved">Aprovados</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ArtistsTable
            artists={allArtists}
            title="Todos os Artistas"
            emptyMessage="Nenhum artista encontrado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="pending">
          <ArtistsTable
            artists={pendingArtists}
            title="Artistas Pendentes de Aprovação"
            emptyMessage="Nenhum artista pendente de aprovação"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="approved">
          <ArtistsTable
            artists={approvedArtists}
            title="Artistas Aprovados"
            emptyMessage="Nenhum artista aprovado"
            visibleColumns={visibleColumns}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
      <ArtistCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Artists;
