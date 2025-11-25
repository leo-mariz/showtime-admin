import { DocumentsEntity } from "@/core/users/artists/domain/entities/individual/DocumentsEntity";
import { IArtistIndividualRepository } from "@/core/users/artists/domain/repositories/individual/IArtistIndividualRepository";
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { storage } from '@/core/services/firebase';
import { DocumentsModel } from "../../data/models/individual/DocumentsModel";

function deleteWithTimeout(ref, ms = 3000) {
  return Promise.race([
    deleteObject(ref),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout ao deletar do storage')), ms))
  ]);
}

function extractFileNameFromUrl(url: string): string | null {
  try {
    const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
    const parts = path.split('/');
    return parts[parts.length - 1];
  } catch {
    return null;
  }
}


export class RejectSelectedDocumentsUseCase {
  constructor(private artistRepo: IArtistIndividualRepository) {}

  /**
   * @param uid UID do artista
   * @param documents Lista de documentos do artista
   * @param rejectedTypes Lista dos tipos de documentos rejeitados
   * @param observations Mapa de observações por tipo de documento rejeitado
   */
  async execute(
    uid: string,
    documents: DocumentsEntity[],
    rejectedTypes: string[],
    observations: Record<string, string>
  ): Promise<void> {
    // Atualiza status e observação conforme seleção
    const updatedDocs = await Promise.all(documents.map(async doc => {
      if (rejectedTypes.includes(doc.documentType)) {
          const fileName = extractFileNameFromUrl(doc.url);
          if (fileName) {
            const fileRef = DocumentsModel.storageRef(uid, doc.documentType + '/' + fileName);
            await deleteWithTimeout(fileRef);
          } 
        return ({ ...doc, status: 3, observation: observations[doc.documentType], url: null });
      }
    }));
    await this.artistRepo.updateDocuments(uid, updatedDocs);
  }
} 