import { GroupEntity } from "../entities/GroupEntity";

export interface IArtistGroupRepository {
  getById(uid: string): Promise<GroupEntity | null>;
  getAll(): Promise<GroupEntity[]>;
  create(uid: string, entity: GroupEntity): Promise<void>;
  update(uid: string, changes: Partial<GroupEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}
