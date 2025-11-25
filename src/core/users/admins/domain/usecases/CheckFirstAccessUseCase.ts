import { IAdminRepository } from '../repositories/IAdminRepository';

export class CheckFirstAccessUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(uid: string): Promise<boolean> {
    const admin = await this.adminRepository.getById(uid);
    
    if (!admin) {
      throw new Error('Admin não encontrado');
    }
    
    return admin.isFirstAccess;
  }
}

