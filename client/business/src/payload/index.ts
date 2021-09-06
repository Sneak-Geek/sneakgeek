import { Account, Profile, Catalog, Shoe, Review, SellOrder, BuyOrder, PopulatedSellOrder, Notification } from "../model";

export enum NetworkRequestState {
  NOT_STARTED,
  REQUESTING,
  SUCCESS,
  FAILED,
}

export type NetworkPayload<T> = {
  state: NetworkRequestState;
  error?: any;
  data?: T;
};

export type AuthenticationPayload = NetworkPayload<{ account: Account; token?: string }>;
export type GetUserProfilePayload = NetworkPayload<{ profile: Profile }>;
export type CatalogPayload = NetworkPayload<Catalog[]>;
export type SearchShoesPayload = NetworkPayload<Shoe[]>;
export type GetReviewsPayload = NetworkPayload<Review[]>;
export type GetShoeInfoPayload = NetworkPayload<{
  relatedShoes: Shoe[];
  lowestSellOrder?: SellOrder;
  highestBuyOrder?: BuyOrder;
}>;
export type HomePageCatalogsPayload = NetworkPayload<{
  hot: Catalog;
  [key: string]: Catalog;
}>;
export type NotificationsPayload = NetworkPayload<{ notifications: Notification[] }>;
export type GetSellOrderHistoryPayload = NetworkPayload<PopulatedSellOrder[]>;
export type GetBuyOrdersPayload = NetworkPayload<BuyOrder[]>;
