import { AddSubscriptionActionTypes } from '../actions/ActionTypes';
import { IAddSubscriptionState } from '../components/AddSubscriptionPanel/IAddSubscriptionState';
import { IAddSubscription } from '../components/AddSubscriptionPanel/IAddSubscription';
import { IPanelOptions } from '../interfaces/IPanelOptions';

export type IAddSubscriptionAction = IUpdateNewPropertyAction
| IAddSubscriptionSuccessAction
| IAddSubscriptionErrorAction
| IShowAddPanelAction
| IResetAddSubscriptionAction;

export interface IUpdateNewPropertyAction {
  type: AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY;
  propertyName: string;
  value: any;
}

export interface IAddSubscriptionSuccessAction {
  type: AddSubscriptionActionTypes.ADD_SUBSCRIPTION_SUCCESS;
}

export interface IAddSubscriptionErrorAction {
  type: AddSubscriptionActionTypes.ADD_SUBSCRIPTION_ERROR;
  error: string;
}

export interface IShowAddPanelAction {
  type: AddSubscriptionActionTypes.SHOW_ADD_PANEL;
  panelOptions: IPanelOptions;
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
        ...state,
        enabled: false,
        loading: false
      };
    case AddSubscriptionActionTypes.ADD_SUBSCRIPTION_ERROR:
      return {
        ...state,
        enabled: false,
        loading: false,
        error: action.error
      };
    case AddSubscriptionActionTypes.SHOW_ADD_PANEL:
      return {
        ...state,
        ...action.panelOptions
      };
    case AddSubscriptionActionTypes.RESET_ADD_SUBSCRIPTION:
      return {
        ...initialAddState
      };
    default:
      return state;
  }
}
