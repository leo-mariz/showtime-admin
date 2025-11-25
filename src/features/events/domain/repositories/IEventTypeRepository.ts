import { EventTypeEntity } from "../entities/EventTypeEntity";

export interface IEventTypeRepository {
  getAll(): Promise<EventTypeEntity[]>;
  getActive(): Promise<EventTypeEntity[]>;
  getById(uid: string): Promise<EventTypeEntity | null>;
  create(eventType: EventTypeEntity): Promise<EventTypeEntity>;
  update(uid: string, changes: Partial<EventTypeEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}
