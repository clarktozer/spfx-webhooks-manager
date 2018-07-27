import { DisplayMode } from "@microsoft/sp-core-library";
import { QueryType } from "../interfaces/QueryType";
import { IListSubscription } from "../interfaces/IListSubscription";

export interface ISpWebHooksManagerProps {
  listTemplateTypes: string[];
  title: string;
  displayMode: DisplayMode;
  queryType: QueryType;
  lists: string[];
}

export interface IConnectedProps {
  listSubscriptions: IListSubscription[];
  loadingSubscriptions: boolean;
  error?: boolean;
}

export interface IConnectedDispatch {
  updateProperty: (value: string) => void;
  setSubscriptionsLoading: (loading: boolean) => void;
  setError: () => void;
  setSubscriptions: (listSubscriptions: IListSubscription[]) => void;
}

export interface IProp {
  updateWebPartProp: (key: string, value: any) => void;
}
