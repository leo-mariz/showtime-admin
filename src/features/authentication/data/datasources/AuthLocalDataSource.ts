import { cacheService } from '@/core/services/LocalCacheServices';
import { AdminModel } from '@/core/users/admins/data/models/AdminModel';
import { AdminEntity } from '@/core/users/admins/domain/entities/AdminEntity';


export interface IAuthLocalDataSource {
  getAdmin(): Promise<AdminEntity | null>;
  setAdmin(admin: AdminEntity): Promise<void>;
  clearCache(): Promise<void>;
}

export class AuthLocalDataSource implements IAuthLocalDataSource {
    async getAdmin(): Promise<AdminEntity | null> {
      return await cacheService.get<AdminEntity>(AdminModel.cacheKey);
    }
  
    async setAdmin(admin: AdminEntity): Promise<void> {
      await cacheService.set(AdminModel.cacheKey, admin);
    }

    async clearCache(): Promise<void> {
      await cacheService.clear();
    }
  }