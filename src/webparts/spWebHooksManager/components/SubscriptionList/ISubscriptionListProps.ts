import { IListSubscription } from "../../interfaces/IListSubscription";
import { IAddSubscription } from "../AddSubscriptionPanel/IAddSubscription";

export interface ISubscriptionListProps {
  listSubscription: IListSubscription;
  onDeleteSubscription: (listId: string, subscriptionId: string) => void;
  onAddSubscription: (listId: string, subscription: IAddSubscription) => void;
  onUpdateSubscription: (listId: string, subscriptionId: string, expirationDate: string) => void;
}
