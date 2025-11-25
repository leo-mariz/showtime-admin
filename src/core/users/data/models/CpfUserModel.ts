import { plainToInstance, instanceToPlain } from 'class-transformer';
import { CpfUserEntity } from '@/core/domain/entities/user/CpfUserEntity';

export class CpfUserModel {
  static fromFirestore(data: any): CpfUserEntity {
    return plainToInstance(CpfUserEntity, data);
  }
  static toFirestore(entity: CpfUserEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): CpfUserEntity {
    return plainToInstance(CpfUserEntity, json);
  }
  static toJson(entity: CpfUserEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: CpfUserEntity, changes: Partial<CpfUserEntity>): CpfUserEntity {
    return new CpfUserEntity({ ...entity, ...changes });
  }
} 