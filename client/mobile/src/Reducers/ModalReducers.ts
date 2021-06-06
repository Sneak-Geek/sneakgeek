// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action } from "redux-actions";
import { ModalTypes } from "../Components/Modal/ModalTypes";
import { dismissModal, displayModal, ModalPayload } from "../Actions";
import { handleActionsWithReset } from "../Utilities/ReduxUtilities";

export interface IModalState {
  modalType: ModalTypes;
  modalData?: any;
}

const initialState: IModalState = {
  modalType: ModalTypes.None,
  modalData: null
};

export const ModalReducers = handleActionsWithReset<IModalState, any>(
  {
    [`${displayModal}`]: (state: IModalState, action: Action<ModalPayload>) => {
      return {
        ...state,
        modalType: action.payload.modalType,
        modalData: action.payload.data
      };
    },
    [`${dismissModal}`]: (state: IModalState, _: Action<string>) => {
      return { ...state, modalType: ModalTypes.None, modalData: null };
    }
  },
  initialState
);
