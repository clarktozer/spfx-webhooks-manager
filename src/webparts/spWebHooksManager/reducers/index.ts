import { combineReducers, Reducer } from 'redux';
import { subscriptions } from './Subscriptions';
import { IWebpartState } from '../components/ISpWebHooksManagerProps';
import { addSubscription } from './Addsubscription';
import { IAddSubscriptionState } from '../components/AddSubscriptionPanel/IAddSubscriptionState';

export interface IState {
  webpart: IWebpartState;
  subscription: IAddSubscriptionState;
}

export const rootReducer: Reducer<IState> = combineReducers<IState>({
  webpart: subscriptions,
  subscription: addSubscription
});
