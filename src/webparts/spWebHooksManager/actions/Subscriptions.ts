import WebhookService from "../services/WebhookService/WebhookService";
import { IListSubscription } from "../interfaces/IListSubscription";
import { SubscriptionActionTypes } from "./ActionTypes";
import { IWebpartState } from "../components/ISpWebHooksManagerProps";

export function subscriptionsIsLoading(value: boolean) {
  return updateProperty("loadingSubscriptions", value);
}

export function subscriptionsError(error: string) {
  return {
    type: SubscriptionActionTypes.GET_SUBSCRIPTIONS_ERROR,
    error
  }
}

export function getSubscriptionsSuccess(items: IListSubscription[]) {
  return {
    type: SubscriptionActionTypes.GET_SUBSCRIPTIONS_SUCCESS,
    items
  };
}

export function updateProperty(propertyName: string, value: any) {
  return {
    type: SubscriptionActionTypes.UPDATE_PROPERTY,
    propertyName,
    value
  };
}

export function applyProperties(properties: IWebpartState) {
  return {
    type: SubscriptionActionTypes.APPLY_PROPERTIES,
    properties
  };
}

export function getSubscriptions() {
  return async (dispatch, getState: () => IWebpartState) => {
    dispatch(subscriptionsIsLoading(true));
    let webhookService = new WebhookService();

    try {
      const { queryType, listTemplateTypes, lists } = getState();
      let subscriptions = await webhookService.getSubscriptions(queryType, listTemplateTypes, lists);
      dispatch(getSubscriptionsSuccess(subscriptions));
    }
    catch (e) {
      dispatch(subscriptionsError(e.data.responseBody["odata.error"].message.value));
    }
  };
}
