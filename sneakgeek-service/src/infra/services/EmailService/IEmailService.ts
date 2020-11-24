//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { UserAccount, Verification } from "../../../infra/database";

export interface IEmailService {
  sendVerificationEmail(
    account: UserAccount,
    verification: Verification,
    host: string
  ): Promise<any>;
}
