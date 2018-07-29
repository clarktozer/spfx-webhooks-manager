import { IWebpartAction, initialState } from '../components/ISpWebHooksManagerProps';
import { SubscriptionActionTypes } from '../actions/ActionTypes';

export function subscriptions(state = initialState, action: IWebpartAction) {
  switch (action.type) {
    case SubscriptionActionTypes.UPDATE_PROPERTY:
      return {
        ...state,
        [action.propertyName]: action.value
      }
    case SubscriptionActionTypes.APPLY_PROPERTIES:
      return {
        ...state,
        ...action.properties
      }
    case SubscriptionActionTypes.GET_SUBSCRIPTIONS_SUCCESS:
      return {
        ...state,
        listSubscriptions: action.items,
        loadingSubscriptions: false,
        error: null
      };
    case SubscriptionActionTypes.GET_SUBSCRIPTIONS_ERROR:
      return {
        ...state,
        listSubscriptions: [],
        loadingSubscriptions: false,
        error: action.error
      };
    default:
      return state;
  }
};
