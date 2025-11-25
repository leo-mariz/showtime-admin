import { IClientRepository } from "../../clients/domain/repositories/IClientRepository";
import { IUserRepository } from "../repositories/IUserRepository";
import { IArtistIndividualRepository } from "../../artists/domain/repositories/individual/IArtistIndividualRepository";
import { UserAggregatedInfoEntity } from "../entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { ArtistWithDocumentsEntity } from "../../artists/domain/entities/ArtistAllInfosEntity";

export class GetAllUsersInfoUseCase {
    constructor(private userRepository: IUserRepository, private clientRepository: IClientRepository, private artistRepository: IArtistIndividualRepository) {}
  
    async execute(): Promise<UserAggregatedInfoEntity[]> {
        const allArtists = await this.artistRepository.getAll();
        const allArtistsWithDocuments = allArtists.map((artist) => {
            return {
                ...artist,
                documents: artist.documents || [],
            }
        }) as ArtistWithDocumentsEntity[];
        const allClients = await this.clientRepository.getAll();
        const allUsers = await this.userRepository.getAll();
        const response = allUsers.map((user) => {
            const artist = allArtistsWithDocuments.find((artist) => artist.uid === user.uid);
            const client = allClients.find((client) => client.uid === user.uid);
            return {
                userInfo: user,
                artistInfo: artist,
                clientInfo: client,
            }
        })
        console.log(response);
        return response;
    }
  }
  