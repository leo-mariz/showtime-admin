import { db } from '@/core/services/firebase';
import { getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { EventEntity } from '../../domain/entities/EventEntity';
import { EventModel } from '../models/EventModel';

export interface IEventRemoteDataSource {
  getAll(): Promise<EventEntity[]>;
  getById(uid: string): Promise<EventEntity | null>;
  create(event: EventEntity): Promise<EventEntity>;
  update(uid: string, changes: Partial<EventEntity>): Promise<void>;
  delete(uid: string): Promise<void>;
}

export class EventRemoteDataSource implements IEventRemoteDataSource {
  async getAll(): Promise<EventEntity[]> {
    const ref = EventModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    console.log('[EventRemoteDataSource] Firestore snapshot:', snapshot.docs.map(d => d.data()));
    const events = snapshot.docs.map(docSnap => EventModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
    console.log('[EventRemoteDataSource] events:', events);
    return events;
  }

  async getById(uid: string): Promise<EventEntity | null> {
    const ref = EventModel.docRef(uid, db);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) return null;
    return EventModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() });
  }

  async create(event: EventEntity): Promise<EventEntity> {
    const ref = EventModel.collectionRef(db);
    const docData = EventModel.toFirestore(event);
    const docRef = await addDoc(ref, docData);
    return EventModel.fromFirestore({ uid: docRef.id, ...docData });
  }

  async update(uid: string, changes: Partial<EventEntity>): Promise<void> {
    const ref = EventModel.docRef(uid, db);
    const updateData = EventModel.toFirestore(changes as EventEntity);
    await updateDoc(ref, updateData);
  }

  async delete(uid: string): Promise<void> {
    const ref = EventModel.docRef(uid, db);
    await deleteDoc(ref);
  }
}
