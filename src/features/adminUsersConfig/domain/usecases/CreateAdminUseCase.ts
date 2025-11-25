import { IAdminRepository } from '../../../../core/users/admins/domain/repositories/IAdminRepository';
import { AdminEntity } from '../../../../core/users/admins/domain/entities/AdminEntity';
import { IAuthService } from '@/core/services/AuthServices';
import { IEmailService } from '@/core/services/EmailServices';
import { EmailEntity } from '@/features/support/domain/entities/EmailEntity';
import { IUserRepository } from '@/core/users/domain/repositories/IUserRepository';

export interface CreateAdminInput {
  email: string;
  name: string;
  roleId: string;
}

export interface CreateAdminOutput {
  admin: AdminEntity;
  tempPassword: string | null; // null se o usuário já existia
  wasCreated: boolean; // true se criou novo usuário no Firebase Auth
}

export class CreateAdminUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private authService: IAuthService,
    private emailService: IEmailService,
    private userRepository: IUserRepository,
  ) {}

  async execute(input: CreateAdminInput): Promise<CreateAdminOutput> {
    // 1. Verificar se já existe um admin com esse email no Firestore
    const existingAdminUid = await this.adminRepository.checkEmailExists(input.email);
    
    if (existingAdminUid) {
      throw new Error('Já existe um admin cadastrado com este email.');
    }

    // 2. Tentar criar usuário no Firebase Auth
    let uid: string;
    let tempPassword: string | null = null;
    let wasCreated = false;
    let isFirstAccess = true;

    try {
      // Gera senha temporária
      tempPassword = this.generateTempPassword();
      
      // Tenta criar usuário no Firebase Auth
      const user = await this.authService.register(input.email, tempPassword);
      uid = user.uid;
      wasCreated = true;
      isFirstAccess = true; // Nova conta criada, é primeiro acesso
      
    } catch (error: any) {
      // Se o erro for "email já em uso", significa que a conta existe no Firebase Auth
      if (error.message.includes('já está em uso') || error.message.includes('email-already-in-use')) {
        // Buscar o UID na tabela Users do Firestore
        try {
          const existingUser = await this.userRepository.getByEmail(input.email);
          
          if (!existingUser || !existingUser.uid) {
            throw new Error(
              'Este email já possui uma conta no Firebase Auth, mas não foi encontrado na tabela de usuários. ' +
              'Por favor, entre em contato com o suporte.'
            );
          }
          
          // Encontrou o usuário na tabela Users, usar o UID dele
          uid = existingUser.uid;
          wasCreated = false;
          isFirstAccess = false; // Conta já existe, não é primeiro acesso
          tempPassword = null; // Não temos senha para enviar
          
        } catch (userError: any) {
          // Se não encontrou na tabela Users ou outro erro
          if (userError.message.includes('não foi encontrado')) {
            throw userError;
          }
          throw new Error(
            'Este email já possui uma conta no Firebase Auth, mas houve um erro ao buscar o usuário: ' +
            userError.message
          );
        }
      } else {
        // Se for outro erro, propaga
        throw error;
      }
    }

    // 3. Criar documento do admin no Firestore
    const admin = new AdminEntity(
      uid,
      input.name,
      input.email,
      input.roleId,
      isFirstAccess
    );

    await this.adminRepository.create(admin);

    // 4. Enviar email apropriado baseado no cenário
    if (wasCreated && tempPassword) {
      // Cenário: Nova conta criada
      // Enviar email com credenciais de primeiro acesso
      const emailEntity = new EmailEntity({
        to: [input.email],
        subject: 'Bem-vindo ao ShowTime Admin - Suas Credenciais de Acesso',
        body: `
          Olá ${input.name},
          
          Você foi adicionado como administrador no painel ShowTime!
          
          Suas credenciais de acesso são:
          Email: ${input.email}
          Senha temporária: ${tempPassword}
          
          Por favor, faça login e altere sua senha no primeiro acesso.
          
          Atenciosamente,
          Equipe ShowTime
        `,
        isHtml: false
      });
      
      await this.emailService.sendEmail(emailEntity);
    } else {
      // Cenário: Conta já existia no Firebase Auth
      // Enviar email informando que agora é admin
      const emailEntity = new EmailEntity({
        to: [input.email],
        subject: 'Você agora é Administrador do ShowTime',
        body: `
          Olá ${input.name},
          
          Você foi adicionado como administrador no painel ShowTime!
          
          Você já possui uma conta no sistema. Por favor, faça login com suas credenciais existentes para acessar o painel administrativo.
          
          Atenciosamente,
          Equipe ShowTime
        `,
        isHtml: false
      });
      
      await this.emailService.sendEmail(emailEntity);
    }

    return {
      admin,
      tempPassword,
      wasCreated
    };
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

