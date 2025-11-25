import { cacheService } from '@/core/services/LocalCacheServices';
import { UserModel } from '@/core/users/data/models/UserModel';
import { ArtistWithDocumentsEntity } from '@/core/users/artists/domain/entities/ArtistAllInfosEntity';
import { DocumentsEntity } from '../../../domain/entities/individual/DocumentsEntity';

export interface IArtistIndividualLocalDataSource {
  getArtistInfo(uid: string): Promise<ArtistWithDocumentsEntity | undefined>;
  setArtistInfo(uid: string, artistInfo: ArtistWithDocumentsEntity): Promise<void>;
  removeArtistInfo(uid: string): Promise<void>;
}

export class ArtistIndividualLocalDataSource implements IArtistIndividualLocalDataSource {
  private cacheKey = UserModel.cacheKey;

  async getArtistInfo(uid: string): Promise<ArtistWithDocumentsEntity | undefined> {
    const users = (await cacheService.get<any>(this.cacheKey)) ?? {};
    return users[uid]?.artistInfo;
  }

  async setArtistInfo(uid: string, artistInfo: ArtistWithDocumentsEntity): Promise<void> {
    const users = (await cacheService.get<any>(this.cacheKey)) ?? {};
    users[uid] = { ...users[uid], artistInfo };
    await cacheService.set(this.cacheKey, users);
  }

  async removeArtistInfo(uid: string): Promise<void> {
    const users = (await cacheService.get<any>(this.cacheKey)) ?? {};
    if (users[uid]) {
      delete users[uid].artistInfo;
      await cacheService.set(this.cacheKey, users);
    }
  }
}