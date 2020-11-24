import { createAction } from "redux-actions";

//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

namespace NotifcationActions {
  export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";
  export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
}

export const showNotification = createAction<string>(NotifcationActions.SHOW_NOTIFICATION);
export const dismissNotification = createAction<string>(
  NotifcationActions.DISMISS_NOTIFICATION
);
