import WebhookService from "../services/WebhookService/WebhookService";
import { SubscriptionActionTypes, DeleteSubscriptionActionTypes } from "./ActionTypes";
import { onGetSubscriptions } from "./GetSubscriptions";

export function onDeleteSubscription(listId: string, subscriptionId: string) {
  return async (dispatch) => {
    dispatch(onDeletingSubscription(true));
    let webhookService = new WebhookService();

    try {
      await webhookService.onDeleteWebHook(listId, subscriptionId);
      dispatch(onDeleteSubscriptionSuccess());
      dispatch(onGetSubscriptions());
    }
    catch (e) {
      dispatch(onDeleteSubscriptionsError(e.data.responseBody["odata.error"].message.value));
    }
  };
}

export function onUpdateProperty(propertyName: string, value: any) {
  return {
    type: DeleteSubscriptionActionTypes.UPDATE_EXISTING_PROPERTY,
    propertyName,
    value
  };
}

export function onDeletingSubscription(value: boolean) {
  return onUpdateProperty("loading", value);
}

export function onDeleteSubscriptionSuccess() {
  return {
    type: DeleteSubscriptionActionTypes.DELETE_SUBSCRIPTION_SUCCESS
  };
}

export function onDeleteSubscriptionsError(error: string) {
  return {
    type: SubscriptionActionTypes.SHOW_ERROR_DIALOG,
    error
  };
}
