//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { JwtPayload } from "../../../../types";
import { DecodeOptions } from "jsonwebtoken";
import { ClientToken } from "../AppleAuthService";

export interface IJwtService {
  verifyJWToken<T extends JwtPayload | ClientToken>(
    token: string,
    key?: string,
    algorithm?: string
  ): Promise<T>;
  createJWToken(accountId: string): string;
  decode(token: string, options?: DecodeOptions): string | { [key: string]: any };
}
