import { collection, doc, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { PermissionEntity } from "../../domain/entities/PermissionEntity";
import { db } from "@/core/services/firebase";

export class PermissionModel {
  static collectionPath = "Permissions";
  static cacheKey = "CACHED_PERMISSIONS_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }

  static docRef(id: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, id);
  }

  static fromFirestore(data: any): PermissionEntity {
    return new PermissionEntity(
      data.id || "",
      data.name || "",
      data.description || "",
      data.section || "users",
      data.isActive ?? true
    );
  }

  static toFirestore(entity: PermissionEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      section: entity.section,
      isActive: entity.isActive
    };
  }

  static fromJson(json: any): PermissionEntity {
    return plainToInstance(PermissionEntity, json);
  }

  static toJson(entity: PermissionEntity): any {
    return instanceToPlain(entity);
  }

  static copyWith(entity: PermissionEntity, changes: Partial<PermissionEntity>): PermissionEntity {
    return new PermissionEntity(
      changes.id ?? entity.id,
      changes.name ?? entity.name,
      changes.description ?? entity.description,
      changes.section ?? entity.section,
      changes.isActive ?? entity.isActive
    );
  }

  // Criar permissões do sistema se não existirem
  static getSystemPermissions(): PermissionEntity[] {
    return Object.values(PermissionEntity.SYSTEM_PERMISSIONS).map(perm => 
      new PermissionEntity(perm.id, perm.name, perm.description, perm.section, true)
    );
  }
}
