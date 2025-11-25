import { PermissionEntity } from '../../domain/entities/PermissionEntity';
import { PermissionModel } from '../models/PermissionModel';
import { ICacheService } from '../../../../core/services/LocalCacheServices';

export interface IPermissionLocalDataSource {
  getAll(): Promise<PermissionEntity[]>;
  saveAll(permissions: PermissionEntity[]): Promise<void>;
  clear(): Promise<void>;
}

export class PermissionLocalDataSource implements IPermissionLocalDataSource {
  private cacheService: ICacheService;

  constructor(cacheService: ICacheService) {
    this.cacheService = cacheService;
  }

  async getAll(): Promise<PermissionEntity[]> {
    const data = await this.cacheService.get<PermissionEntity[]>(PermissionModel.cacheKey);
    if (!data) return [];
    return data.map(item => PermissionModel.fromJson(item));
  }

  async saveAll(permissions: PermissionEntity[]): Promise<void> {
    await this.cacheService.set(PermissionModel.cacheKey, permissions);
  }

  async clear(): Promise<void> {
    await this.cacheService.remove(PermissionModel.cacheKey);
  }
}
