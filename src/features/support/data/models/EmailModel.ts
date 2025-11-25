import { collection, doc, Firestore } from "firebase/firestore";
import { db } from "@/core/services/firebase";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { EmailEntity } from "@/features/support/domain/entities/EmailEntity";

export class EmailModel {
  static collectionPath = "Emails";
  static alternativeCollectionPath = "emails";
  static supportEmailsKey = "SUPPORT_EMAILS";
  static artistEmailsKey = "ARTIST_EMAILS";
  static supportEmail = "contato@showtime.app.br";

  static collectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.collectionPath);
  }
  static alternativeCollectionRef(dbInstance?: Firestore) {
    return collection(dbInstance ?? db, this.alternativeCollectionPath);
  }
  static docRef(uid: string, dbInstance?: Firestore) {
    return doc(dbInstance ?? db, this.collectionPath, uid);
  }
  static fromFirestore(data: any): EmailEntity {
    return plainToInstance(EmailEntity, data);
  }
  static toFirestore(entity: EmailEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): EmailEntity {
    return plainToInstance(EmailEntity, json);
  }
  static toJson(entity: EmailEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: EmailEntity, changes: Partial<EmailEntity>): EmailEntity {
    return new EmailEntity({ ...entity, ...changes });
  }
} 