import WebhookService from "../services/WebhookService/WebhookService";
import { IListSubscription } from "../interfaces/IListSubscription";
import { SubscriptionActionTypes } from "./ActionTypes";
import { IWebpartState } from "../components/ISpWebHooksManagerProps";
import { IState } from "../store";

export function onSubscriptionsIsLoading(value: boolean) {
  return onUpdateProperty("loadingSubscriptions", value);
}

export function onGetSubscriptionsError(error: string) {
  return {
    type: SubscriptionActionTypes.GET_SUBSCRIPTIONS_ERROR,
    error
  };
}

export function onGetSubscriptionsSuccess(items: IListSubscription[]) {
  return {
    type: SubscriptionActionTypes.GET_SUBSCRIPTIONS_SUCCESS,
    items
  };
}

export function onUpdateProperty(propertyName: string, value: any) {
  return {
    type: SubscriptionActionTypes.UPDATE_PROPERTY,
    propertyName,
    value
  };
}

export function onApplyProperties(properties: IWebpartState) {
  return {
    type: SubscriptionActionTypes.APPLY_PROPERTIES,
    properties
  };
}

export function onGetSubscriptions() {
  return async (dispatch, getState: () => IState) => {
    dispatch(onSubscriptionsIsLoading(true));
    let webhookService = new WebhookService();

    try {
      const { webpart } = getState();
      let subscriptions = await webhookService.getSubscriptions(webpart.queryType, webpart.lists, webpart.listTemplateTypes);
      dispatch(onGetSubscriptionsSuccess(subscriptions));
    }
    catch (e) {
      dispatch(onGetSubscriptionsError(e.data != null ? e.data.responseBody["odata.error"].message.value : e));
    }
  };
}
