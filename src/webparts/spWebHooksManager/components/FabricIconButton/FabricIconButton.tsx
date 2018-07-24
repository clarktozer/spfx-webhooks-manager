import * as React from 'react';
import { IFabricIconButtonProps } from './IFabricIconButtonProps';
import { autobind } from '@uifabric/utilities/lib';
import { TooltipHost, TooltipDelay } from 'office-ui-fabric-react/lib/Tooltip';
import styles from '../SpWebHooksManager.module.scss';

export default class FabricIconButton extends React.Component<IFabricIconButtonProps, {}> {
  constructor(props: IFabricIconButtonProps) {
    super(props);
  }

  @autobind
  private onClick(e: React.SyntheticEvent<HTMLElement>) {
    this.props.onClick(e.currentTarget.getAttribute("data-key"));
  }

  public render(): React.ReactElement<IFabricIconButtonProps> {
    const { fabricIconName, tooltipText, stateKey } = this.props;

    return (
      <TooltipHost content={tooltipText} delay={TooltipDelay.long}>
        <div className={styles.fabricIconContainer}>
          <div className={styles.fabricIconCircle}></div>
          <div className={styles.fabricIcon} onClick={this.onClick} data-key={stateKey}>
            <i className={`ms-Icon ms-Icon--${fabricIconName}`} aria-hidden="true"></i>
          </div>
        </div>
      </TooltipHost>
    );
  }
}


