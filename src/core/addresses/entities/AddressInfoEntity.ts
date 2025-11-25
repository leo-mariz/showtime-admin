export class AddressInfoEntity {
    title: string;
    cep: string;
    logradouro?: string;
    number?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    isPrimary: boolean;
    latitude?: number;
    longitude?: number;
    coverageRadius?: number;
    complement?: string;
  
    constructor(init?: Partial<AddressInfoEntity>) {
      this.title = init?.title ?? '';
      this.cep = init?.cep ?? '';
      this.logradouro = init?.logradouro;
      this.number = init?.number;
      this.bairro = init?.bairro;
      this.localidade = init?.localidade;
      this.uf = init?.uf;
      this.isPrimary = init?.isPrimary ?? false;
      this.latitude = init?.latitude;
      this.longitude = init?.longitude;
      this.coverageRadius = init?.coverageRadius;
      this.complement = init?.complement;
    }
  } 