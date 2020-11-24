//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import Server from "../../../src/Server";
import request from "supertest";
import { Endpoints } from "../config";
import { Types } from "../../../src/configuration/inversify";
import { Repository, UserAccount, UserProfile } from "../../../src/infra/database";

export const emailLogin = async (credential: { email: string; password: string }) => {
  return (
    await request(Server.instance).post(Endpoints.Account.EmailLogin).send(credential)
  ).body;
};

export const emailSignup = async (credential: { email: string; password: string }) => {
  return (
    await request(Server.instance).post(Endpoints.Account.EmailSignup).send(credential)
  ).body;
};

export const destroyAccountByEmail = async (email: string) => {
  const accountRepo = Server.container.get<Repository<UserAccount>>(
    Types.AccountRepository
  );
  const account = await accountRepo
    .findOneAndDelete({ accountEmailByProvider: email })
    .exec();
  if (account.profile) {
    const profileRepo = Server.container.get<Repository<UserProfile>>(
      Types.ProfileRepository
    );
    await profileRepo.findOneAndDelete({ _id: account.profile });
  }
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
