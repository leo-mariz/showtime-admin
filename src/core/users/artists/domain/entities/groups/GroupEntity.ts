import { Type } from 'class-transformer';
import { ProfessionalInfoEntity } from '../ProfessionalInfoEntity';
import { BankAccountEntity } from '../BankAccountEntity';
import { GroupMemberEntity } from './GroupMemberEntity';


export class GroupEntity {
  uid?: string;
  profilePicture?: string;
  groupName?: string;
  
  presentationMedias?: Record<string, string>;
  @Type(() => ProfessionalInfoEntity)
  professionalInfo?: ProfessionalInfoEntity;
  @Type(() => BankAccountEntity)
  bankAccount?: BankAccountEntity;
  @Type(() => GroupMemberEntity)
  members?: GroupMemberEntity[];

  invitationEmails?: string[];
  dateRegistered?: Date;
  isActive?: boolean;
  hasIncompleteSections?: boolean;
  incompleteSections?: Record<string, string[]>;
  // socialMediaLinks?: SocialMediaLinksEntity;

  constructor(init?: Partial<GroupEntity>) {
    Object.assign(this, init);
  }

  static defaultEntity(): GroupEntity {
    return new GroupEntity({
      dateRegistered: new Date(),
      isActive: false,
    });
  }
}
