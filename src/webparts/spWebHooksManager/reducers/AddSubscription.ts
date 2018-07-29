import { AddSubscriptionActionTypes } from '../actions/ActionTypes';
import { IAddSubscriptionState } from '../components/AddSubscriptionPanel/IAddSubscriptionState';

export type IAddSubscriptionAction = IUpdateNewPropertyAction;

export interface IUpdateNewPropertyAction {
  type: AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY;
  propertyName: string;
  value: any;
}

export const initialAddState: IAddSubscriptionState = {
  expirationDateTime: null,
  notificationUrl: "",
  error: true,
  loading: false,
  enabled: false
};

export function addSubscription(state = initialAddState, action: IAddSubscriptionAction) {
  switch (action.type) {
    case AddSubscriptionActionTypes.UPDATE_NEW_PROPERTY:
      return {
        ...state,
        [action.propertyName]: action.value
      }
    default:
      return state;
  }
};
