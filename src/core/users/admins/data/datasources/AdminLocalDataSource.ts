import { AdminEntity } from '../../domain/entities/AdminEntity';
import { AdminModel } from '../models/AdminModel';

export interface IAdminLocalDataSource {
  getAdminInfo(): Promise<AdminEntity | null>;
  setAdminInfo(admin: AdminEntity): Promise<void>;
  removeAdminInfo(): Promise<void>;
}

export class AdminLocalDataSource implements IAdminLocalDataSource {
  async getAdminInfo(): Promise<AdminEntity | null> {
    const cached = localStorage.getItem(AdminModel.cacheKey);
    if (!cached) return null;
    
    try {
      const parsed = JSON.parse(cached);
      return AdminModel.fromJson(parsed);
    } catch {
      return null;
    }
  }

  async setAdminInfo(admin: AdminEntity): Promise<void> {
    localStorage.setItem(AdminModel.cacheKey, JSON.stringify(AdminModel.toJson(admin)));
  }

  async removeAdminInfo(): Promise<void> {
    localStorage.removeItem(AdminModel.cacheKey);
  }
}

