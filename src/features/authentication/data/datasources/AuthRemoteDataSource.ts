import { db } from '@/core/services/firebase';
import { getDoc } from 'firebase/firestore';
import { authService } from '@/core/services/AuthServices';
import { AdminModel } from '@/core/users/admins/data/models/AdminModel';
import { AdminEntity } from '@/core/users/admins/domain/entities/AdminEntity'; // ajuste o caminho conforme sua estrutura



export interface IAuthRemoteDataSource {
    login(email: string, password: string): Promise<{ uid: string; email: string }>;
    getAdminByUid(uid: string): Promise<AdminEntity | null>;
    logout(): Promise<void>;
  }

export class AuthRemoteDataSource implements IAuthRemoteDataSource {
    async login(email: string, password: string): Promise<{ uid: string; email: string }> {
      const user = await authService.login(email, password);
      return { uid: user.uid, email: user.email ?? '' };
    }

    async getAdminByUid(uid: string): Promise<AdminEntity> {
      const ref = AdminModel.docRef(uid, db);
      console.log("ref", ref);
      const snapshot = await getDoc(ref);
      console.log("snapshot", snapshot);
      if (!snapshot.exists()) {
        throw new Error('Usuário não autorizado a acessar o painel.');
      }
      return AdminModel.fromFirestore({ uid: snapshot.id, ...snapshot.data() });
    }

    async logout(): Promise<void> {
      await authService.logout();
    }
  }