import { db } from '@/core/services/firebase';
import { GroupModel } from '../../models/groups/GroupModel';
import { GroupEntity } from '../../../domain/repositories/groups/entities/GroupEntity';
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface IArtistGroupRemoteDataSource {
  getById(uid: string): Promise<GroupEntity | null>;
  getAll(): Promise<GroupEntity[]>;
  create(uid: string, entity: GroupEntity): Promise<void>;
  update(uid: string, changes: Partial<GroupEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}

export class ArtistGroupRemoteDataSource implements IArtistGroupRemoteDataSource {
  async getById(uid: string): Promise<GroupEntity | null> {
    const ref = GroupModel.docRef(uid, db);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;
    return GroupModel.fromFirestore({ uid: snapshot.id, ...snapshot.data() });
  }

  async getAll(): Promise<GroupEntity[]> {
    const ref = GroupModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(docSnap => GroupModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async create(uid: string, entity: GroupEntity): Promise<void> {
    const ref = GroupModel.docRef(uid, db);
    await setDoc(ref, GroupModel.toFirestore(entity));
  }

  async update(uid: string, changes: Partial<GroupEntity>): Promise<void> {
    const ref = GroupModel.docRef(uid, db);
    await updateDoc(ref, changes);
  }

  async delete(uid: string): Promise<void> {
    const ref = GroupModel.docRef(uid, db);
    await deleteDoc(ref);
  }
}