import { AdminUserEntity } from "../entities/AdminUserEntity";

export interface IAdminUserRepository {
  getAll(): Promise<AdminUserEntity[]>;
  getActive(): Promise<AdminUserEntity[]>;
  getById(uid: string): Promise<AdminUserEntity | null>;
  getByEmail(email: string): Promise<AdminUserEntity | null>;
  getByRole(roleId: string): Promise<AdminUserEntity[]>;
  getByCreatedBy(createdBy: string): Promise<AdminUserEntity[]>;
  create(adminUser: AdminUserEntity): Promise<AdminUserEntity>;
  update(uid: string, changes: Partial<AdminUserEntity>): Promise<void>;
  updateLastLogin(uid: string): Promise<void>;
  delete(uid: string): Promise<void>;
}
