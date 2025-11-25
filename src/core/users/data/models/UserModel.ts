import { collection, doc, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { UserEntity } from "../../domain/entities/UserEntity";
import { db } from "@/core/services/firebase";

export class UserModel {
  static collectionPath = "Users";
  static cacheKey = "CACHED_USER_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static fromFirestore(data: any): UserEntity {
    return plainToInstance(UserEntity, data);
  }
  static toFirestore(entity: UserEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): UserEntity {
    return plainToInstance(UserEntity, json);
  }
  static toJson(entity: UserEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: UserEntity, changes: Partial<UserEntity>): UserEntity {
    return new UserEntity({ ...entity, ...changes });
  }
} 