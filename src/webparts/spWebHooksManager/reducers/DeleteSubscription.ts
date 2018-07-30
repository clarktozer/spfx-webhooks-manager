import { DeleteSubscriptionActionTypes, SubscriptionActionTypes } from "../actions/ActionTypes";
import { IShowErrorDialogAction } from "../actions/Actions";

// import { EditSubscriptionActionTypes, SubscriptionActionTypes } from "../actions/ActionTypes";
// import { IEditSubscriptionState } from "../components/EditSubscriptionPanel/IEditSubscriptionState";
// import { IEditPanelOptions } from "../interfaces/IPanelOptions";
// import { ISubscription } from "../interfaces/ISubscription";
// import { IShowErrorDialogAction } from "../actions/Actions";


export type IDeleteSubscriptionAction = IUpdateExistingPropertyAction | IShowDeleteDialogAction | IEditSubscriptionSuccessAction | IShowErrorDialogAction;

export interface IUpdateExistingPropertyAction {
  type: DeleteSubscriptionActionTypes.UPDATE_EXISTING_PROPERTY;
  propertyName: string;
  value: any;
}

export interface IEditSubscriptionSuccessAction {
  type: DeleteSubscriptionActionTypes.DELETE_SUBSCRIPTION_SUCCESS;
}

export interface IShowDeleteDialogAction {
  type: DeleteSubscriptionActionTypes.SHOW_DELETE_DIALOG;
  deleteDialogEnabled: boolean;
}

export interface IDeleteSubscriptionState {
  deleting: boolean;
  deleteDialogEnabled: boolean;
}

export const initialDeleteState: IDeleteSubscriptionState = {
  deleting: false,
  deleteDialogEnabled: false
};

export function deleteSubscription(state = initialDeleteState, action: IDeleteSubscriptionAction) {
  switch (action.type) {
    case DeleteSubscriptionActionTypes.UPDATE_EXISTING_PROPERTY:
      return {
        ...state,
        [action.propertyName]: action.value
      };
    case DeleteSubscriptionActionTypes.DELETE_SUBSCRIPTION_SUCCESS:
      return {
        ...initialDeleteState
      };
    case SubscriptionActionTypes.SHOW_ERROR_DIALOG:
      return {
        ...state,
        enabled: false,
        loading: false
      };
    case DeleteSubscriptionActionTypes.SHOW_DELETE_DIALOG:
      return {
        ...state,
        deleteDialogEnabled: action.deleteDialogEnabled
      };
    default:
      return state;
  }
}
