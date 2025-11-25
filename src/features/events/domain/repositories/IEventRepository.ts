import { EventEntity } from "../entities/EventEntity";

export interface IEventRepository {
  getAll(): Promise<EventEntity[]>;
  getById(uid: string): Promise<EventEntity | null>;
  create(event: EventEntity): Promise<EventEntity>;
  update(uid: string, changes: Partial<EventEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}
