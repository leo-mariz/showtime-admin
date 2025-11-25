import { EventTypeEntity } from '../../domain/entities/EventTypeEntity';
import { EventTypeModel } from '../models/EventTypeModel';
import { ICacheService } from '../../../../core/services/LocalCacheServices';

export interface IEventTypeLocalDataSource {
  getAll(): Promise<EventTypeEntity[]>;
  saveAll(eventTypes: EventTypeEntity[]): Promise<void>;
  clear(): Promise<void>;
}

export class EventTypeLocalDataSource implements IEventTypeLocalDataSource {
  private cacheService: ICacheService;

  constructor(cacheService: ICacheService) {
    this.cacheService = cacheService;
  }

  async getAll(): Promise<EventTypeEntity[]> {
    const data = await this.cacheService.get<EventTypeEntity[]>(EventTypeModel.cacheKey);
    if (!data) return [];
    return data.map(item => EventTypeModel.fromJson(item));
  }

  async saveAll(eventTypes: EventTypeEntity[]): Promise<void> {
    await this.cacheService.set(EventTypeModel.cacheKey, eventTypes);
  }

  async clear(): Promise<void> {
    await this.cacheService.remove(EventTypeModel.cacheKey);
  }
}
