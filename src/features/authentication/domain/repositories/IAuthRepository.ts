// src/features/authentication/domain/repositories/IAuthRepository.ts
import { AdminEntity } from '@/core/users/admins/domain/entities/AdminEntity';

export interface IAuthRepository {
  login(email: string, password: string): Promise<AdminEntity | null>;
  logout(): Promise<void>;
}