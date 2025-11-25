import { PermissionEntity } from '../../domain/entities/PermissionEntity';
import { IPermissionRepository } from '../../domain/repositories/IPermissionRepository';
import { PermissionLocalDataSource } from '../datasources/PermissionLocalDataSource';
import { PermissionRemoteDataSource } from '../datasources/PermissionRemoteDataSource';

export class PermissionRepository implements IPermissionRepository {
  constructor(
    private local: PermissionLocalDataSource,
    private remote: PermissionRemoteDataSource
  ) {}

  async getAll(): Promise<PermissionEntity[]> {
    // Primeiro tenta buscar localmente
    const localPermissions = await this.local.getAll();
    if (localPermissions && localPermissions.length > 0) {
      console.log("[PermissionRepository] Retornando permissões do cache local");
      return localPermissions;
    }

    // Se não houver local, busca remotamente e salva localmente
    console.log("[PermissionRepository] Buscando permissões remotamente");
    const remotePermissions = await this.remote.getAll();
    if (remotePermissions && remotePermissions.length > 0) {
      await this.local.saveAll(remotePermissions);
    }
    return remotePermissions;
  }

  async getActive(): Promise<PermissionEntity[]> {
    const allPermissions = await this.getAll();
    return allPermissions.filter(permission => permission.isActive);
  }

  async getById(id: string): Promise<PermissionEntity | null> {
    return await this.remote.getById(id);
  }

  async getBySection(section: string): Promise<PermissionEntity[]> {
    const allPermissions = await this.getAll();
    return allPermissions.filter(permission => permission.section === section && permission.isActive);
  }

  async create(permission: PermissionEntity): Promise<PermissionEntity> {
    const createdPermission = await this.remote.create(permission);
    // Atualiza o cache local
    await this.refreshCache();
    return createdPermission;
  }

  async update(id: string, changes: Partial<PermissionEntity>): Promise<void> {
    await this.remote.update(id, changes);
    // Atualiza o cache local
    await this.refreshCache();
  }

  async delete(id: string): Promise<void> {
    await this.remote.delete(id);
    // Atualiza o cache local
    await this.refreshCache();
  }

  async initializeSystemPermissions(): Promise<void> {
    console.log("[PermissionRepository] Inicializando permissões do sistema");
    await this.remote.initializeSystemPermissions();
    // Atualiza o cache local após inicialização
    await this.refreshCache();
  }

  private async refreshCache(): Promise<void> {
    const remotePermissions = await this.remote.getAll();
    await this.local.saveAll(remotePermissions);
  }
}
