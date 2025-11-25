import { EventTypeEntity } from '../../domain/entities/EventTypeEntity';
import { IEventTypeRepository } from '../../domain/repositories/IEventTypeRepository';
import { EventTypeLocalDataSource } from '../datasources/EventTypeLocalDataSource';
import { EventTypeRemoteDataSource } from '../datasources/EventTypeRemoteDataSource';

export class EventTypeRepository implements IEventTypeRepository {
  constructor(
    private local: EventTypeLocalDataSource,
    private remote: EventTypeRemoteDataSource
  ) {}

  async getAll(): Promise<EventTypeEntity[]> {
    // Primeiro tenta buscar localmente
    const localEventTypes = await this.local.getAll();
    if (localEventTypes && localEventTypes.length > 0) {
      console.log("[EventTypeRepository] Retornando tipos do cache local");
      return localEventTypes;
    }

    // Se não houver local, busca remotamente e salva localmente
    console.log("[EventTypeRepository] Buscando tipos remotamente");
    const remoteEventTypes = await this.remote.getAll();
    if (remoteEventTypes && remoteEventTypes.length > 0) {
      await this.local.saveAll(remoteEventTypes);
    }
    return remoteEventTypes;
  }

  async getActive(): Promise<EventTypeEntity[]> {
    const allEventTypes = await this.getAll();
    return allEventTypes.filter(eventType => eventType.active);
  }

  async getById(uid: string): Promise<EventTypeEntity | null> {
    return await this.remote.getById(uid);
  }

  async create(eventType: EventTypeEntity): Promise<EventTypeEntity> {
    const createdEventType = await this.remote.create(eventType);
    // Atualiza o cache local
    await this.refreshCache();
    return createdEventType;
  }

  async update(uid: string, changes: Partial<EventTypeEntity>): Promise<void> {
    await this.remote.update(uid, changes);
    // Atualiza o cache local
    await this.refreshCache();
  }

  async delete(uid: string): Promise<void> {
    await this.remote.delete(uid);
    // Atualiza o cache local
    await this.refreshCache();
  }

  private async refreshCache(): Promise<void> {
    const remoteEventTypes = await this.remote.getAll();
    await this.local.saveAll(remoteEventTypes);
  }
}
