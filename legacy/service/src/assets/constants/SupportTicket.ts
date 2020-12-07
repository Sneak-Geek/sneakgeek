// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Strings } from "../";

export const SupportTicketMaxLength = 200;
export const SupportTicketCategory = [
  Strings.SupportTicket_ProductComplaint,
  Strings.SupportTicket_AppComplaint,
  Strings.SupportTicket_AccountComplaint,
];
export enum SupportTicketResolveStatus {
  OPEN,
  PENDING,
  RESOLVED,
  CLOSED,
}
