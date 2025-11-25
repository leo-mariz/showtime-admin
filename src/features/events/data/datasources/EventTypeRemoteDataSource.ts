import { db } from '@/core/services/firebase';
import { getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { EventTypeEntity } from '../../domain/entities/EventTypeEntity';
import { EventTypeModel } from '../models/EventTypeModel';

export interface IEventTypeRemoteDataSource {
  getAll(): Promise<EventTypeEntity[]>;
  getActive(): Promise<EventTypeEntity[]>;
  getById(uid: string): Promise<EventTypeEntity | null>;
  create(eventType: EventTypeEntity): Promise<EventTypeEntity>;
  update(uid: string, changes: Partial<EventTypeEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}

export class EventTypeRemoteDataSource implements IEventTypeRemoteDataSource {
  async getAll(): Promise<EventTypeEntity[]> {
    const ref = EventTypeModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(docSnap => EventTypeModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async getActive(): Promise<EventTypeEntity[]> {
    const query = EventTypeModel.activeEventTypesQuery(db);
    const snapshot = await getDocs(query);
    return snapshot.docs.map(docSnap => EventTypeModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async getById(uid: string): Promise<EventTypeEntity | null> {
    const ref = EventTypeModel.docRef(uid, db);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) return null;
    return EventTypeModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() });
  }

  async create(eventType: EventTypeEntity): Promise<EventTypeEntity> {
    const ref = EventTypeModel.collectionRef(db);
    const docData = EventTypeModel.toFirestore(eventType);
    const docRef = await addDoc(ref, docData);
    return EventTypeModel.fromFirestore({ uid: docRef.id, ...docData });
  }

  async update(uid: string, changes: Partial<EventTypeEntity>): Promise<void> {
    const ref = EventTypeModel.docRef(uid, db);
    const updateData = EventTypeModel.toFirestore(changes as EventTypeEntity);
    await updateDoc(ref, updateData);
  }

  async delete(uid: string): Promise<void> {
    const ref = EventTypeModel.docRef(uid, db);
    await deleteDoc(ref);
  }
}
