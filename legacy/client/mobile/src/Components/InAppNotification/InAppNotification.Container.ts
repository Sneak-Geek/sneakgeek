//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { IAppState } from "../../Store";
import { connect } from "react-redux";
import { InAppNotification } from "./InAppNotification";
import { dismissNotification } from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
  notifications: state.NotificationState.notifications
});

const mapDispatchToProps = (dispatch: Function) => ({
  dismissNotification: (id: string) => dispatch(dismissNotification(id))
});

export const InAppNotifcationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InAppNotification);
