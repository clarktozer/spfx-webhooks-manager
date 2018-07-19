import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListItemProps } from './ISubscriptionListItemProps';
import { ISubscriptionListItemState } from './ISubscriptionListItemState';
import EditSubscriptionPanel from '../EditSubscriptionPanel/EditSubscriptionPanel';
import FabricIconButton from '../FabricIconButton/FabricIconButton';

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
      <div className="subscriptionItem" key={subscription.id}>
        <h4 className="subscriptionItemHeader clearfix">
          Subscription
          <div className="fRight">
            <FabricIconButton
              key="edit"
              fabricIconName="Edit"
              onClick={this.onEnablePanel}
              tooltipText="Edit Subscription"
            />
            <FabricIconButton
              key="delete"
              fabricIconName="ChromeClose"
              onClick={this.onDelete}
              tooltipText="Delete Subscription"
            />
          </div>
        </h4>
        <ul className="listUnstyled">
          <li>
            <label>ID</label>
            <div className="subscriptionProp">{subscription.id}</div>
          </li>
          <li>
            <label>Expiration Date</label>
            <div className="subscriptionProp">{subscription.expirationDateTime}</div>
          </li>
          <li>
            <label>Resource</label>
            <div className="subscriptionProp">{subscription.resource}</div>
          </li>
          <li>
            <label>Notification URL</label>
            <div className="subscriptionProp">{subscription.notificationUrl}</div>
          </li>
          <li>
            <label>Client State</label>
            <div className="subscriptionProp">
              {
                subscription.clientState != null && subscription.clientState.length > 0 ?
                  subscription.clientState : "N/A"
              }
            </div>
          </li>
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
