import { ISubscription } from "../../interfaces/ISubscription";

export interface IEditSubscriptionState {
  subscription: ISubscription;
  loading: boolean;
  validated: boolean;
  enabled: boolean;
}

export interface IEditSubscriptionDispatch {
  onUpdateProperty: (key: string, value: ISubscription) => void;
  onEditingSubscription: (value: boolean) => void;
  onUpdateSubscription: (subscription: ISubscription) => void;
  onValidated: (value: boolean) => void;
  onCancel: () => void;
}

export interface IEditSubscriptionProps extends IEditSubscriptionState, IEditSubscriptionDispatch {

}
