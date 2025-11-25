import { cacheService } from '@/core/services/LocalCacheServices';
import { GroupModel } from '../../models/groups/GroupModel';
import { GroupEntity } from '../../../domain/repositories/groups/entities/GroupEntity';

export interface IArtistGroupLocalDataSource {
  getAll(): Promise<GroupEntity[]>;
  setAll(groups: GroupEntity[]): Promise<void>;
  removeAll(): Promise<void>;
}

export class ArtistGroupLocalDataSource implements IArtistGroupLocalDataSource {
  async getAll(): Promise<GroupEntity[]> {
    return (await cacheService.get<GroupEntity[]>(GroupModel.cacheAllKey)) ?? [];
  }

  async setAll(groups: GroupEntity[]): Promise<void> {
    await cacheService.set(GroupModel.cacheAllKey, groups);
  }

  async removeAll(): Promise<void> {
    await cacheService.remove(GroupModel.cacheAllKey);
  }
}