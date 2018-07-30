import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListProps } from './ISubscriptionListProps';
import { ISubscriptionListInternalState } from './ISubscriptionListInternalState';
import SubscriptionListItem from '../SubscriptionListItem/SubscriptionListItem';
import AddSubscriptionPanel from '../AddSubscriptionPanel/AddSubscriptionPanel';
import FabricIconButton from '../FabricIconButton/FabricIconButton';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import styles from '../SpWebHooksManager.module.scss';
import { connect } from 'react-redux';
import { onAddNewSubscription } from '../../actions/NewSubscription';
import { IAddPanelOptions } from '../../interfaces/IPanelOptions';
import EditSubscriptionPanel from '../EditSubscriptionPanel/EditSubscriptionPanel';

class SubscriptionList extends React.Component<ISubscriptionListProps, ISubscriptionListInternalState> {
  constructor(props: ISubscriptionListProps) {
    super(props);

    this.state = {
      onExpanded: false
    };
  }

  @autobind
  private onToggleExpand() {
    this.setState({
      onExpanded: !this.state.onExpanded
    });
  }

  @autobind
  private onAddNewSubscription() {
    this.props.onAddNewSubscription({
      listId: this.props.listSubscription.list.Id,
      enabled: true
    });
  }

  public render(): React.ReactElement<ISubscriptionListProps> {
    const { listSubscription } = this.props;
    const { onExpanded } = this.state;

    return (
      <div key={listSubscription.list.Id}>
        <h3 className={styles.subscriptionListHeader}>
          <FabricIconButton
            fabricIconName={onExpanded ? `ChevronUp ${styles.rotate}` : `ChevronUp ${styles.rotate} ${styles.down}`}
            onClick={this.onToggleExpand}
            tooltipText={onExpanded ? strings.HideSubscriptions : strings.ExpandSubscriptions}
          />
          <FabricIconButton
            fabricIconName="Add"
            onClick={this.onAddNewSubscription}
            tooltipText={strings.AddSubscription}
          />
          <span className={styles.title}>{listSubscription.list.Title} ({listSubscription.subscriptions.length})</span>
        </h3>
        {
          onExpanded ?
            <div>
              {
                listSubscription.subscriptions.length > 0 ?
                  listSubscription.subscriptions.map((subscription) => {
                    return <SubscriptionListItem
                      key={subscription.id}
                      subscription={subscription}
                    />;
                  })
                  :
                  <div className={styles.noSubscriptions}>{strings.NoSubscriptions}</div>
              }
            </div>
            : null
        }
        <AddSubscriptionPanel />
        <EditSubscriptionPanel />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  onAddNewSubscription: (panelOptions: IAddPanelOptions) => dispatch(onAddNewSubscription(panelOptions))
});

export default connect(null, mapDispatchToProps)(SubscriptionList);


