import { collection, doc, Firestore, Timestamp } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { AdminUserEntity } from "../../domain/entities/AdminUserEntity";
import { db } from "@/core/services/firebase";

export class AdminUserModel {
  static collectionPath = "Admins";
  static cacheKey = "CACHED_ADMIN_USERS_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }

  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }

  static fromFirestore(data: any): AdminUserEntity {
    // Converte timestamps do Firebase para Date
    const lastLogin = data.lastLogin?.toDate ? data.lastLogin.toDate() : data.lastLogin ? new Date(data.lastLogin) : undefined;
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : undefined;
    const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : undefined;

    return new AdminUserEntity(
      data.uid || "",
      data.name || "",
      data.email || "",
      data.roleId || "",
      data.isActive ?? true,
      data.isFirstAccess ?? true,
      lastLogin,
      data.createdBy,
      createdAt,
      data.updatedBy,
      updatedAt
    );
  }

  static toFirestore(entity: AdminUserEntity): any {
    const data: any = {
      uid: entity.uid,
      name: entity.name,
      email: entity.email,
      roleId: entity.roleId,
      isActive: entity.isActive,
      isFirstAccess: entity.isFirstAccess
    };

    // Adiciona campos opcionais apenas se não forem undefined
    if (entity.lastLogin) {
      data.lastLogin = Timestamp.fromDate(entity.lastLogin);
    }
    if (entity.createdBy) {
      data.createdBy = entity.createdBy;
    }
    if (entity.createdAt) {
      data.createdAt = Timestamp.fromDate(entity.createdAt);
    }
    if (entity.updatedBy) {
      data.updatedBy = entity.updatedBy;
    }
    if (entity.updatedAt) {
      data.updatedAt = Timestamp.fromDate(entity.updatedAt);
    }

    return data;
  }

  static fromJson(json: any): AdminUserEntity {
    const lastLogin = json.lastLogin ? new Date(json.lastLogin) : undefined;
    const createdAt = json.createdAt ? new Date(json.createdAt) : undefined;
    const updatedAt = json.updatedAt ? new Date(json.updatedAt) : undefined;

    return new AdminUserEntity(
      json.uid,
      json.name,
      json.email,
      json.roleId,
      json.isActive,
      json.isFirstAccess ?? true,
      lastLogin,
      json.createdBy,
      createdAt,
      json.updatedBy,
      updatedAt
    );
  }

  static toJson(entity: AdminUserEntity): any {
    return instanceToPlain(entity);
  }

  static copyWith(entity: AdminUserEntity, changes: Partial<AdminUserEntity>): AdminUserEntity {
    return new AdminUserEntity(
      changes.uid ?? entity.uid,
      changes.name ?? entity.name,
      changes.email ?? entity.email,
      changes.roleId ?? entity.roleId,
      changes.isActive ?? entity.isActive,
      changes.isFirstAccess ?? entity.isFirstAccess,
      changes.lastLogin ?? entity.lastLogin,
      changes.createdBy ?? entity.createdBy,
      changes.createdAt ?? entity.createdAt,
      changes.updatedBy ?? entity.updatedBy,
      changes.updatedAt ?? entity.updatedAt
    );
  }
}
