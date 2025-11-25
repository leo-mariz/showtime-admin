import { db } from '@/core/services/firebase';
import { ArtistModel } from '../../models/individual/ArtistModel';
import { ArtistEntity } from '@/core/users/artists/domain/entities/individual/ArtistEntity';
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { DocumentsEntity } from '@/core/users/artists/domain/entities/individual/DocumentsEntity';
import { DocumentsModel } from '../../models/individual/DocumentsModel';

export interface IArtistIndividualRemoteDataSource {
  getById(uid: string): Promise<ArtistEntity | null>;
  getAll(): Promise<ArtistEntity[]>;
  create(uid: string, entity: ArtistEntity): Promise<void>;
  update(uid: string, changes: Partial<ArtistEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
  getDocuments(uid: string): Promise<DocumentsEntity[]>;
  createDocument(uid: string, documentType: string, entity: DocumentsEntity): Promise<void>;
  updateDocument(uid: string, documentType: string, changes: Partial<DocumentsEntity>): Promise<void>;
  deleteDocument(uid: string, documentType: string): Promise<void>;
}

export class ArtistIndividualRemoteDataSource implements IArtistIndividualRemoteDataSource {
  async getById(uid: string): Promise<ArtistEntity | null> {
    const ref = ArtistModel.docRef(uid, db);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return ArtistModel.fromFirestore({ uid: snapshot.id, ...snapshot.data() });
  }

  async getAll(): Promise<ArtistEntity[]> {
    const ref = ArtistModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(docSnap => ArtistModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async create(uid: string, entity: ArtistEntity): Promise<void> {
    const ref = ArtistModel.docRef(uid, db);
    await setDoc(ref, ArtistModel.toFirestore(entity));
  }

  async update(uid: string, changes: Partial<ArtistEntity>): Promise<void> {
    const ref = ArtistModel.docRef(uid, db);
    await updateDoc(ref, changes);
  }

  async delete(uid: string): Promise<void> {
    const ref = ArtistModel.docRef(uid, db);
    await deleteDoc(ref);
  }

  async getDocuments(uid: string): Promise<DocumentsEntity[]> {
    const ref = DocumentsModel.collectionRef(uid, db);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(docSnap => {
      const docType = docSnap.id;
      const data = docSnap.data();
      // Se os dados vierem aninhados sob a chave do tipo:
      const docData = data[docType] ? { ...data[docType], documentType: docType } : { ...data, documentType: docType };
      return DocumentsModel.fromFirestore({ uid: docType, ...docData });
    });
  }

  async createDocument(uid: string, documentType: string, entity: DocumentsEntity): Promise<void> {
    const ref = DocumentsModel.docRef(uid, documentType, db);
    await setDoc(ref, DocumentsModel.toFirestore(entity));
  }

  async updateDocument(uid: string, documentType: string, changes: Partial<DocumentsEntity>): Promise<void> {
    const ref = DocumentsModel.docRef(uid, documentType, db);
    const updateData: Record<string, any> = {};
    for (const [key, value] of Object.entries(changes)) {
      if (value !== undefined) {
        updateData[`${documentType}.${key}`] = value;
      }
    }
    try {
      await updateDoc(ref, updateData);
    } catch (e) {
      throw e;
    }
  }

  async deleteDocument(uid: string, documentType: string): Promise<void> {
    const ref = DocumentsModel.docRef(uid, documentType, db);
    await deleteDoc(ref);
  }
}