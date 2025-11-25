import { EventEntity } from '../../domain/entities/EventEntity';
import { EventModel } from '../models/EventModel';
import { ICacheService } from '../../../../core/services/LocalCacheServices';

export interface IEventLocalDataSource {
  getAll(): Promise<EventEntity[]>;
  saveAll(events: EventEntity[]): Promise<void>;
  clear(): Promise<void>;
}

export class EventLocalDataSource implements IEventLocalDataSource {
  private cacheService: ICacheService;

  constructor(cacheService: ICacheService) {
    this.cacheService = cacheService;
  }

  async getAll(): Promise<EventEntity[]> {
    const data = await this.cacheService.get<EventEntity[]>(EventModel.cacheKey);
    if (!data) return [];
    return data.map(item => EventModel.fromJson(item));
  }

  async saveAll(events: EventEntity[]): Promise<void> {
    await this.cacheService.set(EventModel.cacheKey, events);
  }

  async clear(): Promise<void> {
    await this.cacheService.remove(EventModel.cacheKey);
  }
}
