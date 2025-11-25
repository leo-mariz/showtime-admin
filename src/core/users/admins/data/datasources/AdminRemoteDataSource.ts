import { db } from '@/core/services/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { AdminEntity } from '../../domain/entities/AdminEntity';
import { AdminModel } from '../models/AdminModel';

export interface IAdminRemoteDataSource {
  getById(uid: string): Promise<AdminEntity | null>;
  getAll(): Promise<AdminEntity[]>;
  create(entity: AdminEntity): Promise<void>;
  update(uid: string, changes: Partial<AdminEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
  checkEmailExists(email: string): Promise<string | null>;
}

export class AdminRemoteDataSource implements IAdminRemoteDataSource {
  async getById(uid: string): Promise<AdminEntity | null> {
    const docRef = AdminModel.docRef(uid, db);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return AdminModel.fromFirestore({ uid: snapshot.id, ...snapshot.data() });
  }

  async getAll(): Promise<AdminEntity[]> {
    const collectionRef = AdminModel.collectionRef(db);
    const snapshot = await getDocs(collectionRef);
    
    return snapshot.docs.map(doc => 
      AdminModel.fromFirestore({ uid: doc.id, ...doc.data() })
    );
  }

  async create(entity: AdminEntity): Promise<void> {
    const docRef = AdminModel.docRef(entity.uid, db);
    await setDoc(docRef, AdminModel.toFirestore(entity));
  }

  async update(uid: string, changes: Partial<AdminEntity>): Promise<void> {
    const docRef = AdminModel.docRef(uid, db);
    await updateDoc(docRef, changes as any);
  }

  async delete(uid: string): Promise<void> {
    const docRef = AdminModel.docRef(uid, db);
    await deleteDoc(docRef);
  }

  async checkEmailExists(email: string): Promise<string | null> {
    const collectionRef = AdminModel.collectionRef(db);
    const q = query(collectionRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs[0].id; // Retorna o uid do primeiro documento encontrado
  }
}

