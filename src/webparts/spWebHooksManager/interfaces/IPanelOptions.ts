import { ISubscription } from "./ISubscription";

export interface IAddPanelOptions {
  listId: string;
  enabled: boolean;
}

export interface IEditPanelOptions {
  subscription: ISubscription;
  enabled: boolean;
}
