// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { Promise } from "bluebird";
import { IEmailService } from "./IEmailService";
import mailgun from "mailgun-js";
import { UserAccount, Verification } from "../../../infra/database";
import { EnvironmentProvider } from "../../providers";

@injectable()
export class EmailService implements IEmailService {
  private mailgun: mailgun.Mailgun;

  constructor() {
    this.mailgun = mailgun({
      apiKey: EnvironmentProvider.env.MailgunApiKey,
      domain: EnvironmentProvider.env.SnkgSupportDomain,
    });
  }

  public sendVerificationEmail(
    account: UserAccount,
    verification: Verification,
    host: string
  ): Promise<any> {
    const userEmail = account.accountEmailByProvider;

    const mailOptions = {
      from: "no-reply@support.sneakgeek.app",
      to: userEmail,
      subject: "Verify your account with SneakGeek",
      text: `${host}/api/v1/account/verify?verificationToken=${verification.verificationToken}`,
    };

    const deferred = Promise.defer();
    this.mailgun.messages().send(mailOptions, (err: any, body: any) => {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(body);
      }
    });

    return deferred.promise;
  }
}
