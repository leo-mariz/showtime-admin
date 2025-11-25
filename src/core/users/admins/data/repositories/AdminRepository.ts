import { IAdminRepository } from '../../domain/repositories/IAdminRepository';
import { AdminEntity } from '../../domain/entities/AdminEntity';
import { IAdminRemoteDataSource } from '../datasources/AdminRemoteDataSource';
import { IAdminLocalDataSource } from '../datasources/AdminLocalDataSource';

export class AdminRepository implements IAdminRepository {
  constructor(
    private remote: IAdminRemoteDataSource,
    private local: IAdminLocalDataSource
  ) {}

  async getById(uid: string): Promise<AdminEntity | null> {
    // Busca do remoto para garantir dados atualizados
    const admin = await this.remote.getById(uid);
    
    if (admin) {
      // Atualiza o cache local
      await this.local.setAdminInfo(admin);
    }
    
    return admin;
  }

  async getAll(): Promise<AdminEntity[]> {
    // Busca todos do remoto
    return await this.remote.getAll();
  }

  async create(entity: AdminEntity): Promise<void> {
    // Cria no remoto
    await this.remote.create(entity);
  }

  async update(uid: string, changes: Partial<AdminEntity>): Promise<void> {
    // Atualiza no remoto
    await this.remote.update(uid, changes);
    
    // Atualiza no cache local se for o admin logado
    const cachedAdmin = await this.local.getAdminInfo();
    if (cachedAdmin && cachedAdmin.uid === uid) {
      const updatedAdmin = { ...cachedAdmin, ...changes } as AdminEntity;
      await this.local.setAdminInfo(updatedAdmin);
    }
  }

  async delete(uid: string): Promise<void> {
    // Deleta do remoto
    await this.remote.delete(uid);
  }

  async checkEmailExists(email: string): Promise<string | null> {
    // Verifica se o email existe no Firestore
    return await this.remote.checkEmailExists(email);
  }
}

