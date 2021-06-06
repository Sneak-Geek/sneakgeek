//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

// Type definitions for react-native-fbsdk 0.7
// Project: https://github.com/facebook/react-native-fbsdk
// Definitions by: Ifiok Jr. <https://github.com/ifiokjr>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export type Permissions =
  | "public_profile"
  | "user_friends"
  | "email"
  | "user_about_me"
  | "user_actions.books"
  | "user_actions.fitness"
  | "user_actions.music"
  | "user_actions.news"
  | "user_actions.video"
  | "user_birthday"
  | "user_education_history"
  | "user_events"
  | "user_games_activity"
  | "user_hometown"
  | "user_likes"
  | "user_location"
  | "user_managed_groups"
  | "user_photos"
  | "user_posts"
  | "user_relationships"
  | "user_relationship_details"
  | "user_religion_politics"
  | "user_tagged_places"
  | "user_videos"
  | "user_website"
  | "user_work_history"
  | "read_custom_friendlists"
  | "read_insights"
  | "read_audience_network_insights"
  | "read_page_mailboxes"
  | "manage_pages"
  | "publish_pages"
  | "publish_actions"
  | "rsvp_event"
  | "pages_show_list"
  | "pages_manage_cta"
  | "pages_manage_instant_articles"
  | "ads_read"
  | "ads_management"
  | "business_management"
  | "pages_messaging"
  | "pages_messaging_subscriptions"
  | "pages_messaging_payments"
  | "pages_messaging_phone_number"
  | string;
// End type definition for reacct-native-fbsdk

export interface LoginResult {
  error: any;
  isCancelled: boolean;
  grantedPermissions?: Permissions[];
  declinedPermissions?: Permissions[];
}

export interface IFacebookSDK {
  loginWithPermission(permissions: Permissions[]): Promise<LoginResult>;
  getCurrentAccessToken(): Promise<string>;
}
