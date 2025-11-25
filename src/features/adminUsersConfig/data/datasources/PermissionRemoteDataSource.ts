import { db } from '@/core/services/firebase';
import { getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { PermissionEntity } from '../../domain/entities/PermissionEntity';
import { PermissionModel } from '../models/PermissionModel';

export interface IPermissionRemoteDataSource {
  getAll(): Promise<PermissionEntity[]>;
  getActive(): Promise<PermissionEntity[]>;
  getById(id: string): Promise<PermissionEntity | null>;
  getBySection(section: string): Promise<PermissionEntity[]>;
  create(permission: PermissionEntity): Promise<PermissionEntity>;
  update(id: string, changes: Partial<PermissionEntity>): Promise<void>;
  delete(id: string): Promise<void>;
  initializeSystemPermissions(): Promise<void>;
}

export class PermissionRemoteDataSource implements IPermissionRemoteDataSource {
  async getAll(): Promise<PermissionEntity[]> {
    const ref = PermissionModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    console.log('[PermissionRemoteDataSource] Firestore snapshot:', snapshot.docs.map(d => d.data()));
    const permissions = snapshot.docs.map(docSnap => PermissionModel.fromFirestore({ id: docSnap.id, ...docSnap.data() }));
    console.log('[PermissionRemoteDataSource] permissions:', permissions);
    return permissions;
  }

  async getActive(): Promise<PermissionEntity[]> {
    const queryRef = query(
      PermissionModel.collectionRef(db),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => PermissionModel.fromFirestore({ id: docSnap.id, ...docSnap.data() }));
  }

  async getById(id: string): Promise<PermissionEntity | null> {
    const ref = PermissionModel.docRef(id, db);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) return null;
    return PermissionModel.fromFirestore({ id: docSnap.id, ...docSnap.data() });
  }

  async getBySection(section: string): Promise<PermissionEntity[]> {
    const queryRef = query(
      PermissionModel.collectionRef(db),
      where('section', '==', section),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => PermissionModel.fromFirestore({ id: docSnap.id, ...docSnap.data() }));
  }

  async create(permission: PermissionEntity): Promise<PermissionEntity> {
    const ref = PermissionModel.docRef(permission.id, db);
    const docData = PermissionModel.toFirestore(permission);
    await setDoc(ref, docData);
    return PermissionModel.fromFirestore({ id: permission.id, ...docData });
  }

  async update(id: string, changes: Partial<PermissionEntity>): Promise<void> {
    const ref = PermissionModel.docRef(id, db);
    const updateData = PermissionModel.toFirestore(changes as PermissionEntity);
    await updateDoc(ref, updateData);
  }

  async delete(id: string): Promise<void> {
    const ref = PermissionModel.docRef(id, db);
    await deleteDoc(ref);
  }

  async initializeSystemPermissions(): Promise<void> {
    console.log('[PermissionRemoteDataSource] Inicializando permissões do sistema...');
    const systemPermissions = PermissionModel.getSystemPermissions();
    
    for (const permission of systemPermissions) {
      try {
        const existing = await this.getById(permission.id);
        if (!existing) {
          await this.create(permission);
          console.log(`[PermissionRemoteDataSource] Permissão criada: ${permission.name}`);
        }
      } catch (error) {
        console.error(`[PermissionRemoteDataSource] Erro ao criar permissão ${permission.id}:`, error);
      }
    }
  }
}
