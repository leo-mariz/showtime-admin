// src/core/data/models/DocumentsModel.ts

import { collection, doc, Firestore } from "firebase/firestore";
import { ref as storageRef } from "firebase/storage";
import { db, storage } from "@/core/services/firebase";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { DocumentsEntity } from "@/core/users/artists/domain/entities/individual/DocumentsEntity";

export class DocumentsModel {
  // Firestore
  static collectionPath = (uid: string) => `Artists/${uid}/Documents`;
  static cacheKey = "CACHED_ARTIST_DOCUMENTS";

  static collectionRef(uid: string, dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath(uid));
  }
  static docRef(uid: string, documentType: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath(uid), documentType);
  }

  // Storage
  static storageRoot(uid: string, documentType: string,) {
    return `Artists/${uid}/Documents/${documentType}`;
  }
  static storageRef(uid: string, documentType: string) {
    return storageRef(storage, this.storageRoot(uid, documentType));
  }

  // Conversão
  static fromFirestore(data: any): DocumentsEntity {
    return plainToInstance(DocumentsEntity, data);
  }
  static toFirestore(entity: DocumentsEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): DocumentsEntity {
    return plainToInstance(DocumentsEntity, json);
  }
  static toJson(entity: DocumentsEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: DocumentsEntity, changes: Partial<DocumentsEntity>): DocumentsEntity {
    return new DocumentsEntity(
      changes.documentType ?? entity.documentType,
      changes.documentOption ?? entity.documentOption,
      changes.url ?? entity.url,
      changes.status ?? entity.status,
      changes.observation ?? entity.observation,
      changes.address ?? entity.address,
      changes.idNumber ?? entity.idNumber,
    );
  }

  // Utilitários para tipos e opções de documentos
  static documentTypes(): string[] {
    return ['Identity', 'Residence', 'Curriculum', 'Antecedents'];
  }
  static identityDocumentOptions(): string[] {
    return ['RG', 'CNH'];
  }
  static residenceDocumentOptions(): string[] {
    return ['Conta de Consumo', 'Conta de Telefone', 'Extrato Bancário', 'Outro'];
  }
  static curriculumDocumentOptions(): string[] {
    return ['PDF', 'JPEG', 'PNG'];
  }
  static antecedentsDocumentOptions(): string[] {
    return ['Certidão de Antecedentes Criminais'];
  }
  static documentOptions(): Record<string, string[]> {
    return {
      'Identity': this.identityDocumentOptions(),
      'Residence': this.residenceDocumentOptions(),
      'Curriculum': this.curriculumDocumentOptions(),
      'Antecedents': this.antecedentsDocumentOptions(),
    };
  }
}