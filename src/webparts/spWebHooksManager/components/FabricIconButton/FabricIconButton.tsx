import * as React from 'react';
import { IFabricIconButtonProps } from './IFabricIconButtonProps';
import { autobind } from '@uifabric/utilities/lib';
import { TooltipHost, TooltipDelay } from 'office-ui-fabric-react/lib/Tooltip';

export default class FabricIconButton extends React.Component<IFabricIconButtonProps, {}> {
  constructor(props: IFabricIconButtonProps) {
    super(props);
  }

  @autobind
  private onClick(e) {
    debugger;

    console.log(e);
    this.props.onClick("");
  }

  public render(): React.ReactElement<IFabricIconButtonProps> {
    const { fabricIconName, tooltipText } = this.props;

    return (
      <TooltipHost content={tooltipText} delay={TooltipDelay.long}>
        <div className="fabricIconContainer">
          <div className="fabricIconCircle"></div>
          <div className="fabricIcon" onClick={this.onClick}>
            <i className={`ms-Icon ms-Icon--${fabricIconName}`} aria-hidden="true"></i>
          </div>
        </div>
      </TooltipHost>
    );
  }
}


