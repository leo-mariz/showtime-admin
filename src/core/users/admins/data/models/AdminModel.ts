import { collection, doc, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { AdminEntity } from "@/core/users/admins/domain/entities/AdminEntity";
import { db } from "@/core/services/firebase";

export class AdminModel {
  static collectionPath = "Admins";
  static cacheKey = "CACHED_ADMIN_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static fromFirestore(data: any): AdminEntity {
    return plainToInstance(AdminEntity, data);
  }
  static toFirestore(entity: AdminEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): AdminEntity {
    return plainToInstance(AdminEntity, json);
  }
  static toJson(entity: AdminEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: AdminEntity, changes: Partial<AdminEntity>): AdminEntity {
    return new AdminEntity(
      changes.uid ?? entity.uid,
      changes.name ?? entity.name,
      changes.email ?? entity.email,
      changes.roleId ?? entity.roleId,
      changes.isFirstAccess ?? entity.isFirstAccess,
    );
  }
} 