import { ISubscription } from "../../interfaces/ISubscription";
import { IEditPanelOptions } from "../../interfaces/IPanelOptions";

export interface ISubscriptionListItemState {
  subscription: ISubscription;
}

export interface ISubscriptionListItemDispatch {
  onEditSubscription: (panelOptions: IEditPanelOptions) => void;
  onDeleteSubscription: (listId: string, subscriptionId: string) => void;
}

export interface ISubscriptionListItemProps extends ISubscriptionListItemState, ISubscriptionListItemDispatch {

}
