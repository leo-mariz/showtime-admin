import { db } from '../../../../services/firebase';
import { ClientModel } from '../models/ClientModel';
import { ClientEntity } from '../../domain/entities/ClientEntity';
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface IClientRemoteDataSource {
  getById(uid: string): Promise<ClientEntity | null>;
  getAll(): Promise<ClientEntity[]>;
  create(uid: string, entity: ClientEntity): Promise<void>;
  update(uid: string, changes: Partial<ClientEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}


export class ClientRemoteDataSource implements IClientRemoteDataSource {
  async getById(uid: string): Promise<ClientEntity | null> {
    const ref = ClientModel.docRef(uid, db);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return ClientModel.fromFirestore({ uid: snapshot.id, ...snapshot.data() });
  }

  async getAll(): Promise<ClientEntity[]> {
    const ref = ClientModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(docSnap => ClientModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async create(uid: string, entity: ClientEntity): Promise<void> {
    const ref = ClientModel.docRef(uid, db);
    await setDoc(ref, ClientModel.toFirestore(entity));
  }

  async update(uid: string, changes: Partial<ClientEntity>): Promise<void> {
    const ref = ClientModel.docRef(uid, db);
    await updateDoc(ref, changes);
  }

  async delete(uid: string): Promise<void> {
    const ref = ClientModel.docRef(uid, db);
    await deleteDoc(ref);
  }
}