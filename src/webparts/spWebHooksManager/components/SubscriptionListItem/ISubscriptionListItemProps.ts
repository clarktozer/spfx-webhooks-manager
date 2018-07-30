import { ISubscription } from "../../interfaces/ISubscription";
import { IEditPanelOptions } from "../../interfaces/IPanelOptions";

export interface ISubscriptionListItemState {
  subscription: ISubscription;
  deleting: boolean;
  deleteDialogEnabled: boolean;
}

export interface ISubscriptionListItemDispatch {
  onEditSubscription: (panelOptions: IEditPanelOptions) => void;
  onDeleteSubscription: (listId: string, subscriptionId: string) => void;
  onToggleDeleteDialog: (enabled: boolean) => void;
}

export interface ISubscriptionListItemProps extends ISubscriptionListItemState, ISubscriptionListItemDispatch {

}
