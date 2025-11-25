import { db } from '@/core/services/firebase';
import { getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { AdminUserEntity } from '../../domain/entities/AdminUserEntity';
import { AdminUserModel } from '../models/AdminUserModel';

export interface IAdminUserRemoteDataSource {
  getAll(): Promise<AdminUserEntity[]>;
  getActive(): Promise<AdminUserEntity[]>;
  getById(uid: string): Promise<AdminUserEntity | null>;
  getByEmail(email: string): Promise<AdminUserEntity | null>;
  getByRole(roleId: string): Promise<AdminUserEntity[]>;
  getByCreatedBy(createdBy: string): Promise<AdminUserEntity[]>;
  create(adminUser: AdminUserEntity): Promise<AdminUserEntity>;
  update(uid: string, changes: Partial<AdminUserEntity>): Promise<void>;
  updateLastLogin(uid: string): Promise<void>;
  delete(uid: string): Promise<void>;
}

export class AdminUserRemoteDataSource implements IAdminUserRemoteDataSource {
  async getAll(): Promise<AdminUserEntity[]> {
    const ref = AdminUserModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    console.log('[AdminUserRemoteDataSource] Firestore snapshot:', snapshot.docs.map(d => d.data()));
    const adminUsers = snapshot.docs.map(docSnap => AdminUserModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
    console.log('[AdminUserRemoteDataSource] adminUsers:', adminUsers);
    return adminUsers;
  }

  async getActive(): Promise<AdminUserEntity[]> {
    const queryRef = query(
      AdminUserModel.collectionRef(db),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => AdminUserModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async getById(uid: string): Promise<AdminUserEntity | null> {
    const ref = AdminUserModel.docRef(uid, db);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) return null;
    return AdminUserModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() });
  }

  async getByEmail(email: string): Promise<AdminUserEntity | null> {
    const queryRef = query(
      AdminUserModel.collectionRef(db),
      where('email', '==', email)
    );
    const snapshot = await getDocs(queryRef);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return AdminUserModel.fromFirestore({ uid: doc.id, ...doc.data() });
  }

  async getByRole(roleId: string): Promise<AdminUserEntity[]> {
    const queryRef = query(
      AdminUserModel.collectionRef(db),
      where('roleId', '==', roleId)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => AdminUserModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async getByCreatedBy(createdBy: string): Promise<AdminUserEntity[]> {
    const queryRef = query(
      AdminUserModel.collectionRef(db),
      where('createdBy', '==', createdBy)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => AdminUserModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() }));
  }

  async create(adminUser: AdminUserEntity): Promise<AdminUserEntity> {
    const ref = AdminUserModel.docRef(adminUser.uid, db);
    const docData = AdminUserModel.toFirestore(adminUser);
    await setDoc(ref, docData);
    return AdminUserModel.fromFirestore({ uid: adminUser.uid, ...docData });
  }

  async update(uid: string, changes: Partial<AdminUserEntity>): Promise<void> {
    const ref = AdminUserModel.docRef(uid, db);
    const updateData = AdminUserModel.toFirestore(changes as AdminUserEntity);
    await updateDoc(ref, updateData);
  }

  async updateLastLogin(uid: string): Promise<void> {
    const ref = AdminUserModel.docRef(uid, db);
    await updateDoc(ref, { lastLogin: new Date() });
  }

  async delete(uid: string): Promise<void> {
    const ref = AdminUserModel.docRef(uid, db);
    await deleteDoc(ref);
  }
}
