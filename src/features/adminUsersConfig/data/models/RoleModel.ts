import { collection, doc, Firestore, Timestamp } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { RoleEntity } from "../../domain/entities/RoleEntity";
import { db } from "@/core/services/firebase";

export class RoleModel {
  static collectionPath = "Roles";
  static cacheKey = "CACHED_ROLES_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }

  static docRef(id: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, id);
  }

  static fromFirestore(data: any): RoleEntity {
    // Converte timestamps do Firebase para Date
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : undefined;
    const updatedAt = data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt ? new Date(data.updatedAt) : undefined;

    return new RoleEntity(
      data.id || "",
      data.name || "",
      data.description || "",
      Array.isArray(data.permissions) ? data.permissions : [],
      data.isActive ?? true,
      data.createdBy,
      createdAt,
      data.updatedBy,
      updatedAt
    );
  }

  static toFirestore(entity: RoleEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      permissions: entity.permissions,
      isActive: entity.isActive,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt ? Timestamp.fromDate(entity.createdAt) : null,
      updatedBy: entity.updatedBy,
      updatedAt: entity.updatedAt ? Timestamp.fromDate(entity.updatedAt) : null
    };
  }

  static fromJson(json: any): RoleEntity {
    const createdAt = json.createdAt ? new Date(json.createdAt) : undefined;
    const updatedAt = json.updatedAt ? new Date(json.updatedAt) : undefined;

    return new RoleEntity(
      json.id,
      json.name,
      json.description,
      json.permissions,
      json.isActive,
      json.createdBy,
      createdAt,
      json.updatedBy,
      updatedAt
    );
  }

  static toJson(entity: RoleEntity): any {
    return instanceToPlain(entity);
  }

  static copyWith(entity: RoleEntity, changes: Partial<RoleEntity>): RoleEntity {
    return new RoleEntity(
      changes.id ?? entity.id,
      changes.name ?? entity.name,
      changes.description ?? entity.description,
      changes.permissions ?? entity.permissions,
      changes.isActive ?? entity.isActive,
      changes.createdBy ?? entity.createdBy,
      changes.createdAt ?? entity.createdAt,
      changes.updatedBy ?? entity.updatedBy,
      changes.updatedAt ?? entity.updatedAt
    );
  }

  // Criar papéis do sistema se não existirem
  static getSystemRoles(): RoleEntity[] {
    const now = new Date();
    return Object.values(RoleEntity.SYSTEM_ROLES).map(role => 
      new RoleEntity(
        role.id,
        role.name,
        role.description,
        role.permissions,
        true,
        "system",
        now
      )
    );
  }
}
