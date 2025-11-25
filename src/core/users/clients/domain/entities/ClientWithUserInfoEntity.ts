import { ClientEntity } from "./ClientEntity";
import { UserEntity } from "../../../domain/entities/UserEntity";

export type ClientWithUserInfoEntity = {
  client: ClientEntity;
  user: UserEntity | null;
}; 