import { db } from '@/core/services/firebase';
import { updateDoc, getDocs } from 'firebase/firestore';
import { ListsEntity } from '../../domain/entities/ListsEntity';
import { ListsModel } from '../models/ListsModel';

export interface IListsRemoteDataSource {
  getAll(): Promise<ListsEntity[]>;
  updateAll(changes: Partial<ListsEntity>): Promise<void>;
}

export class ListsRemoteDataSource implements IListsRemoteDataSource {
  async getAll(): Promise<ListsEntity[]> {
    const ref = ListsModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    console.log('[ListsRemoteDataSource] Firestore snapshot:', snapshot.docs.map(d => d.data()));
    const lists = snapshot.docs.map(docSnap => ListsModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
    console.log('[ListsRemoteDataSource] lists:', lists);
    return lists;
  }

  async updateAll(changes: Partial<ListsEntity>): Promise<void> {
    const ref = ListsModel.docRef(ListsModel.docUid, db);
    await updateDoc(ref, changes);
  }
}