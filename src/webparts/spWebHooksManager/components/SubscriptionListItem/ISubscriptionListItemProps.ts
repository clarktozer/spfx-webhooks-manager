import { ISubscription } from "../../interfaces/ISubscription";

export interface ISubscriptionListItemProps {
  subscription: ISubscription;
  onDeleteSubscription: (subscriptionId: string) => void;
  onUpdateSubscription: (subscriptionId: string, expirationDate: string) => Promise<void>;
}
