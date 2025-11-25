// src/core/users/data/repositories/UserRepositoryImpl.ts
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IUserRemoteDataSource } from "../datasources/UsersRemoteDataSource";
import { IUserLocalDataSource } from "../datasources/UsersLocalDataSource";
import { UserEntity } from "../../domain/entities/UserEntity";
import { UserAggregatedInfoEntity, UsersCache } from "../../domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { AdminEntity } from "../../admins/domain/entities/AdminEntity";

export class UsersRepository implements IUserRepository {
  constructor(
    private remote: IUserRemoteDataSource,
    private local: IUserLocalDataSource
  ) {}

  async getById(uid: string): Promise<UserEntity | null> {
    // Busca do cache local (agora usando getUserInfo)
    let user = await this.local.getUserInfo(uid);
    if (user) return user;

    // Se não encontrar, busca do remoto e salva no cache
    user = await this.remote.getById(uid);
    if (user) await this.local.setUserInfo(uid, user);
    return user;
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    // Busca direto do remoto (email não está indexado no cache)
    return await this.remote.getByEmail(email);
  }

  async getAll(): Promise<UserEntity[]> {
    // Busca todos do remoto para garantir dados atualizados
    const users = await this.remote.getAll();

    // Atualiza o cache local agregando os userInfo
    const usersCache: UsersCache = await this.local.getAllUsers();
    users.forEach(user => {
      usersCache[user.uid!] = { ...usersCache[user.uid!], userInfo: user };
    });
    await this.local.setAllUsers(usersCache);

    return users;
  }

  async getAllFromCache(): Promise<UserAggregatedInfoEntity[]> {
    const usersCache: UsersCache = await this.local.getAllUsers();
    return Object.values(usersCache);
  }

  async getAdminInfo(): Promise<AdminEntity | undefined> {
    return await this.local.getAdminInfo();
  }
}