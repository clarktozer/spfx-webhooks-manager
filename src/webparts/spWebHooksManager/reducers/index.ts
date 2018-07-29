import { combineReducers, Reducer } from 'redux';
import subscription from './GetSubscriptions';
import { IWebpartState } from '../components/ISpWebHooksManagerProps';
import { addSubscription } from './NewSubscription';
import { IAddSubscriptionState } from '../components/AddSubscriptionPanel/IAddSubscriptionState';

export interface IState {
  webpart: IWebpartState;
  subscription: IAddSubscriptionState;
}

export const rootReducer: Reducer<IState> = combineReducers<IState>({
  webpart: subscription,
  subscription: addSubscription
});
