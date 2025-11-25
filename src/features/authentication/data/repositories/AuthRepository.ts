// src/features/authentication/data/repositories/AuthRepository.ts
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { IAuthRemoteDataSource } from '../datasources/AuthRemoteDataSource';
import { IAuthLocalDataSource } from '../datasources/AuthLocalDataSource';
import { AdminEntity } from '@/core/users/admins/domain/entities/AdminEntity';

export class AuthRepository implements IAuthRepository {
  constructor(
    private remote: IAuthRemoteDataSource,
    private local: IAuthLocalDataSource
  ) {}

  async login(email: string, password: string): Promise<AdminEntity> {
    const loginResult = await this.remote.login(email, password); // lança erro se falhar
    const admin = await this.remote.getAdminByUid(loginResult.uid); // lança erro se não for admin
    await this.local.setAdmin(admin);
    return admin;
  }

  async logout(): Promise<void> {
    await this.remote.logout();
    await this.local.clearCache();
  }
}