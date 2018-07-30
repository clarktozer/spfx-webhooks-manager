import { AddSubscriptionActionTypes, SubscriptionActionTypes } from "./ActionTypes";
import { IAddSubscription } from "../components/AddSubscriptionPanel/IAddSubscription";
import WebhookService from "../services/WebhookService/WebhookService";
import { onGetSubscriptions, onGetSubscriptionsError } from "./GetSubscriptions";
import { IAddPanelOptions } from "../interfaces/IPanelOptions";

export function onUpdateProperty(propertyName: string, value: any) {
  return {
    type: AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY,
    propertyName,
    value
  };
}

export function onAddNewSubscription(panelOptions: IAddPanelOptions) {
  return {
    type: AddSubscriptionActionTypes.SHOW_ADD_PANEL,
    panelOptions
  };
}

export function onAddSubscription(listId: string, subscription: IAddSubscription) {
  return async (dispatch) => {
    dispatch(onAddingSubscription(true));
    let webhookService = new WebhookService();
    try {
      await webhookService.onAddWebHook(listId, subscription);
      dispatch(onAddSubscriptionSuccess());
      dispatch(onGetSubscriptions());
    }
    catch (e) {
      dispatch(onAddSubscriptionsError(e.data.responseBody["odata.error"].message.value));
    }
  };
}

export function onAddSubscriptionsError(error: string) {
  return {
    type: SubscriptionActionTypes.SHOW_ERROR_DIALOG,
    error
  };
}

export function onAddSubscriptionSuccess() {
  return {
    type: AddSubscriptionActionTypes.ADD_SUBSCRIPTION_SUCCESS
  };
}

export function onAddingSubscription(value: boolean) {
  return onUpdateProperty("loading", value);
}

export function onValidated(value: boolean) {
  return onUpdateProperty("validated", value);
}

export function onCancel() {
  return {
    type: AddSubscriptionActionTypes.RESET_ADD_SUBSCRIPTION
  };
}
