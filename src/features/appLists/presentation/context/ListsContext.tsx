import { createContext, useContext, useEffect, useState } from "react";
import { ListsEntity } from "@/features/appLists/domain/entities/ListsEntity";
import { ListsRepositoryImpl } from "@/features/appLists/data/repositories/ListsRepository";
import { ListsLocalDataSource } from "@/features/appLists/data/datasources/ListsLocalDatasource";
import { ListsRemoteDataSource } from "@/features/appLists/data/datasources/ListsRemoteDatasource";
import { cacheService } from "@/core/services/LocalCacheServices";

type ListsContextType = {
  lists: ListsEntity | null;
  isLoading: boolean;
  updateList: (field: keyof ListsEntity, value: any) => Promise<void>;
  refetch: () => Promise<void>;
};

const ListsContext = createContext<ListsContextType | undefined>(undefined);

const listsRepository = new ListsRepositoryImpl(
  new ListsLocalDataSource(cacheService),
  new ListsRemoteDataSource()
);

export function ListsProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<ListsEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLists = async () => {
    setIsLoading(true);
    console.log("[ListsContext] Buscando listas...");
    const data = await listsRepository.getAll();
    console.log("[ListsContext] Resultado listsRepository.getAll:", data);
    setLists(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const updateList = async (field: keyof ListsEntity, value: any) => {
    console.log("[ListsContext] updateList", field, value);
    await listsRepository.updateAll({ [field]: value });
    await fetchLists();
  };

  return (
    <ListsContext.Provider value={{ lists, isLoading, updateList, refetch: fetchLists }}>
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const ctx = useContext(ListsContext);
  if (!ctx) throw new Error("useLists deve ser usado dentro de ListsProvider");
  return ctx;
}