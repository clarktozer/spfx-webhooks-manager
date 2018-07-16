import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import SpWebHooksManager from './components/SpWebHooksManager';
import { ISpWebHooksManagerProps } from './components/ISpWebHooksManagerProps';
import { sp } from '@pnp/sp';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import startCase from 'lodash.startcase';
require('sp-init');
require('microsoft-ajax');
require('sp-runtime');
require('sharepoint');
export interface ISpWebHooksManagerWebPartProps {
  showAdminButtons: boolean;
  listTemplateTypes: string[];
  title: string;
}

export default class SpWebHooksManagerWebPart extends BaseClientSideWebPart<ISpWebHooksManagerWebPartProps> {
  private templateTypes: IPropertyPaneDropdownOption[];

  public render(): void {
    const element: React.ReactElement<ISpWebHooksManagerProps> = React.createElement(
      SpWebHooksManager,
      {
        showAdminButtons: this.properties.showAdminButtons,
        listTemplateTypes: this.properties.listTemplateTypes,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        title: this.properties.title
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected onInit(): Promise<void> {
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

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldMultiSelect('listTemplateTypes', {
                  key: 'listTemplateTypes',
                  label: "List Template Types",
                  options: this.templateTypes,
                  selectedKeys: this.properties.listTemplateTypes
                }),
                PropertyPaneCheckbox('showAdminButtons', {
                  text: "Show Admin Buttons?"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
