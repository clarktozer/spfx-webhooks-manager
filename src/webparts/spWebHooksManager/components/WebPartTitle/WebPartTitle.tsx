import * as React from 'react';
import { DisplayMode } from '@microsoft/sp-core-library';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import { autobind } from '@uifabric/utilities/lib';

export interface IWebPartTitleProps {
  propertyKey: string;
  title: string;
  displayMode: DisplayMode;
  updateTitle: (key: string, value: string) => void;
}

export default class WebPartTitleWrapper extends React.Component<IWebPartTitleProps, {}> {
  constructor(props: IWebPartTitleProps) {
    super(props);
  }

  @autobind
  private updateTitle(value: string) {
    this.props.updateTitle(this.props.propertyKey, value);
  }

  public render(): React.ReactElement<IWebPartTitleProps> {
    const { title, displayMode } = this.props;

    return (
      <WebPartTitle displayMode={displayMode}
        title={title}
        updateProperty={this.updateTitle} />
    );
  }
}


