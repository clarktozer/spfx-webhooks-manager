import { IAddSubscription } from "./IAddSubscription";

export interface IAddSubscriptionProps {
  enabled: boolean;
  onAdd: (subscription: IAddSubscription) => void;
  onClosePanel: () => void;
}
