import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword,
  deleteUser,
  signOut,
  User,
  AuthErrorCodes
} from 'firebase/auth';

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
  changePassword(newPassword: string): Promise<void>;
  deleteCurrentUser(): Promise<void>;
  logout(): Promise<void>;
}

export class AuthService implements IAuthService {
  // Login com email e senha
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.INVALID_PASSWORD:
          throw new Error('Senha incorreta.');
        case AuthErrorCodes.USER_DELETED:
          throw new Error('Usuário não encontrado.');
        case AuthErrorCodes.INVALID_EMAIL:
          throw new Error('E-mail inválido.');
        case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
          throw new Error('Conta temporariamente bloqueada por tentativas erradas. Tente novamente mais tarde.');
        case 'auth/user-disabled':
          throw new Error('Conta desativada.');
        default:
          throw new Error('Erro ao fazer login. Tente novamente.');
      }
    }
  }

  // Criação de novo usuário
  async register(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
          throw new Error('E-mail já está em uso.');
        case AuthErrorCodes.INVALID_EMAIL:
          throw new Error('E-mail inválido.');
        case AuthErrorCodes.WEAK_PASSWORD:
          throw new Error('Senha muito fraca.');
        default:
          throw new Error('Erro ao criar usuário. Tente novamente.');
      }
    }
  }

  // Alterar senha do usuário logado
  async changePassword(newPassword: string): Promise<void> {
    if (!auth.currentUser) throw new Error('Nenhum usuário autenticado.');
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      switch (error.code) {
        case AuthErrorCodes.WEAK_PASSWORD:
          throw new Error('Senha muito fraca.');
        case 'auth/requires-recent-login':
          throw new Error('Reautentique-se para alterar a senha.');
        default:
          throw new Error('Erro ao alterar senha. Tente novamente.');
      }
    }
  }

  // Deletar usuário logado
  async deleteCurrentUser(): Promise<void> {
    if (!auth.currentUser) throw new Error('Nenhum usuário autenticado.');
    try {
      await deleteUser(auth.currentUser);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Reautentique-se para excluir a conta.');
      }
      throw new Error('Erro ao excluir usuário. Tente novamente.');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      throw new Error('Erro ao sair da conta. Tente novamente.');
    }
  }
}

export const authService = new AuthService();