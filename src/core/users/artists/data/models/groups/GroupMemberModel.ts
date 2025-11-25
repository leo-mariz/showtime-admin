import { plainToInstance, instanceToPlain } from 'class-transformer';
import { GroupMemberEntity } from '../../../domain/repositories/groups/entities/GroupMemberEntity';

export class GroupMemberModel {
  static fromFirestore(data: any): GroupMemberEntity {
    return plainToInstance(GroupMemberEntity, data);
  }
  static toFirestore(entity: GroupMemberEntity): any {
    return instanceToPlain(entity);
  }
  static fromJson(json: any): GroupMemberEntity {
    return plainToInstance(GroupMemberEntity, json);
  }
  static toJson(entity: GroupMemberEntity): any {
    return instanceToPlain(entity);
  }
  static copyWith(entity: GroupMemberEntity, changes: Partial<GroupMemberEntity>): GroupMemberEntity {
    return new GroupMemberEntity({ ...entity, ...changes });
  }
} 