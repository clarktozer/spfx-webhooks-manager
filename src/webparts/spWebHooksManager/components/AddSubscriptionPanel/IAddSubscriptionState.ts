import { IAddSubscription } from "./IAddSubscription";

export interface IAddSubscriptionState {
  clientState?: string;
  expirationDateTime: Date;
  notificationUrl: string;
  validated: boolean;
  loading: boolean;
  enabled: boolean;
  listId: string;
}

export interface IAddSubscriptionDispatch {
  onUpdateProperty: (key: string, value: any) => void;
  onAddingSubscription: (value: boolean) => void;
  onAddSubscription: (listId: string, subscription: IAddSubscription) => void;
  onValidated: (value: boolean) => void;
  onCancel: () => void;
}


export interface IAddSubscriptionProps extends IAddSubscriptionState, IAddSubscriptionDispatch {

}
