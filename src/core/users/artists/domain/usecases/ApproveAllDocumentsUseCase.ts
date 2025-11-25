// src/core/users/artists/domain/usecases/ApproveAllDocumentsUseCase.ts

import { DocumentsEntity } from "@/core/users/artists/domain/entities/individual/DocumentsEntity";
import { IArtistIndividualRepository } from "@/core/users/artists/domain/repositories/individual/IArtistIndividualRepository";

export class ApproveAllDocumentsUseCase {
  constructor(private artistRepo: IArtistIndividualRepository) {}

  async execute(uid: string, documents: DocumentsEntity[]): Promise<void> {
    const updatedDocs = documents.map(doc => ({ ...doc, status: 2 }));
    await this.artistRepo.update(uid, { approved: true });
    await this.artistRepo.updateDocuments(uid, updatedDocs);
  } 
}
