import { IAddSubscription } from "./IAddSubscription";

export interface IAddSubscriptionState {
  clientState?: string;
  expirationDateTime: Date;
  notificationUrl: string;
  error: boolean;
  loading: boolean;
  enabled: boolean;
}

export interface IAddSubscriptionDispatch {
  updateProperty: (key: string, value: any) => void;
  addingSubscription: (adding: boolean) => void;
  addSubscription: (subscription: IAddSubscription) => void;
}


export interface IAddSubscriptionProps extends IAddSubscriptionState, IAddSubscriptionDispatch {

}
