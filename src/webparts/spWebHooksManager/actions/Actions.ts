import { SubscriptionActionTypes, AddSubscriptionActionTypes } from "./ActionTypes";
import { IListSubscription } from "../interfaces/IListSubscription";
import { IWebpartState } from "../components/ISpWebHooksManagerProps";

export interface IUpdatePropertyAction {
  type: SubscriptionActionTypes.UPDATE_PROPERTY;
  propertyName: string;
  value: any;
}

export interface IApplyPropertiesAction {
  type: SubscriptionActionTypes.APPLY_PROPERTIES;
  properties: IWebpartState;
}

export type IPropertyAction = IUpdatePropertyAction | IApplyPropertiesAction;

export interface ISubscriptionSuccessAction {
  type: SubscriptionActionTypes.GET_SUBSCRIPTIONS_SUCCESS;
  items: IListSubscription[];
}

export interface ISubscriptionErrorAction {
  type: SubscriptionActionTypes.GET_SUBSCRIPTIONS_ERROR;
  error: string;
}

export interface IShowErrorDialogAction {
  type: SubscriptionActionTypes.SHOW_ERROR_DIALOG;
  error: string;
}

export type ISubscriptionAction = ISubscriptionSuccessAction | ISubscriptionErrorAction | IShowErrorDialogAction;

