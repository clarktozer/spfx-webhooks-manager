import { combineReducers, Reducer } from 'redux';
import subscription from './GetSubscriptions';
import { IWebpartState } from '../components/ISpWebHooksManagerProps';
import { addSubscription } from './NewSubscription';
import { IAddSubscriptionState } from '../components/AddSubscriptionPanel/IAddSubscriptionState';
import { editSubscription } from './EditSubscription';
import { IEditSubscriptionState } from '../components/EditSubscriptionPanel/IEditSubscriptionState';

export interface IState {
  webpart: IWebpartState;
  newSubscription: IAddSubscriptionState;
  editSubscription: IEditSubscriptionState;
}

export const rootReducer: Reducer<IState> = combineReducers<IState>({
  webpart: subscription,
  newSubscription: addSubscription,
  editSubscription: editSubscription
});
