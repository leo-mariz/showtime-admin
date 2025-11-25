import { ListsEntity } from '../../domain/entities/ListsEntity';
import { ListsModel } from '../models/ListsModel';
import { ICacheService } from '../../../../core/services/LocalCacheServices';

export interface IListsLocalDataSource {
  getAll(): Promise<ListsEntity | null>;
  saveAll(lists: ListsEntity): Promise<void>;
  clear(): Promise<void>;
}

export class ListsLocalDataSource implements IListsLocalDataSource {
  private cacheService: ICacheService;

  constructor(cacheService: ICacheService) {
    this.cacheService = cacheService;
  }

  async getAll(): Promise<ListsEntity | null> {
    const data = await this.cacheService.get(ListsModel.cacheKey);
    if (!data) return null;
    return ListsModel.fromJson(data);
  }

  async saveAll(lists: ListsEntity): Promise<void> {
    await this.cacheService.set(ListsModel.cacheKey, lists);
  }

  async clear(): Promise<void> {
    await this.cacheService.remove(ListsModel.cacheKey);
  }
}
