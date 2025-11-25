import { collection, doc, Firestore } from "firebase/firestore";
import { ref as storageRef } from "firebase/storage";
import { db, storage } from "@/core/services/firebase";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { ClientEntity } from "../../domain/entities/ClientEntity";

export class ClientModel {
  static collectionPath = "Clients";
  static cacheKey = "CACHED_CLIENT_INFO";
  static cacheAllKey = "CACHED_ALL_CLIENTS_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static profilePicturePath(uid: string) {
    return `Clients/${uid}/profilePicture`;
  }
  static storageProfilePictureRef(uid: string) {
    return storageRef(storage, this.profilePicturePath(uid));
  }
  static fromFirestore(data: any): ClientEntity {
    return plainToInstance(ClientEntity, data);
  }
  static toFirestore(entity: ClientEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): ClientEntity {
    return plainToInstance(ClientEntity, json);
  }
  static toJson(entity: ClientEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: ClientEntity, changes: Partial<ClientEntity>): ClientEntity {
    return new ClientEntity({ ...entity, ...changes });
  }
} 