// ArtistModal.tsx

import { UserAggregatedInfoEntity } from "@/core/users/domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/core/presentation/components/ui/sheet";
import { Button } from "@/core/presentation/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/core/presentation/components/ui/tabs";
// Importando as sections criadas
import { UserInfoSection } from "../modal_sections/UserInfoSection";
import { ProfessionalInfoSection } from "../modal_sections/ProfessionalInfoSection";
import { DocumentsSection } from "../modal_sections/documents/DocumentsSection";
import { BankInfoSection } from "../modal_sections/BankInfoSection";
import { useState } from "react";
import { useUsers } from "@/core/users/presentation/context/UsersContext";

interface ArtistModalProps {
  artistUid: string | null;
  open: boolean;
  onClose: () => void;
}

export const ArtistModal = ({ artistUid, open, onClose }: ArtistModalProps) => {
  if (!artistUid) return null;

  const { users } = useUsers();
  const artist = users.find(u => u.artistInfo?.uid === artistUid);
  if (!artist) return null;

  const { userInfo, artistInfo } = artist;

  const [showApproveModal] = useState(false);
  const [showRejectModal] = useState(false);

  const canClose = !showApproveModal && !showRejectModal && !showRejectModal;

  return (
    <Sheet open={open && canClose} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Artista</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <Tabs defaultValue="info">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="professional">Profissionais</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="bank">Bancárias</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <UserInfoSection userInfo={userInfo} />
            </TabsContent>
            <TabsContent value="professional">
              <ProfessionalInfoSection artistInfo={artistInfo} />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentsSection uid={artistInfo?.uid}/>
            </TabsContent>
            <TabsContent value="bank">
              <BankInfoSection bankAccount={artistInfo?.bankAccount} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};