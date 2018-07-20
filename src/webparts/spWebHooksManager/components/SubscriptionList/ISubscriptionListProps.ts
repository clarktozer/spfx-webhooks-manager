import { IListSubscription } from "../../interfaces/IListSubscription";
import { IAddSubscription } from "../AddSubscriptionPanel/IAddSubscription";

export interface ISubscriptionListProps {
  listSubscription: IListSubscription;
  onDeleteSubscription: (listId: string, subscriptionId: string) => Promise<void>;
  onAddSubscription: (listId: string, subscription: IAddSubscription) => Promise<void>;
  onUpdateSubscription: (listId: string, subscriptionId: string, expirationDate: string) => Promise<void>;
}
