import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CnpjUserEntity } from '@/core/domain/entities/user/CnpjUserEntity';

export class CnpjUserModel {
  static fromFirestore(data: any): CnpjUserEntity {
    return plainToInstance(CnpjUserEntity, data);
  }
  static toFirestore(entity: CnpjUserEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): CnpjUserEntity {
    return plainToInstance(CnpjUserEntity, json);
  }
  static toJson(entity: CnpjUserEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: CnpjUserEntity, changes: Partial<CnpjUserEntity>): CnpjUserEntity {
    return new CnpjUserEntity({ ...entity, ...changes });
  }
} 