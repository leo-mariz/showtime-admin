import { db } from '@/core/services/firebase';
import { getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { RoleEntity } from '../../domain/entities/RoleEntity';
import { RoleModel } from '../models/RoleModel';

export interface IRoleRemoteDataSource {
  getAll(): Promise<RoleEntity[]>;
  getActive(): Promise<RoleEntity[]>;
  getById(id: string): Promise<RoleEntity | null>;
  getByCreatedBy(createdBy: string): Promise<RoleEntity[]>;
  create(role: RoleEntity): Promise<RoleEntity>;
  update(id: string, changes: Partial<RoleEntity>): Promise<void>;
  delete(id: string): Promise<void>;
  initializeSystemRoles(): Promise<void>;
}

export class RoleRemoteDataSource implements IRoleRemoteDataSource {
  async getAll(): Promise<RoleEntity[]> {
    const ref = RoleModel.collectionRef(db);
    const snapshot = await getDocs(ref);
    console.log('[RoleRemoteDataSource] Firestore snapshot:', snapshot.docs.map(d => d.data()));
    const roles = snapshot.docs.map(docSnap => RoleModel.fromFirestore({ id: docSnap.id, ...docSnap.data() }));
    console.log('[RoleRemoteDataSource] roles:', roles);
    return roles;
  }

  async getActive(): Promise<RoleEntity[]> {
    const queryRef = query(
      RoleModel.collectionRef(db),
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => RoleModel.fromFirestore({ id: docSnap.id, ...docSnap.data() }));
  }

  async getById(id: string): Promise<RoleEntity | null> {
    const ref = RoleModel.docRef(id, db);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) return null;
    return RoleModel.fromFirestore({ id: docSnap.id, ...docSnap.data() });
  }

  async getByCreatedBy(createdBy: string): Promise<RoleEntity[]> {
    const queryRef = query(
      RoleModel.collectionRef(db),
      where('createdBy', '==', createdBy)
    );
    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(docSnap => RoleModel.fromFirestore({ id: docSnap.id, ...docSnap.data() }));
  }

  async create(role: RoleEntity): Promise<RoleEntity> {
    const ref = RoleModel.docRef(role.id, db);
    const docData = RoleModel.toFirestore(role);
    await setDoc(ref, docData);
    return RoleModel.fromFirestore({ id: role.id, ...docData });
  }

  async update(id: string, changes: Partial<RoleEntity>): Promise<void> {
    const ref = RoleModel.docRef(id, db);
    const updateData = RoleModel.toFirestore(changes as RoleEntity);
    await updateDoc(ref, updateData);
  }

  async delete(id: string): Promise<void> {
    const ref = RoleModel.docRef(id, db);
    await deleteDoc(ref);
  }

  async initializeSystemRoles(): Promise<void> {
    console.log('[RoleRemoteDataSource] Inicializando papéis do sistema...');
    const systemRoles = RoleModel.getSystemRoles();
    
    for (const role of systemRoles) {
      try {
        const existing = await this.getById(role.id);
        if (!existing) {
          await this.create(role);
          console.log(`[RoleRemoteDataSource] Papel criado: ${role.name}`);
        }
      } catch (error) {
        console.error(`[RoleRemoteDataSource] Erro ao criar papel ${role.id}:`, error);
      }
    }
  }
}
