export class AdminEntity {
  constructor(
    public uid: string,
    public name: string,
    public email: string,
    public roleId: string, // ID único do papel do admin
    public isFirstAccess: boolean = true, // Indica se é o primeiro acesso do admin
  ) {}
} 