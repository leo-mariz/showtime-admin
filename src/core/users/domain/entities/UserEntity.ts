import 'reflect-metadata';
import { Type, plainToInstance } from 'class-transformer';
import { CpfUserEntity } from './CpfUserEntity';
import { CnpjUserEntity } from './CnpjUserEntity';

export class UserEntity {
  uid?: string;
  email: string;
  password?: string;
  phoneNumber?: string;

  @Type(() => CpfUserEntity)
  cpfUser?: CpfUserEntity;

  @Type(() => CnpjUserEntity)
  cnpjUser?: CnpjUserEntity;

  isCnpj?: boolean;
  isArtist?: boolean;
  isEmailVerified?: boolean;
  isActive?: boolean;
  agreedToPrivacyPolicy?: boolean;

  constructor(init: {
    uid?: string;
    email: string;
    password?: string;
    phoneNumber?: string;
    cpfUser?: CpfUserEntity;
    cnpjUser?: CnpjUserEntity;
    isCnpj?: boolean;
    isArtist?: boolean;
    isEmailVerified?: boolean;
    isActive?: boolean;
    agreedToPrivacyPolicy?: boolean;
  }) {
    Object.assign(this, init);
  }
} 