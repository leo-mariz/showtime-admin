import { IArtistIndividualRepository } from '../../../domain/repositories/individual/IArtistIndividualRepository';
import { IArtistIndividualRemoteDataSource } from '../../datasources/individual/ArtistIndividualRemoteDataSource';
import { IArtistIndividualLocalDataSource } from '../../datasources/individual/ArtistIndividualLocalDataSource';
import { ArtistWithDocumentsEntity } from '@/core/users/artists/domain/entities/ArtistAllInfosEntity';
import { DocumentsEntity } from '@/core/users/artists/domain/entities/individual/DocumentsEntity';

export class ArtistIndividualRepository implements IArtistIndividualRepository {
  constructor(
    private remote: IArtistIndividualRemoteDataSource,
    private local: IArtistIndividualLocalDataSource
  ) {}

  async getById(uid: string): Promise<ArtistWithDocumentsEntity | null> {
    // Busca do remoto para garantir dados atualizados
    const remoteArtist = await this.remote.getById(uid);
    if (!remoteArtist) return null;

    // Busca e acopla os documentos
    const documents = await this.remote.getDocuments(uid);
    const artistWithDocs: ArtistWithDocumentsEntity = { ...remoteArtist, documents };

    // Atualiza o cache local centralizado
    await this.local.setArtistInfo(uid, artistWithDocs);

    return artistWithDocs;
  }

  async getAll(): Promise<ArtistWithDocumentsEntity[]> {
    // Busca todos do remoto
    const artists = await this.remote.getAll();

    // Para cada artista, busca e acopla os documentos
    const artistsWithDocs = await Promise.all(
      artists.map(async artist => {
        const documents = await this.remote.getDocuments(artist.uid!);
        return { ...artist, documents };
      })
    );

    // Atualiza o cache local centralizado
    for (const artist of artistsWithDocs) {
      await this.local.setArtistInfo(artist.uid!, artist);
    }

    return artistsWithDocs;
  }

  async create(uid: string, entity: ArtistWithDocumentsEntity): Promise<void> {
    await this.remote.create(uid, entity);
    await this.local.setArtistInfo(uid, entity);
  }

  async update(uid: string, changes: Partial<ArtistWithDocumentsEntity>): Promise<void> {
    await this.remote.update(uid, changes);
      
    // Atualiza apenas o campo artistInfo no cache local
    const cached = await this.local.getArtistInfo(uid);
    if (cached) {
      const updated = { ...cached, ...changes };
      await this.local.setArtistInfo(uid, updated);
    }
  }

  async delete(uid: string): Promise<void> {
    await this.remote.delete(uid);
    await this.local.removeArtistInfo(uid);
  }

  async getDocuments(uid: string): Promise<DocumentsEntity[]> {
    const documents = await this.remote.getDocuments(uid);
    const cached = await this.local.getArtistInfo(uid);
    if (cached) {
      const updated = { ...cached, documents };
      await this.local.setArtistInfo(uid, updated);
    }
    return documents;
  }

  async updateDocuments(uid: string, changes: Partial<DocumentsEntity[]>): Promise<void> {
    for (const doc of changes) {
      await this.remote.updateDocument(uid, doc.documentType, doc);
    }
    const cached = await this.local.getArtistInfo(uid);
    if (cached) {
      const updated = { ...cached, documents: changes };
      await this.local.setArtistInfo(uid, updated);
    }
  }
}