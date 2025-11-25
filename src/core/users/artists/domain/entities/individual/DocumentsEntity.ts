// src/core/domain/entities/DocumentsEntity.ts

import { AddressInfoEntity } from '@/core/addresses/entities/AddressInfoEntity';

export class DocumentsEntity {
  constructor(
    public documentType: string,
    public documentOption?: string,
    public url?: string,
    public status: number = 0, // 0 - pending, 1 - analysis, 2 - approved, 3 - rejected
    public observation?: string,
    public address?: AddressInfoEntity,
    public idNumber?: string,
  ) {}
}