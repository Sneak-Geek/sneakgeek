// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { NetworkRequestState } from "../State";
import { Profile, SellOrder, Shoe, BuyOrder, Account } from "../Model";

export type NetworkPayload = {
  state: NetworkRequestState;
  error?: any;
};

export type AuthenticationPayload = {
  account?: Account;
} & NetworkPayload;

export type SellOrderHistoryPayload = {
  sellHistory?: SellOrder[];
} & NetworkPayload;
export type BuyOrderHistoryPayload = {
  buyHistory?: BuyOrder[];
} & NetworkPayload;

export type AvailableSellOrdersPayload = {
  sellOrders?: SellOrder[];
} & NetworkPayload;

export type SearchShoePayload = {
  shoes?: Shoe[];
} & NetworkPayload;

export type GetShoesPayload = SearchShoePayload;

export type GetUserProfilePayload = {
  profile?: Profile;
} & NetworkPayload;

export type CheckAccountWithEmailPayload = {
  existStatus?: boolean;
} & NetworkPayload;

export type ChangePasswordPayload = NetworkPayload;

export type RequestTokenPayload = NetworkPayload;
export type VerifyTokenPayload = NetworkPayload;
export type SetPasswordPayload = NetworkPayload;
export type RequestProductPayload = NetworkPayload;

export type UpdateUserProfilePayload = {
  profile?: Profile;
} & NetworkPayload;

export type SellShoePayload = {
  isUploadingPictures?: boolean;
} & NetworkPayload;
export type BuyShoePayload = NetworkPayload;
