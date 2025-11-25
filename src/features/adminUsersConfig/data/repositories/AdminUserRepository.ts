import { AdminUserEntity } from '../../domain/entities/AdminUserEntity';
import { IAdminUserRepository } from '../../domain/repositories/IAdminUserRepository';
import { AdminUserLocalDataSource } from '../datasources/AdminUserLocalDataSource';
import { AdminUserRemoteDataSource } from '../datasources/AdminUserRemoteDataSource';

export class AdminUserRepository implements IAdminUserRepository {
  constructor(
    private local: AdminUserLocalDataSource,
    private remote: AdminUserRemoteDataSource
  ) {}

  async getAll(): Promise<AdminUserEntity[]> {
    // Primeiro tenta buscar localmente
    const localAdminUsers = await this.local.getAll();
    if (localAdminUsers && Object.keys(localAdminUsers).length > 0) {
      console.log("[AdminUserRepository] Retornando admins do cache local");
      return Object.values(localAdminUsers);
    }

    // Se não houver local, busca remotamente e salva localmente
    console.log("[AdminUserRepository] Buscando admins remotamente");
    const remoteAdminUsers = await this.remote.getAll();
    if (remoteAdminUsers && remoteAdminUsers.length > 0) {
      const remoteAdminUsersDic: Record<string, AdminUserEntity> = {};
      for (const adminUser of remoteAdminUsers) {
        remoteAdminUsersDic[adminUser.uid!] = adminUser as AdminUserEntity;
      }
      await this.local.saveAll(remoteAdminUsersDic);
    }
    return remoteAdminUsers;
  }

  async getActive(): Promise<AdminUserEntity[]> {
    const allAdminUsers = await this.getAll();
    return allAdminUsers.filter(adminUser => adminUser.isActive);
  }

  async getById(uid: string): Promise<AdminUserEntity | null> {
    return await this.remote.getById(uid);
  }

  async getByEmail(email: string): Promise<AdminUserEntity | null> {
    return await this.remote.getByEmail(email);
  }

  async getByRole(roleId: string): Promise<AdminUserEntity[]> {
    const allAdminUsers = await this.getAll();
    return allAdminUsers.filter(adminUser => adminUser.roleId === roleId);
  }

  async getByCreatedBy(createdBy: string): Promise<AdminUserEntity[]> {
    const allAdminUsers = await this.getAll();
    return allAdminUsers.filter(adminUser => adminUser.createdBy === createdBy);
  }

  async create(adminUser: AdminUserEntity): Promise<AdminUserEntity> {
    // Adiciona metadados de criação
    adminUser.createdAt = new Date();
    const createdAdminUser = await this.remote.create(adminUser);
    await this.local.create(createdAdminUser);
    // Atualiza o cache local

    return createdAdminUser;
  }

  async update(uid: string, changes: Partial<AdminUserEntity>): Promise<void> {
    // Adiciona metadados de atualização
    const updateData = {
      ...changes,
      updatedAt: new Date()
    };
    await this.remote.update(uid, updateData);
    await this.local.update(uid, updateData as AdminUserEntity);
  }

  async updateLastLogin(uid: string): Promise<void> {
    await this.remote.updateLastLogin(uid);
    // Atualiza o cache local
    await this.local.update(uid, { lastLogin: new Date() } as AdminUserEntity);
  }

  async delete(uid: string): Promise<void> {
    await this.remote.delete(uid);
    await this.local.delete(uid);
  }
}
