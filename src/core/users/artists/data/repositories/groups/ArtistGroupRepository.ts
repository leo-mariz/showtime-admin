import { IArtistGroupRepository } from '../../../domain/repositories/groups/IArtistGroupRepository';
import { IArtistGroupRemoteDataSource } from '../../datasources/groups/ArtistGroupRemoteDataSource';
import { IArtistGroupLocalDataSource } from '../../datasources/groups/ArtistGroupLocalDataSource';
import { GroupEntity } from '../../../domain/repositories/groups/entities/GroupEntity';

export class ArtistGroupRepository implements IArtistGroupRepository {
  constructor(
    private remote: IArtistGroupRemoteDataSource,
    private local: IArtistGroupLocalDataSource
  ) {}

  async getById(uid: string): Promise<GroupEntity | null> {
    // Sempre busca do remoto para garantir dados atualizados
    const remoteGroup = await this.remote.getById(uid);
    if (!remoteGroup) return null;

    // Atualiza o cache local (substitui ou adiciona no array)
    let allCached = await this.local.getAll();
    allCached = allCached.filter(g => g.uid !== uid); // remove antigo se existir
    allCached.push(remoteGroup);
    await this.local.setAll(allCached);

    return remoteGroup;
  }

  async getAll(): Promise<GroupEntity[]> {
    // Sempre busca do remoto
    const groups = await this.remote.getAll();

    // Atualiza o cache local
    await this.local.setAll(groups);

    return groups;
  }

  async create(uid: string, entity: GroupEntity): Promise<void> {
    await this.remote.create(uid, entity);
    // Atualiza o cache local
    let allCached = await this.local.getAll();
    allCached.push(entity);
    await this.local.setAll(allCached);
  }

  async update(uid: string, changes: Partial<GroupEntity>): Promise<void> {
    await this.remote.update(uid, changes);
    // Atualiza o cache local
    let allCached = await this.local.getAll();
    allCached = allCached.map(group =>
      group.uid === uid ? { ...group, ...changes } : group
    );
    await this.local.setAll(allCached);
  }

  async delete(uid: string): Promise<void> {
    await this.remote.delete(uid);
    // Remove do cache local
    let allCached = await this.local.getAll();
    allCached = allCached.filter(group => group.uid !== uid);
    await this.local.setAll(allCached);
  }
}
