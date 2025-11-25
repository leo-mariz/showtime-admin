import { PermissionEntity } from "../entities/PermissionEntity";

export interface IPermissionRepository {
  getAll(): Promise<PermissionEntity[]>;
  getActive(): Promise<PermissionEntity[]>;
  getById(id: string): Promise<PermissionEntity | null>;
  getBySection(section: string): Promise<PermissionEntity[]>;
  create(permission: PermissionEntity): Promise<PermissionEntity>;
  update(id: string, changes: Partial<PermissionEntity>): Promise<void>;
  delete(id: string): Promise<void>;
  initializeSystemPermissions(): Promise<void>;
}
