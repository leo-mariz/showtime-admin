import { EventEntity } from '../../domain/entities/EventEntity';
import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { EventLocalDataSource } from '../datasources/EventLocalDataSource';
import { EventRemoteDataSource } from '../datasources/EventRemoteDataSource';

export class EventRepository implements IEventRepository {
  constructor(
    private local: EventLocalDataSource,
    private remote: EventRemoteDataSource
  ) {}

  async getAll(): Promise<EventEntity[]> {
    // Primeiro tenta buscar localmente
    const localEvents = await this.local.getAll();
    if (localEvents && localEvents.length > 0) {
      console.log("[EventRepository] Retornando eventos do cache local");
      return localEvents;
    }

    // Se não houver local, busca remotamente e salva localmente
    console.log("[EventRepository] Buscando eventos remotamente");
    const remoteEvents = await this.remote.getAll();
    if (remoteEvents && remoteEvents.length > 0) {
      await this.local.saveAll(remoteEvents);
    }
    return remoteEvents;
  }

  async getById(uid: string): Promise<EventEntity | null> {
    return await this.remote.getById(uid);
  }

  async create(event: EventEntity): Promise<EventEntity> {
    const createdEvent = await this.remote.create(event);
    // Atualiza o cache local
    await this.refreshCache();
    return createdEvent;
  }

  async update(uid: string, changes: Partial<EventEntity>): Promise<void> {
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
    const remoteEvents = await this.remote.getAll();
    await this.local.saveAll(remoteEvents);
  }
}
