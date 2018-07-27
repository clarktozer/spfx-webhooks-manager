import { IReactReduxWebPartProps } from '../IReactReduxWebPartProps';
import assign from 'lodash.assign';
import { ISpWebHooksManagerWebPartProps } from '../interfaces/ISpWebHooksManagerWebPartProps';
import { ISpWebHooksManagerProps, IProp, IConnectedProps } from '../components/ISpWebHooksManagerProps';

// export interface IAll extends ISpWebHooksManagerProps, IProp, IConnectedProps {

// }

export interface IWebpartState {
  properties: ISpWebHooksManagerProps & IConnectedProps;
}

export const initialState: IWebpartState = {
  properties: {
    title: "",
    listTemplateTypes: [],
    lists: [],
    queryType: null,
    displayMode: null,
    listSubscriptions: [],
    loadingSubscriptions: false
  }
};

export enum Types {
  UPDATE_PROPERTY = 'webpart/UPDATE_PROPERTY',
  APPLY_PROPERTIES = 'webpart/APPLY_PROPERTIES'
}

export interface IUpdatePropertyAction {
  type: Types.UPDATE_PROPERTY;
  propertyName: string;
  value: any;
}
export interface IApplyPropertiesAction {
  type: Types.APPLY_PROPERTIES;
  properties: ISpWebHooksManagerProps & IConnectedProps;
}

export type IWebpartAction = IUpdatePropertyAction | IApplyPropertiesAction

export default (state = initialState, action: IWebpartAction) => {
  switch (action.type) {
    case Types.UPDATE_PROPERTY:
      return {
        ...state,
        properties: {
          ...state.properties,
          [action.propertyName]: action.value
        }
      }
    case Types.APPLY_PROPERTIES:
      return {
        ...state,
        properties: action.properties
      }
    default:
      return state;
  }
};

export function updateProperty(propertyName: string, value: any) {
  return { type: Types.UPDATE_PROPERTY, propertyName, value };
}

export function applyProperties(properties: ISpWebHooksManagerProps & IConnectedProps) {
  return { type: Types.APPLY_PROPERTIES, properties };
}
