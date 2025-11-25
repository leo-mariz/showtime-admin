import { ArtistWithDocumentsEntity } from "@/core/users/artists/domain/entities/ArtistAllInfosEntity";
import { UserEntity } from "../UserEntity";
import { ClientEntity } from "@/core/users/clients/domain/entities/ClientEntity";

export type UserAggregatedInfoEntity = {
  userInfo?: UserEntity;
  artistInfo?: ArtistWithDocumentsEntity;
  clientInfo?: ClientEntity;
  // ...outros domínios
};

export type UsersCache = {
  [uid: string]: UserAggregatedInfoEntity;
};