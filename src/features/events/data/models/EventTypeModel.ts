import { collection, doc, query, where, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { EventTypeEntity } from "../../domain/entities/EventTypeEntity";
import { db } from "@/core/services/firebase";

export class EventTypeModel {
  static collectionPath = "EventTypes";
  static cacheKey = "CACHED_EVENT_TYPE_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }

  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }

  static activeEventTypesQuery(dbInstance?: Firestore) {
    return query(
      collection(dbInstance ?? db, this.collectionPath),
      where('active', '==', true)
    );
  }

  static fromFirestore(data: any): EventTypeEntity {
    return new EventTypeEntity(
      data.uid || "",
      data.name || "",
      data.active ?? true
    );
  }

  static toFirestore(entity: EventTypeEntity): any {
    return {
      uid: entity.uid,
      name: entity.name,
      active: entity.active
    };
  }

  static fromJson(json: any): EventTypeEntity {
    return plainToInstance(EventTypeEntity, json);
  }

  static toJson(entity: EventTypeEntity): any {
    return instanceToPlain(entity);
  }

  static copyWith(entity: EventTypeEntity, changes: Partial<EventTypeEntity>): EventTypeEntity {
    return new EventTypeEntity(
      changes.uid ?? entity.uid,
      changes.name ?? entity.name,
      changes.active ?? entity.active
    );
  }
}
