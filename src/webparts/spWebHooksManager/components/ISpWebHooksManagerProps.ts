import { DisplayMode } from "@microsoft/sp-core-library";
import { QueryType } from "../interfaces/QueryType";
import { IListSubscription } from "../interfaces/IListSubscription";
import { ISpWebHooksManagerState } from "../interfaces/ISpWebHooksManagerState";
import { ISpWebHooksManagerWebPartProps } from "../interfaces/ISpWebHooksManagerWebPartProps";
import { IPropertyAction, ISubscriptionAction } from "../actions/Actions";

export interface ISpWebHooksManagerWebPartState {
  listTemplateTypes: string[];
  title: string;
  displayMode: DisplayMode;
  queryType: QueryType;
  lists: string[];
}

export interface ISpWebHooksManagerDispatch {
  updateProperty: (key: string, value: string) => void;
  setSubscriptionsLoading: (loading: boolean) => void;
  setError: () => void;
  setSubscriptions: (listSubscriptions: IListSubscription[]) => void;
}


export interface ISpWebHooksManagerProps extends ISpWebHooksManagerWebPartState, ISpWebHooksManagerDispatch, ISpWebHooksManagerState {

}

export interface IWebpartState extends ISpWebHooksManagerWebPartProps, ISpWebHooksManagerState {

}

export type IWebpartAction  = IPropertyAction | ISubscriptionAction;

export const initialState: IWebpartState = {
  title: "",
  listTemplateTypes: [],
  lists: [],
  queryType: null,
  displayMode: null,
  listSubscriptions: [],
  loadingSubscriptions: false
};
