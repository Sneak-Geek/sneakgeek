//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { createAction } from "redux-actions";
import { ModalTypes } from "../Components/Modal/ModalTypes";

export module ModalActionsConstant {
  export const DISPLAY_MODAL_BY_NAME = "DISPLAY_MODAL_BY_NAME";
  export const DISMISS_MODAL = "DISMISS_MODAL";
}

export interface ModalPayload {
  modalType: ModalTypes;
  data: any;
}

export const displayModal = createAction<ModalPayload>(
  ModalActionsConstant.DISPLAY_MODAL_BY_NAME
);
export const dismissModal = createAction(ModalActionsConstant.DISMISS_MODAL);
