import 'reflect-metadata';

export class CnpjUserEntity {
  cnpj?: string;
  companyName?: string;
  fantasyName?: string;
  stateRegistration?: string;

  constructor(init?: Partial<CnpjUserEntity>) {
    Object.assign(this, init);
  }
} 