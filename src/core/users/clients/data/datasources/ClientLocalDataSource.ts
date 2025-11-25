import { cacheService } from '@/core/services/LocalCacheServices';
import { UserModel } from '@/core/users/data/models/UserModel';
import { ClientEntity } from '../../domain/entities/ClientEntity';

export interface IClientLocalDataSource {
  getClientInfo(uid: string): Promise<ClientEntity | undefined>;
  setClientInfo(uid: string, clientInfo: ClientEntity): Promise<void>;
  removeClientInfo(uid: string): Promise<void>;
}

export class ClientLocalDataSource implements IClientLocalDataSource {
  private cacheKey = UserModel.cacheKey;

  async getClientInfo(uid: string): Promise<ClientEntity | undefined> {
    const users = (await cacheService.get<any>(this.cacheKey)) ?? {};
    return users[uid]?.clientInfo;
  }

  async setClientInfo(uid: string, clientInfo: ClientEntity): Promise<void> {
    const users = (await cacheService.get<any>(this.cacheKey)) ?? {};
    users[uid] = { ...users[uid], clientInfo };
    await cacheService.set(this.cacheKey, users);
  }

  async removeClientInfo(uid: string): Promise<void> {
    const users = (await cacheService.get<any>(this.cacheKey)) ?? {};
    if (users[uid]) {
      delete users[uid].clientInfo;
      await cacheService.set(this.cacheKey, users);
    }
  }
}