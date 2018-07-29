import { AddSubscriptionActionTypes } from "./ActionTypes";

export function updateProperty(propertyName: string, value: any) {
  return {
    type: AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY,
    propertyName,
    value
  };
}

export function addingSubscription(value: boolean) {
  return updateProperty("loading", value);
}
