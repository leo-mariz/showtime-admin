import { ListsEntity } from '../entities/ListsEntity';

export interface IListsRepository {
  getAll(): Promise<ListsEntity | null>;
  updateAll(changes: Partial<ListsEntity>): Promise<void>;
}

