import { EditSubscriptionActionTypes, SubscriptionActionTypes } from "./ActionTypes";
import WebhookService from "../services/WebhookService/WebhookService";
import { onGetSubscriptions } from "./GetSubscriptions";
import { IEditPanelOptions } from "../interfaces/IPanelOptions";
import { ISubscription } from "../interfaces/ISubscription";

export function onUpdateProperty(propertyName: string, value: any) {
  return {
    type: EditSubscriptionActionTypes.UPDATE_EXISTING_PROPERTY,
    propertyName,
    value
  };
}

export function onEditSubscription(panelOptions: IEditPanelOptions) {
  return {
    type: EditSubscriptionActionTypes.SHOW_EDIT_PANEL,
    panelOptions
  };
}

export function onUpdateSubscription(subscription: ISubscription) {
  return async (dispatch) => {
    dispatch(onEditingSubscription(true));
    let webhookService = new WebhookService();

    try {
      await webhookService.onUpdateWebHook(subscription.resource, subscription.id, subscription.expirationDateTime);
      dispatch(onEditSubscriptionSuccess());
      dispatch(onGetSubscriptions());
    }
    catch (e) {
      dispatch(onEditSubscriptionsError(e.data.responseBody["odata.error"].message.value));
    }
  };
}

export function onEditSubscriptionsError(error: string) {
  return {
    type: SubscriptionActionTypes.SHOW_ERROR_DIALOG,
    error
  };
}

export function onEditSubscriptionSuccess() {
  return {
    type: EditSubscriptionActionTypes.EDIT_SUBSCRIPTION_SUCCESS
  };
}

export function onEditingSubscription(value: boolean) {
  return onUpdateProperty("loading", value);
}

export function onValidated(value: boolean) {
  return onUpdateProperty("validated", value);
}

export function onCancel() {
  return {
    type: EditSubscriptionActionTypes.RESET_EDIT_SUBSCRIPTION
  };
}
