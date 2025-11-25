import { collection, doc, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { EventEntity } from "../../domain/entities/EventEntity";
import { EventTypeEntity } from "../../domain/entities/EventTypeEntity";
import { AddressInfoEntity } from "@/core/addresses/entities/AddressInfoEntity";
import { db } from "@/core/services/firebase";

export class EventModel {
  static collectionPath = "Events";
  static cacheKey = "CACHED_EVENT_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }

  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }

  static fromFirestore(data: any): EventEntity {
    // Converte data do Firebase (Timestamp) para Date
    const date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
    
    // Converte address se existir
    const address = data.address ? new AddressInfoEntity(data.address) : new AddressInfoEntity();
    
    // Converte eventType se existir
    const eventType = data.eventType ? new EventTypeEntity(
      data.eventType.uid || "",
      data.eventType.name || "",
      data.eventType.active ?? true
    ) : undefined;

    return new EventEntity(
      date,
      data.time || "",
      data.duration || 0,
      address,
      data.status || "PENDING",
      data.statusPayment || "PENDING",
      data.value,
      data.linkPayment,
      data.uid,
      data.refArtist,
      data.refContractor,
      data.nameArtist,
      data.nameContractor,
      eventType
    );
  }

  static toFirestore(entity: EventEntity): any {
    return {
      uid: entity.uid,
      date: entity.date,
      time: entity.time,
      duration: entity.duration,
      address: entity.address ? instanceToPlain(entity.address) : null,
      status: entity.status,
      statusPayment: entity.statusPayment,
      value: entity.value,
      linkPayment: entity.linkPayment,
      refArtist: entity.refArtist,
      refContractor: entity.refContractor,
      nameArtist: entity.nameArtist,
      nameContractor: entity.nameContractor,
      eventType: entity.eventType ? {
        uid: entity.eventType.uid,
        name: entity.eventType.name,
        active: entity.eventType.active
      } : null
    };
  }

  static fromJson(json: any): EventEntity {
    const date = typeof json.date === 'string' ? new Date(json.date) : json.date;
    const address = json.address ? new AddressInfoEntity(json.address) : new AddressInfoEntity();
    const eventType = json.eventType ? new EventTypeEntity(
      json.eventType.uid,
      json.eventType.name,
      json.eventType.active
    ) : undefined;

    return new EventEntity(
      date,
      json.time,
      json.duration,
      address,
      json.status,
      json.statusPayment,
      json.value,
      json.linkPayment,
      json.uid,
      json.refArtist,
      json.refContractor,
      json.nameArtist,
      json.nameContractor,
      eventType
    );
  }

  static toJson(entity: EventEntity): any {
    return instanceToPlain(entity);
  }

  static copyWith(entity: EventEntity, changes: Partial<EventEntity>): EventEntity {
    return new EventEntity(
      changes.date ?? entity.date,
      changes.time ?? entity.time,
      changes.duration ?? entity.duration,
      changes.address ?? entity.address,
      changes.status ?? entity.status,
      changes.statusPayment ?? entity.statusPayment,
      changes.value ?? entity.value,
      changes.linkPayment ?? entity.linkPayment,
      changes.uid ?? entity.uid,
      changes.refArtist ?? entity.refArtist,
      changes.refContractor ?? entity.refContractor,
      changes.nameArtist ?? entity.nameArtist,
      changes.nameContractor ?? entity.nameContractor,
      changes.eventType ?? entity.eventType
    );
  }
}
