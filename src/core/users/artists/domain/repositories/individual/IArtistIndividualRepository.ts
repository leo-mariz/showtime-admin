// src/features/artists/individual/domain/repositories/IArtistIndividualRepository.ts
import { ArtistEntity } from '@/core/users/artists/domain/entities/individual/ArtistEntity';
import { DocumentsEntity } from '@/core/users/artists/domain/entities/individual/DocumentsEntity';

export interface IArtistIndividualRepository {
  getById(uid: string): Promise<ArtistEntity | null>;
  getAll(): Promise<ArtistEntity[]>;
  create(uid: string, entity: ArtistEntity): Promise<void>;
  update(uid: string, changes: Partial<ArtistEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
  getDocuments(uid: string): Promise<DocumentsEntity[]>;
  updateDocuments(uid: string, changes: Partial<DocumentsEntity[]>): Promise<void>;
}