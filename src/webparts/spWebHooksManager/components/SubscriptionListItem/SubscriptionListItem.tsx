import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListItemProps } from './ISubscriptionListItemProps';
import { ISubscriptionListItemState } from './ISubscriptionListItemState';
import EditSubscriptionPanel from '../EditSubscriptionPanel/EditSubscriptionPanel';

export default class SubscriptionListItem extends React.Component<ISubscriptionListItemProps, ISubscriptionListItemState> {
  constructor(props: ISubscriptionListItemProps) {
    super(props);

    this.state = {
      showEditPanel: false
    };
  }

  @autobind
  private onDelete() {
    this.props.onDeleteSubscription(this.props.subscription.id);
  }

  @autobind
  private onUpdate(expirationDateTime: string) {
    this.props.onUpdateSubscription(this.props.subscription.id, expirationDateTime);
  }

  @autobind
  private onClosePanel() {
    this.setState({
      showEditPanel: false
    });
  }

  @autobind
  private onEnablePanel() {
    this.setState({
      showEditPanel: true
    });
  }

  public render(): React.ReactElement<ISubscriptionListItemProps> {
    let { subscription } = this.props;
    return (
      <div key={subscription.id}>
        <i className={" ms-Icon ms-Icon--ChromeClose"} aria-hidden="true" onClick={this.onDelete}></i>
        <i className={" ms-Icon ms-Icon--EditSolid12"} aria-hidden="true" onClick={this.onEnablePanel}></i>
        <ul>
          <li>Client State: {subscription.clientState}</li>
          <li>Expiration Date Time: {subscription.expirationDateTime}</li>
          <li>Resource: {subscription.resource}</li>
          <li>Notification URL: {subscription.notificationUrl}</li>
        </ul>
        <EditSubscriptionPanel
          enabled={this.state.showEditPanel}
          subscription={subscription}
          onClosePanel={this.onClosePanel}
          onUpdate={this.onUpdate} />
      </div>
    );
  }
}
