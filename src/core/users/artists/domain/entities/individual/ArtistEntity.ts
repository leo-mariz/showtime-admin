import { Type } from 'class-transformer';
import { ProfessionalInfoEntity } from '../ProfessionalInfoEntity';
import { AddressInfoEntity } from '@/core/addresses/entities/AddressInfoEntity';
import { BankAccountEntity } from '../BankAccountEntity';
import { DocumentsEntity } from './DocumentsEntity';


export class ArtistEntity {
  uid?: string;
  profilePicture?: string;
  artistName?: string;
  dateRegistered?: Date;
  presentationMedias?: Record<string, string>;
  
  @Type(() => ProfessionalInfoEntity)
  professionalInfo?: ProfessionalInfoEntity;

  @Type(() => AddressInfoEntity)
  residenceAddress?: AddressInfoEntity;

  @Type(() => BankAccountEntity)
  bankAccount?: BankAccountEntity;

  documents?: DocumentsEntity[];
  approved?: boolean;
  isActive?: boolean;
  hasIncompleteSections?: boolean;
  incompleteSections?: Record<string, string[]>;
  agreedToArtistTermsOfUse?: boolean;
  isOnAnyGroup?: boolean;
  groupsInUids?: string[];
  // socialMediaLinks?: SocialMediaLinksEntity;

  constructor(init?: Partial<ArtistEntity>) {
    Object.assign(this, init);
  }

  static defaultEntity(): ArtistEntity {
    return new ArtistEntity({
      dateRegistered: new Date(),
      approved: false,
      isActive: false,
    });
  }
}
