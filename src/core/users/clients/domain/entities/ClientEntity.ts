export class ClientEntity {
  uid?: string;
  profilePicture?: string;
  dateRegistered?: Date;
  preferences?: string[];
  agreedToClientTermsOfUse?: boolean;

  constructor(init?: Partial<ClientEntity>) {
    Object.assign(this, init);
  }

  static defaultClientEntity(): ClientEntity {
    return new ClientEntity({
      dateRegistered: new Date(),
    });
  }
} 