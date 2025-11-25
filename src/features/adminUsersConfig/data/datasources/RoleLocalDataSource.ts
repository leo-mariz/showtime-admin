import { RoleEntity } from '../../domain/entities/RoleEntity';
import { RoleModel } from '../models/RoleModel';
import { ICacheService } from '../../../../core/services/LocalCacheServices';

export interface IRoleLocalDataSource {
  getAll(): Promise<RoleEntity[]>;
  saveAll(roles: RoleEntity[]): Promise<void>;
  clear(): Promise<void>;
}

export class RoleLocalDataSource implements IRoleLocalDataSource {
  private cacheService: ICacheService;

  constructor(cacheService: ICacheService) {
    this.cacheService = cacheService;
  }

  async getAll(): Promise<RoleEntity[]> {
    const data = await this.cacheService.get<RoleEntity[]>(RoleModel.cacheKey);
    if (!data) return [];
    return data.map(item => RoleModel.fromJson(item));
  }

  async saveAll(roles: RoleEntity[]): Promise<void> {
    await this.cacheService.set(RoleModel.cacheKey, roles);
  }

  async clear(): Promise<void> {
    await this.cacheService.remove(RoleModel.cacheKey);
  }
}
