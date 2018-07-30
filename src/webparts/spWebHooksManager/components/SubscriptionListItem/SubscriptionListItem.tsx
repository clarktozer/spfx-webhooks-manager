import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListItemProps, ISubscriptionListItemDispatch } from './ISubscriptionListItemProps';
import FabricIconButton from '../FabricIconButton/FabricIconButton';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import styles from '../SpWebHooksManager.module.scss';
import { connect } from 'react-redux';
import { onEditSubscription } from '../../actions/EditSubscription';
import { IEditPanelOptions } from '../../interfaces/IPanelOptions';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { onDeleteSubscription, onToggleDeleteDialog } from '../../actions/DeleteSubscription';
import { IState } from '../../store';

class SubscriptionListItem extends React.Component<ISubscriptionListItemProps, {}> {
  constructor(props: ISubscriptionListItemProps) {
    super(props);
  }

  @autobind
  private onEditSubscription() {
    this.props.onEditSubscription({
      enabled: true,
      subscription: this.props.subscription
    });
  }

  @autobind
  private onToggleDeleteDialog() {
    this.props.onToggleDeleteDialog(!this.props.deleteDialogEnabled);
  }

  @autobind
  private onDeleteSubscription() {
    this.props.onDeleteSubscription(this.props.subscription.resource, this.props.subscription.id);
  }

  public render(): React.ReactElement<ISubscriptionListItemProps> {
    const { subscription, deleteDialogEnabled } = this.props;

    return (
      <div className={styles.subscriptionItem}>
        <h4 className={`${styles.subscriptionItemHeader} ${styles.clearfix}`}>
          {strings.Subscription}
          <div className={styles.pullRight}>
            <FabricIconButton
              stateKey="showEditPanel"
              fabricIconName="Edit"
              onClick={this.onEditSubscription}
              tooltipText={strings.EditSubscription}
            />
            <FabricIconButton
              stateKey="showDeletePanel"
              fabricIconName="ChromeClose"
              onClick={this.onToggleDeleteDialog}
              tooltipText={strings.DeleteSubscription}
            />
          </div>
        </h4>
        <ul className={styles.listUnstyled}>
          <li>
            <label>{strings.ID}</label>
            <div className={styles.subscriptionProp}>{subscription.id}</div>
          </li>
          <li>
            <label>{strings.ExpirationDate}</label>
            <div className={styles.subscriptionProp}>{subscription.expirationDateTime}</div>
          </li>
          <li>
            <label>{strings.Resource}</label>
            <div className={styles.subscriptionProp}>{subscription.resource}</div>
          </li>
          <li>
            <label>{strings.NotificationUrl}</label>
            <div className={styles.subscriptionProp}>{subscription.notificationUrl}</div>
          </li>
          <li>
            <label>{strings.ClientState}</label>
            <div className={styles.subscriptionProp}>
              {
                subscription.clientState != null && subscription.clientState.length > 0 ?
                  subscription.clientState : strings.EmptyTextField
              }
            </div>
          </li>
        </ul>
        <ConfirmDialog
          loading={this.props.deleting}
          enabled={deleteDialogEnabled}
          onSubmit={this.onDeleteSubscription}
          onClose={this.onToggleDeleteDialog}
          title={strings.DeleteSubscription}
          message={strings.ConfirmDelete}
          loadingMessage={strings.DeletingSubscription} />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  deleting: state.deleteSubscription.deleting,
  deleteDialogEnabled: state.deleteSubscription.deleteDialogEnabled
});

const mapDispatchToProps = (dispatch): ISubscriptionListItemDispatch => ({
  onToggleDeleteDialog: (enabled: boolean) => dispatch(onToggleDeleteDialog(enabled)),
  onEditSubscription: (panelOptions: IEditPanelOptions) => dispatch(onEditSubscription(panelOptions)),
  onDeleteSubscription: (listId: string, subscriptionId: string) => dispatch(onDeleteSubscription(listId, subscriptionId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionListItem);
