import { IListSubscription } from "../../interfaces/IListSubscription";

export interface ISubscriptionListState {
  listSubscription: IListSubscription;
}

export interface ISubscriptionListDispatch {
  onAddNewSubscription: ({listId: string, enabled: boolean}) => void;
}

export interface ISubscriptionListProps extends ISubscriptionListState, ISubscriptionListDispatch {

}
