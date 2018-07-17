import { IODataList } from "@microsoft/sp-odata-types";
import { ISubscription } from "./ISubscription";

export interface IListSubscription {
  list: IODataList;
  subscriptions: ISubscription[];
}
