import { UserEntity } from "../../domain/entities/UserEntity";
import { cacheService } from "@/core/services/LocalCacheServices";
import { UserModel } from "../models/UserModel";
import { UsersCache } from "../../domain/entities/UsersAggregatedInfo/UsersAggregatedInfoEntity";
import { AdminEntity } from "../../admins/domain/entities/AdminEntity";
import { AdminModel } from "../../admins/data/models/AdminModel";



export interface IUserLocalDataSource {
  getUserInfo(uid: string): Promise<UserEntity | undefined>;
  setUserInfo(uid: string, userInfo: UserEntity): Promise<void>;
  getAllUsers(): Promise<UsersCache>;
  setAllUsers(users: UsersCache): Promise<void>;
  getAdminInfo(): Promise<AdminEntity | undefined>;
  clear(): Promise<void>;
}

export class UserLocalDataSource implements IUserLocalDataSource {
  private cacheKey = UserModel.cacheKey;

  async getAllUsers(): Promise<UsersCache> {
    return (await cacheService.get<UsersCache>(this.cacheKey)) ?? {};
  }

  async setAllUsers(users: UsersCache): Promise<void> {
    await cacheService.set(this.cacheKey, users);
  }

  async getUserInfo(uid: string): Promise<UserEntity | undefined> {
    const users = await this.getAllUsers();
    return users[uid]?.userInfo;
  }

  async setUserInfo(uid: string, userInfo: UserEntity): Promise<void> {
    const users = await this.getAllUsers();
    users[uid] = { ...users[uid], userInfo };
    await this.setAllUsers(users);
  }

  async getAdminInfo(): Promise<AdminEntity | undefined> {
    const admin = await cacheService.get<AdminEntity>(AdminModel.cacheKey);
    return admin;
  }

  async clear(): Promise<void> {
    await cacheService.remove(this.cacheKey);
  }
} 