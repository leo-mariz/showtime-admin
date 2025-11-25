import { collection, doc, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { ListsEntity } from "@/features/appLists/domain/entities/ListsEntity";
import { db } from "@/core/services/firebase";

export class ListsModel {
  static collectionPath = "AppLists";
  static docUid = "nTOyUyPCQYQ3LJR69aer";
  static cacheKey = "CACHED_LISTS_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static fromFirestore(data: any): ListsEntity {
    return plainToInstance(ListsEntity, data);
  }
  static toFirestore(entity: ListsEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): ListsEntity {
    return plainToInstance(ListsEntity, json);
  }
  static toJson(entity: ListsEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: ListsEntity, changes: Partial<ListsEntity>): ListsEntity {
    return new ListsEntity(
      changes.artistSpecialtys ?? entity.artistSpecialtys,
      changes.hasTalent ?? entity.hasTalent,
    );
  }
} 