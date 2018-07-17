import { ISubscription } from "../../interfaces/ISubscription";

export interface IEditSubscriptionProps {
  subscription: ISubscription;
  enabled: boolean;
  onUpdate: (expirationDateTime: string) => void;
  onClosePanel: () => void;
}
