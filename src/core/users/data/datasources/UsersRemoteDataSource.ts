// src/core/users/data/datasources/IUserRemoteDataSource.ts
import { UserEntity } from "../../domain/entities/UserEntity";
import { UserModel } from "../models/UserModel";
import { getDoc, getDocs, query, where } from "firebase/firestore";

export interface IUserRemoteDataSource {
  getById(uid: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[]>;
  // outros métodos se necessário
}

export class UserRemoteDataSource implements IUserRemoteDataSource {
    async getById(uid: string): Promise<UserEntity | null> {
      const docSnap = await getDoc(UserModel.docRef(uid));
      if (!docSnap.exists()) return null;
      return UserModel.fromFirestore({ uid: docSnap.id, ...docSnap.data() });
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
      const q = query(UserModel.collectionRef(), where('email', '==', email));
      const querySnap = await getDocs(q);
      
      if (querySnap.empty) return null;
      
      const doc = querySnap.docs[0]; // Pega o primeiro resultado
      return UserModel.fromFirestore({ uid: doc.id, ...doc.data() });
    }
  
    async getAll(): Promise<UserEntity[]> {
      const querySnap = await getDocs(UserModel.collectionRef());
      return querySnap.docs.map(doc =>
        UserModel.fromFirestore({ uid: doc.id, ...doc.data() })
      );
    }
  }