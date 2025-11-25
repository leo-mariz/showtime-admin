import { collection, doc, Firestore } from "firebase/firestore";
import { ref as storageRef } from "firebase/storage";
import { db, storage } from "@/core/services/firebase"; // Importando instâncias já inicializadas
import { plainToInstance, instanceToPlain } from "class-transformer";
import { GroupEntity } from "@/core/users/artists/domain/groups/entities/GroupEntity";

export class GroupModel {
  static collectionPath = "Groups";
  static cacheKey = "CACHED_GROUP_INFO";
  static cacheAllKey = "CACHED_ALL_GROUPS_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static storageRoot(uid: string) {
    return `Groups/${uid}`;
  }
  static profilePicturePath(uid: string) {
    return `Groups/${uid}/profilePicture`;
  }
  static presentationMediasPath(uid: string) {
    return `Groups/${uid}/presentationMedias`;
  }
  static storageProfilePictureRef(uid: string) {
    return storageRef(storage, this.profilePicturePath(uid));
  }
  static storagePresentationMediasRef(uid: string) {
    return storageRef(storage, this.presentationMediasPath(uid));
  }
  static fromFirestore(data: any): GroupEntity {
    return plainToInstance(GroupEntity, data);
  }
  static toFirestore(entity: GroupEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): GroupEntity {
    return plainToInstance(GroupEntity, json);
  }
  static toJson(entity: GroupEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: GroupEntity, changes: Partial<GroupEntity>): GroupEntity {
    return new GroupEntity({ ...entity, ...changes });
  }
}