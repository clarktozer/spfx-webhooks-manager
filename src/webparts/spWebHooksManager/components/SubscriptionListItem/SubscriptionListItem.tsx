import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListItemProps } from './ISubscriptionListItemProps';
import { ISubscriptionListItemState } from './ISubscriptionListItemState';
import EditSubscriptionPanel from '../EditSubscriptionPanel/EditSubscriptionPanel';
import FabricIconButton from '../FabricIconButton/FabricIconButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

export default class SubscriptionListItem extends React.Component<ISubscriptionListItemProps, ISubscriptionListItemState> {
  constructor(props: ISubscriptionListItemProps) {
    super(props);

    this.state = {
      showEditPanel: false,
      showDeletePanel: false
    };
  }

  @autobind
  private async onDelete() {
    await this.props.onDeleteSubscription(this.props.subscription.id);
  }

  @autobind
  private async onUpdate(expirationDateTime: string): Promise<void> {
    await this.props.onUpdateSubscription(this.props.subscription.id, expirationDateTime);
  }

  @autobind
  private onToggle(e) {
    console.log(e);
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

  @autobind
  private showDeleteDialog() {
    this.setState({
      showDeletePanel: true
    });
  }

  @autobind
  private closeDeleteDialog() {
    this.setState({
      showDeletePanel: false
    });
  }

  public render(): React.ReactElement<ISubscriptionListItemProps> {
    const { subscription } = this.props;
    const { showEditPanel, showDeletePanel } = this.state;

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
              key="showDeletePanel"
              fabricIconName="ChromeClose"
              onClick={this.onToggle}
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
        {
          showEditPanel ?
            <EditSubscriptionPanel
              key={"edit-" + subscription.id}
              enabled={showEditPanel}
              subscription={subscription}
              onClosePanel={this.onClosePanel}
              onUpdate={this.onUpdate} />
            : null
        }
        {
          showDeletePanel ?
            <ConfirmDialog
              onSubmit={this.onDelete}
              onClose={this.closeDeleteDialog}
              title="Delete Subscription"
              message="Are you sure you want to delete this subscription?"
              loadingMessage="Deleting subscription..."/>
            : null
        }
      </div>
    );
  }
}
