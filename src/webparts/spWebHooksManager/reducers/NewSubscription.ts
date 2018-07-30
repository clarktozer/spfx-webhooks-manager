import { AddSubscriptionActionTypes, SubscriptionActionTypes } from '../actions/ActionTypes';
import { IAddSubscriptionState } from '../components/AddSubscriptionPanel/IAddSubscriptionState';
import { IAddPanelOptions } from '../interfaces/IPanelOptions';
import { IShowErrorDialogAction } from '../actions/Actions';

export type IAddSubscriptionAction = IUpdateNewPropertyAction
| IAddSubscriptionSuccessAction
| IShowAddPanelAction
| IResetAddSubscriptionAction
| IShowErrorDialogAction;

export interface IUpdateNewPropertyAction {
  type: AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY;
  propertyName: string;
  value: any;
}

export interface IAddSubscriptionSuccessAction {
  type: AddSubscriptionActionTypes.ADD_SUBSCRIPTION_SUCCESS;
}

export interface IShowAddPanelAction {
  type: AddSubscriptionActionTypes.SHOW_ADD_PANEL;
  panelOptions: IAddPanelOptions;
}

export interface IResetAddSubscriptionAction {
  type: AddSubscriptionActionTypes.RESET_ADD_SUBSCRIPTION;
}

export const initialAddState: IAddSubscriptionState = {
  expirationDateTime: null,
  notificationUrl: "",
  validated: false,
  loading: false,
  enabled: false,
  listId: ""
};

export function addSubscription(state = initialAddState, action: IAddSubscriptionAction) {
  switch (action.type) {
    case AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY:
      return {
        ...state,
        [action.propertyName]: action.value
      };
    case AddSubscriptionActionTypes.ADD_SUBSCRIPTION_SUCCESS:
      return {
        ...initialAddState
      };
    case AddSubscriptionActionTypes.SHOW_ADD_PANEL:
      return {
        ...state,
        ...action.panelOptions
      };
    case SubscriptionActionTypes.SHOW_ERROR_DIALOG:
      return {
        ...state,
        enabled: false,
        loading: false
      };
    case AddSubscriptionActionTypes.RESET_ADD_SUBSCRIPTION:
      return {
        ...initialAddState
      };
    default:
      return state;
  }
}
