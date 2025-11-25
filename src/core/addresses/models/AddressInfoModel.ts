import { collection, doc, Firestore } from "firebase/firestore";
import { db } from "@/core/services/firebase"; // Importando instâncias já inicializadas
// import { AddressInfoEntity } from "@/domain/entities/artists/AddressInfoEntity";

export class AddressInfoModel {
  static collectionPath = "Addresses";
  static cacheKey = "CACHE_ADDRESSES_INFO";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  // Métodos de conversão podem ser adicionados conforme a entidade AddressInfoEntity
} 