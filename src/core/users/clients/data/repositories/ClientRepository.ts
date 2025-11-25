import { IClientRepository } from "../../domain/repositories/IClientRepository";
import { ClientEntity } from "../../domain/entities/ClientEntity";
import { IClientRemoteDataSource } from "../datasources/ClientRemoteDataSource";
import { IClientLocalDataSource } from "../datasources/ClientLocalDataSource";

export class ClientRepository implements IClientRepository {
  constructor(
    private remote: IClientRemoteDataSource,
    private local: IClientLocalDataSource
  ) {}

  async getById(uid: string): Promise<ClientEntity | null> {
    // Busca do remoto para garantir dados atualizados
    const remoteClient = await this.remote.getById(uid);
    if (!remoteClient) return null;

    // Atualiza o cache local centralizado
    await this.local.setClientInfo(uid, remoteClient);

    return remoteClient;
  }

  async getAll(): Promise<ClientEntity[]> {
    // Busca todos do remoto
    const clients = await this.remote.getAll();

    // Atualiza o cache local centralizado
    for (const client of clients) {
      await this.local.setClientInfo(client.uid!, client);
    }

    return clients;
  }

  async create(uid: string, entity: ClientEntity): Promise<void> {
    await this.remote.create(uid, entity);
    await this.local.setClientInfo(uid, entity);
  }

  async update(uid: string, changes: Partial<ClientEntity>): Promise<void> {
    await this.remote.update(uid, changes);
    // Atualiza apenas o campo clientInfo no cache local
    const cached = await this.local.getClientInfo(uid);
    if (cached) {
      const updated = { ...cached, ...changes };
      await this.local.setClientInfo(uid, updated);
    }
  }

  async delete(uid: string): Promise<void> {
    await this.remote.delete(uid);
    await this.local.removeClientInfo(uid);
  }
}