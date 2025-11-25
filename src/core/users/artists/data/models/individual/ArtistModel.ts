import { collection, doc, Firestore } from "firebase/firestore";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { ArtistEntity } from "@/core/users/artists/domain/entities/individual/ArtistEntity";
import { db, storage } from "@/core/services/firebase"; // Importando instâncias já inicializadas
import { ref as storageRef } from "firebase/storage";

export class ArtistModel {
  static collectionPath = "Artists";
  static cacheKey = "CACHED_ARTIST_INFO";
  static cacheAllKey = "CACHED_ALL_ARTISTS_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static storageRoot(uid: string) {
    return `Artists/${uid}`;
  }
  static profilePicturePath(uid: string) {
    return `Artists/${uid}/profilePicture`;
  }
  static presentationMediasPath(uid: string) {
    return `Artists/${uid}/presentationMedias`;
  }
  static storageProfilePictureRef(uid: string) {
    return storageRef(storage, this.profilePicturePath(uid));
  }
  static storagePresentationMediasRef(uid: string) {
    return storageRef(storage, this.presentationMediasPath(uid));
  }
  static fromFirestore(data: any): ArtistEntity {
    return plainToInstance(ArtistEntity, data);
  }
  static toFirestore(entity: ArtistEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): ArtistEntity {
    return plainToInstance(ArtistEntity, json);
  }
  static toJson(entity: ArtistEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: ArtistEntity, changes: Partial<ArtistEntity>): ArtistEntity {
    return new ArtistEntity({ ...entity, ...changes });
  }
}