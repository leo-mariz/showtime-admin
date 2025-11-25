import { AdminEntity } from "../../admins/domain/entities/AdminEntity";
import { UserEntity } from "../entities/UserEntity";
import { UserAggregatedInfoEntity } from "../entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";

export interface IUserRepository {
  getById(uid: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[]>;
  getAllFromCache(): Promise<UserAggregatedInfoEntity[]>;
  getAdminInfo(): Promise<AdminEntity | undefined>;
}