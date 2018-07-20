import { IListSubscription } from "./IListSubscription";

export interface ISpWebHooksManagerState {
  listSubscriptions: IListSubscription[];
  loadingSubscriptions: boolean;
  error?: boolean;
}
