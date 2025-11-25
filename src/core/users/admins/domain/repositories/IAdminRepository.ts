import { AdminEntity } from "../entities/AdminEntity";

export interface IAdminRepository {
  getById(uid: string): Promise<AdminEntity | null>;
  getAll(): Promise<AdminEntity[]>;
  create(entity: AdminEntity): Promise<void>;
  update(uid: string, changes: Partial<AdminEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
  checkEmailExists(email: string): Promise<string | null>; // Retorna uid se existir, null caso contrário
}

