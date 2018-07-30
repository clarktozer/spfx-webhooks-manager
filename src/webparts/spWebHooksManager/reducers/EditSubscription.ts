import { EditSubscriptionActionTypes, SubscriptionActionTypes } from "../actions/ActionTypes";
import { IEditSubscriptionState } from "../components/EditSubscriptionPanel/IEditSubscriptionState";
import { IEditPanelOptions } from "../interfaces/IPanelOptions";
import { ISubscription } from "../interfaces/ISubscription";
import { IShowErrorDialogAction } from "../actions/Actions";


export type IEditSubscriptionAction = IUpdateExistingPropertyAction
  | IEditSubscriptionSuccessAction
  | IEditSubscriptionErrorAction
  | IShowEditPanelAction
  | IResetEditSubscriptionAction
  | IShowErrorDialogAction;

export interface IUpdateExistingPropertyAction {
  type: EditSubscriptionActionTypes.UPDATE_EXISTING_PROPERTY;
  propertyName: string;
  value: any;
}

export interface IEditSubscriptionSuccessAction {
  type: EditSubscriptionActionTypes.EDIT_SUBSCRIPTION_SUCCESS;
}

export interface IEditSubscriptionErrorAction {
  type: EditSubscriptionActionTypes.EDIT_SUBSCRIPTION_ERROR;
  error: string;
}

export interface IShowEditPanelAction {
  type: EditSubscriptionActionTypes.SHOW_EDIT_PANEL;
  panelOptions: IEditPanelOptions;
}

export interface IResetEditSubscriptionAction {
  type: EditSubscriptionActionTypes.RESET_EDIT_SUBSCRIPTION;
}

export const initialSubscription: ISubscription = {
  clientState: "",
  expirationDateTime: "",
  id: "",
  notificationUrl: "",
  resource: ""
};

export const initialAddState: IEditSubscriptionState = {
  subscription: initialSubscription,
  validated: false,
  loading: false,
  enabled: false
};

export function editSubscription(state = initialAddState, action: IEditSubscriptionAction) {
  switch (action.type) {
    case EditSubscriptionActionTypes.UPDATE_EXISTING_PROPERTY:
      return {
        ...state,
        [action.propertyName]: action.value
      };
    case EditSubscriptionActionTypes.EDIT_SUBSCRIPTION_SUCCESS:
      return {
        ...initialAddState
      };
    case EditSubscriptionActionTypes.SHOW_EDIT_PANEL:
      return {
        ...state,
        ...action.panelOptions
      };
    case EditSubscriptionActionTypes.RESET_EDIT_SUBSCRIPTION:
      return {
        ...initialAddState
      };
    case SubscriptionActionTypes.SHOW_ERROR_DIALOG:
      return {
        ...state,
        enabled: false,
        loading: false
      };
    default:
      return state;
  }
}
