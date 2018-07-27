import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  IPropertyPaneField,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import SpWebHooksManager from './components/SpWebHooksManager';
import { ISpWebHooksManagerProps } from './components/ISpWebHooksManagerProps';
import { sp } from '@pnp/sp';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import startCase from 'lodash.startcase';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { ISpWebHooksManagerWebPartProps } from './interfaces/ISpWebHooksManagerWebPartProps';
import { QueryType } from './interfaces/QueryType';
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');

import { applyProperties, updateProperty } from './reducers/webpart';
import { createStore, IState } from './store';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { IReactReduxWebPartProps } from './IReactReduxWebPartProps';
import { autobind } from '@uifabric/utilities/lib';

export default class SpWebHooksManagerWebPart extends BaseClientSideWebPart<ISpWebHooksManagerWebPartProps> {
  private templateTypes: IPropertyPaneDropdownOption[];
  private store: Store<IState>;

  public constructor() {
    super();

    this.store = createStore();
  }

  public render(): void {
    if (this.renderedOnce) { return; }

    const element = (
      <Provider store={this.store}>
        <SpWebHooksManager updateWebPartProp={this.updateWebPartProp} />
      </Provider>
    );

    ReactDom.render(element, this.domElement);
  }

  @autobind
  private updateWebPartProp (key: string, value: string) {
    this.properties[key] = value;
  }

  protected get disableReactivePropertyChanges() {
    return false;
  }

  protected onPropertyPaneFieldChanged(propertyPath, oldValue, newValue) {
    if (!this.disableReactivePropertyChanges) {
      this.store.dispatch(updateProperty(propertyPath, newValue));
    }
  }

  protected onAfterPropertyPaneChangesApplied() {
    this.applyWebpartProps();
  }

  protected onInit(): Promise<void> {
    this.applyWebpartProps();

    this.templateTypes = Object.keys(SP.ListTemplateType)
      .filter(key => !isNaN(parseInt(SP.ListTemplateType[key])))
      .map((e) => {
        return {
          key: e,
          text: startCase(e)
        };
      });

    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  private applyWebpartProps() {
    this.store.dispatch(applyProperties({
      ...this.properties,
      displayMode: this.displayMode,
      listSubscriptions: [],
      loadingSubscriptions: false
    }));
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let {
      queryType,
      lists,
      listTemplateTypes,
    } = this.properties;

    let queryGroup: IPropertyPaneField<any>[] = [
      PropertyPaneDropdown('queryType', {
        label: strings.SelectQueryType,
        options: [
          {
            key: "list",
            text: strings.List
          },
          {
            key: "template",
            text: strings.Template
          }
        ]
      })
    ];

    if (queryType == QueryType.LIST) {
      queryGroup.push(
        PropertyFieldListPicker('lists', {
          label: strings.SelectList,
          selectedList: lists,
          includeHidden: false,
          orderBy: PropertyFieldListPickerOrderBy.Title,
          disabled: false,
          onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
          properties: this.properties,
          context: this.context,
          onGetErrorMessage: null,
          key: 'listPicker',
          multiSelect: true
        })
      );
    } else if (queryType == QueryType.TEMPLATE) {
      queryGroup.push(
        PropertyFieldMultiSelect('listTemplateTypes', {
          key: 'listTemplateTypes',
          label: strings.ListTemplateTypes,
          options: this.templateTypes,
          selectedKeys: listTemplateTypes
        })
      );
    }

    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: queryGroup
            }
          ]
        }
      ]
    };
  }
}
