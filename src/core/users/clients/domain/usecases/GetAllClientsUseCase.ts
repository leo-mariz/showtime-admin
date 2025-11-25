import { IClientRepository } from "../repositories/IClientRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetAllClientsUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private userRepository: IUserRepository
  ) {}

  async execute() {
    const clients = await this.clientRepository.getAll();
    const clientsWithUser = await Promise.all(
      clients.map(async (client) => {
        const user = await this.userRepository.getById(client.uid);
        return {
          ...client,
          user,
        };
      })
    );
    return clientsWithUser;
  }
}