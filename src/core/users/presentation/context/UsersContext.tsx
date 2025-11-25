// UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { UserAggregatedInfoEntity } from "@/core/users/domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { GetAllUsersInfoUseCase } from "@/core/users/domain/usecases/GetAllUsersInfoUseCase";
import { IArtistIndividualRepository } from "../../artists/domain/repositories/individual/IArtistIndividualRepository";
import { IClientRepository } from "../../clients/domain/repositories/IClientRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { ApproveAllDocumentsUseCase } from "@/core/users/artists/domain/usecases/ApproveAllDocumentsUseCase";
import { DocumentsEntity } from "@/core/users/artists/domain/entities/individual/DocumentsEntity";
import { RejectSelectedDocumentsUseCase } from "../../artists/domain/usecases/RejectSelectedDocumentsUseCase";
import { AdminEntity } from "../../admins/domain/entities/AdminEntity";

// Defina o tipo do contexto
type UserContextType = {
  users: UserAggregatedInfoEntity[];
  admin: AdminEntity | undefined;
  isLoading: boolean;
  reload: () => Promise<void>;
  approveAllDocuments: (artistUid: string, documents: DocumentsEntity[]) => Promise<void>;
  rejectSelectedDocuments: (artistUid: string, documents: DocumentsEntity[], rejectedTypes: string[], observations: Record<string, string>) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export type UserProviderProps = {
  userRepository: IUserRepository;
  clientRepository: IClientRepository;
  artistRepository: IArtistIndividualRepository;
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ userRepository, clientRepository, artistRepository, children }) => {
  const [users, setUsers] = useState<UserAggregatedInfoEntity[]>([]);
  const [admin, setAdmin] = useState<AdminEntity | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Instancie seu usecase (injeção de dependência real pode ser feita via props/context também)

  const loadUsers = async () => {
    const usecase = new GetAllUsersInfoUseCase(userRepository, clientRepository, artistRepository);
    setIsLoading(true);
    const data = await usecase.execute();
    setUsers(data);
    setIsLoading(false);
  };

  const loadAdmin = async () => {
    const data = await userRepository.getAdminInfo();
    setAdmin(data);
  };

  const loadUsersFromCache = async () => {
    const data = await userRepository.getAllFromCache();
    setUsers(data);
    setIsLoading(false);
  };

  const approveAllDocuments = async (artistUid: string, documents: DocumentsEntity[]) => {
    const usecase = new ApproveAllDocumentsUseCase(artistRepository);
    await usecase.execute(artistUid, documents);
    await loadUsersFromCache(); // Atualiza a lista após aprovar
  };

  const rejectSelectedDocuments = async (
    artistUid: string,
    documents: DocumentsEntity[],
    rejectedTypes: string[],
    observations: Record<string, string>
  ) => {
    const usecase = new RejectSelectedDocumentsUseCase(artistRepository);
    await usecase.execute(artistUid, documents, rejectedTypes, observations);
    await loadUsersFromCache(); // Atualiza a lista após rejeitar/aprovar
  };



  useEffect(() => {
    loadUsers();
    loadAdmin();
  }, []);

  return (
    <UserContext.Provider value={{ users, admin, isLoading, reload: loadUsers, approveAllDocuments, rejectSelectedDocuments }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar o contexto
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUsers deve ser usado dentro de UserProvider");
  return context;
};