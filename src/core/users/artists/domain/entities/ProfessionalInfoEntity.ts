export class ProfessionalInfoEntity {
  specialty?: string[];
  genrePreferences?: string[];
  hourlyRate?: string;
  minimumShowDuration?: number;
  bio?: string;

  constructor(init?: Partial<ProfessionalInfoEntity>) {
    Object.assign(this, init);
  }

  // Métodos estáticos de referência ao banco de dados não são necessários aqui
} 