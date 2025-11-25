import { RoleEntity } from '../../domain/entities/RoleEntity';
import { IRoleRepository } from '../../domain/repositories/IRoleRepository';
import { RoleLocalDataSource } from '../datasources/RoleLocalDataSource';
import { RoleRemoteDataSource } from '../datasources/RoleRemoteDataSource';

export class RoleRepository implements IRoleRepository {
  constructor(
    private local: RoleLocalDataSource,
    private remote: RoleRemoteDataSource
  ) {}

  async getAll(): Promise<RoleEntity[]> {
    // Primeiro tenta buscar localmente
    const localRoles = await this.local.getAll();
    if (localRoles && localRoles.length > 0) {
      console.log("[RoleRepository] Retornando papéis do cache local");
      return localRoles;
    }

    // Se não houver local, busca remotamente e salva localmente
    console.log("[RoleRepository] Buscando papéis remotamente");
    const remoteRoles = await this.remote.getAll();
    if (remoteRoles && remoteRoles.length > 0) {
      await this.local.saveAll(remoteRoles);
    }
    return remoteRoles;
  }

  async getActive(): Promise<RoleEntity[]> {
    const allRoles = await this.getAll();
    return allRoles.filter(role => role.isActive);
  }

  async getById(id: string): Promise<RoleEntity | null> {
    return await this.remote.getById(id);
  }

  async getByCreatedBy(createdBy: string): Promise<RoleEntity[]> {
    const allRoles = await this.getAll();
    return allRoles.filter(role => role.createdBy === createdBy);
  }

  async create(role: RoleEntity): Promise<RoleEntity> {
    // Adiciona metadados de criação
    role.createdAt = new Date();
    const createdRole = await this.remote.create(role);
    // Atualiza o cache local
    await this.refreshCache();
    return createdRole;
  }

  async update(id: string, changes: Partial<RoleEntity>): Promise<void> {
    // Adiciona metadados de atualização
    const updateData = {
      ...changes,
      updatedAt: new Date()
    };
    await this.remote.update(id, updateData);
    // Atualiza o cache local
    await this.refreshCache();
  }

  async delete(id: string): Promise<void> {
    await this.remote.delete(id);
    // Atualiza o cache local
    await this.refreshCache();
  }

  async initializeSystemRoles(): Promise<void> {
    console.log("[RoleRepository] Inicializando papéis do sistema");
    await this.remote.initializeSystemRoles();
    // Atualiza o cache local após inicialização
    await this.refreshCache();
  }

  private async refreshCache(): Promise<void> {
    const remoteRoles = await this.remote.getAll();
    await this.local.saveAll(remoteRoles);
  }
}
