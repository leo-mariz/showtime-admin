export class BankAccountEntity {
  fullName?: string;
  bankName?: string;
  agency?: string;
  accountNumber?: string;
  accountType?: string;
  cpfOrCnpj?: string;
  pixType?: string;
  pixKey?: string;

  constructor(init?: Partial<BankAccountEntity>) {
    Object.assign(this, init);
  }

  static pixTypes: string[] = [
    'CPF',
    'CNPJ',
    'Email',
    'Telefone',
    'Chave Aleatória',
  ];

  static accountTypes: string[] = [
    'Conta Corrente',
    'Conta Poupança',
  ];
} 