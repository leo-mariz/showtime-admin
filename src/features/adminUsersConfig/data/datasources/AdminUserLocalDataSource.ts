import { AdminUserEntity } from '../../domain/entities/AdminUserEntity';
import { AdminUserModel } from '../models/AdminUserModel';
import { ICacheService } from '../../../../core/services/LocalCacheServices';

export interface IAdminUserLocalDataSource {
  getAll(): Promise<Record<string, AdminUserEntity>>;
  saveAll(adminUsers: Record<string, AdminUserEntity>): Promise<void>;
  update(uid: string, adminUser: Partial<AdminUserEntity>): Promise<void>;
  create(adminUser: AdminUserEntity): Promise<void>;
  delete(uid: string): Promise<void>;
  clear(): Promise<void>;
}

export class AdminUserLocalDataSource implements IAdminUserLocalDataSource {
  private cacheService: ICacheService;
  private cacheKey = AdminUserModel.cacheKey;

  constructor(cacheService: ICacheService) {
    this.cacheService = cacheService;
  }

  async getAll(): Promise<Record<string, AdminUserEntity>> {
    const data = await this.cacheService.get(this.cacheKey);
    if (!data) return {};
    
    // Converte plain objects para instâncias da classe AdminUserEntity
    const result: Record<string, AdminUserEntity> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = AdminUserModel.fromJson(value);
    }
    return result;
  }

  async saveAll(adminUsers: Record<string, AdminUserEntity>): Promise<void> {
    const adminUsersDic = {};
    Object.values(adminUsers).forEach(adminUser => {
      adminUsersDic[adminUser.uid!] = adminUser;
    });
    await this.cacheService.set(this.cacheKey, adminUsersDic);
  }

  async update(uid: string, adminUser: Partial<AdminUserEntity>): Promise<void> {
    const adminUsers = await this.getAll();
    adminUsers[uid] = { ...adminUsers[uid], ...adminUser } as AdminUserEntity;
    await this.saveAll(adminUsers);
  }

  async create(adminUser: AdminUserEntity): Promise<void> {
    const adminUsers = await this.getAll();
    adminUsers[adminUser.uid!] = adminUser;
    await this.saveAll(adminUsers);
  }

  async delete(uid: string): Promise<void> {
    const adminUsers = await this.getAll();
    delete adminUsers[uid];
    await this.saveAll(adminUsers);
  }

  async clear(): Promise<void> {
    await this.cacheService.remove(AdminUserModel.cacheKey);
  }
}
