import { IListSubscription } from "./IListSubscription";

export interface ISpWebHooksManagerState {
  listSubscriptions: IListSubscription[];
  loading: boolean;
}
