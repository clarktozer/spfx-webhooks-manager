import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListItemProps } from './ISubscriptionListItemProps';
import { ISubscriptionListItemState } from './ISubscriptionListItemState';
import EditSubscriptionPanel from '../EditSubscriptionPanel/EditSubscriptionPanel';
import FabricIconButton from '../FabricIconButton/FabricIconButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import * as strings from 'SpWebHooksManagerWebPartStrings';

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
  private onTogglePanel(key: string) {
    this.setState(() => ({
      [key]: !this.state[key]
    }));
  }

  @autobind
  private closeDeleteDialog() {
    this.setState({
      showDeletePanel: false
    });
  }

  @autobind
  private closeEditPanel() {
    this.setState({
      showEditPanel: false
    });
  }

  public render(): React.ReactElement<ISubscriptionListItemProps> {
    const { subscription } = this.props;
    const { showEditPanel, showDeletePanel } = this.state;

    return (
      <div className="subscriptionItem">
        <h4 className="subscriptionItemHeader clearfix">
          {strings.Subscription}
          <div className="fRight">
            <FabricIconButton
              stateKey="showEditPanel"
              fabricIconName="Edit"
              onClick={this.onTogglePanel}
              tooltipText={strings.EditSubscription}
            />
            <FabricIconButton
              stateKey="showDeletePanel"
              fabricIconName="ChromeClose"
              onClick={this.onTogglePanel}
              tooltipText={strings.DeleteSubscription}
            />
          </div>
        </h4>
        <ul className="listUnstyled">
          <li>
            <label>{strings.ID}</label>
            <div className="subscriptionProp">{subscription.id}</div>
          </li>
          <li>
            <label>{strings.ExpirationDate}</label>
            <div className="subscriptionProp">{subscription.expirationDateTime}</div>
          </li>
          <li>
            <label>{strings.Resource}</label>
            <div className="subscriptionProp">{subscription.resource}</div>
          </li>
          <li>
            <label>{strings.NotificationUrl}</label>
            <div className="subscriptionProp">{subscription.notificationUrl}</div>
          </li>
          <li>
            <label>{strings.ClientState}</label>
            <div className="subscriptionProp">
              {
                subscription.clientState != null && subscription.clientState.length > 0 ?
                  subscription.clientState : strings.EmptyTextField
              }
            </div>
          </li>
        </ul>
        {
          showEditPanel ?
            <EditSubscriptionPanel
              enabled={showEditPanel}
              subscription={subscription}
              onClosePanel={this.closeEditPanel}
              onUpdate={this.onUpdate} />
            : null
        }
        {
          showDeletePanel ?
            <ConfirmDialog
              onSubmit={this.onDelete}
              onClose={this.closeDeleteDialog}
              title={strings.DeleteSubscription}
              message={strings.ConfirmDelete}
              loadingMessage={strings.DeletingSubscription}/>
            : null
        }
      </div>
    );
  }
}
