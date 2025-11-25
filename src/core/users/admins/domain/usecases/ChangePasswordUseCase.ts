import { IAdminRepository } from '../repositories/IAdminRepository';
import { IAuthService } from '@/core/services/AuthServices';

export class ChangePasswordUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private authService: IAuthService
  ) {}

  async execute(uid: string, newPassword: string): Promise<void> {
    // 1. Alterar senha no Firebase Auth
    await this.authService.changePassword(newPassword);
    
    // 2. Atualizar isFirstAccess para false no Firestore
    await this.adminRepository.update(uid, { isFirstAccess: false });
  }
}

