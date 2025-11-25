export class CpfUserEntity {
  cpf?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  

  constructor(init?: Partial<CpfUserEntity>) {
    Object.assign(this, init);
  }
} 