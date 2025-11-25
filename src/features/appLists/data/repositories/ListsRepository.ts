import { ListsEntity } from '../../domain/entities/ListsEntity';
import { ListsLocalDataSource } from '../datasources/ListsLocalDatasource';
import { ListsRemoteDataSource } from '../datasources/ListsRemoteDatasource';
import { IListsRepository } from '../../domain/repositories/IListsRepository';

export class ListsRepositoryImpl implements IListsRepository {
  constructor(
    private local: ListsLocalDataSource,
    private remote: ListsRemoteDataSource
  ) {}

  async getAll(): Promise<ListsEntity | null> {
    const localLists = await this.local.getAll();
    console.log("[ListsRepository] localLists:", localLists);
    if (localLists && localLists !== null) return localLists;

    const remoteListsArr = await this.remote.getAll();
    console.log("[ListsRepository] remoteListsArr:", remoteListsArr);
    const remoteLists = remoteListsArr[0] ?? null;
    if (remoteLists) await this.local.saveAll(remoteLists);
    return remoteLists;
  }

  async updateAll(changes: Partial<ListsEntity>): Promise<void> {
    // Atualiza remotamente
    await this.remote.updateAll(changes);

    // Busca a versão atualizada e salva localmente
    const updatedListsArr = await this.remote.getAll();
    const updatedLists = updatedListsArr[0] ?? null;
    if (updatedLists) await this.local.saveAll(updatedLists);
  }
}