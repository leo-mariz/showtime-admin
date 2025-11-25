import { RoleEntity } from "../entities/RoleEntity";

export interface IRoleRepository {
  getAll(): Promise<RoleEntity[]>;
  getActive(): Promise<RoleEntity[]>;
  getById(id: string): Promise<RoleEntity | null>;
  getByCreatedBy(createdBy: string): Promise<RoleEntity[]>;
  create(role: RoleEntity): Promise<RoleEntity>;
  update(id: string, changes: Partial<RoleEntity>): Promise<void>;
  delete(id: string): Promise<void>;
  initializeSystemRoles(): Promise<void>;
}
