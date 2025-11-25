import { ClientEntity } from "../entities/ClientEntity";

export interface IClientRepository {
  getById(uid: string): Promise<ClientEntity | null>;
  getAll(): Promise<ClientEntity[]>;
  create(uid: string, entity: ClientEntity): Promise<void>;
  update(uid: string, changes: Partial<ClientEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}