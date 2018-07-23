import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { ISubscriptionListProps } from './ISubscriptionListProps';
import { ISubscriptionListState } from './ISubscriptionListState';
import { IAddSubscription } from '../AddSubscriptionPanel/IAddSubscription';
import SubscriptionListItem from '../SubscriptionListItem/SubscriptionListItem';
import AddSubscriptionPanel from '../AddSubscriptionPanel/AddSubscriptionPanel';
import FabricIconButton from '../FabricIconButton/FabricIconButton';
import * as strings from 'SpWebHooksManagerWebPartStrings';

export default class SubscriptionList extends React.Component<ISubscriptionListProps, ISubscriptionListState> {
  constructor(props: ISubscriptionListProps) {
    super(props);

    this.state = {
      onExpanded: false,
      showAddPanel: false
    };
  }

  @autobind
  private onToggleExpand() {
    this.setState({
      onExpanded: !this.state.onExpanded
    });
  }

  @autobind
  private onEnablePanel() {
    this.setState({
      showAddPanel: true
    });
  }

  @autobind
  private onClosePanel() {
    this.setState({
      showAddPanel: false
    });
  }

  @autobind
  private async onAdd(subscription: IAddSubscription) {
    await this.props.onAddSubscription(this.props.listSubscription.list.Id, subscription);
    this.setState({
      showAddPanel: false
    });
  }

  @autobind
  private async onDelete(subscriptionId: string): Promise<void> {
    await this.props.onDeleteSubscription(this.props.listSubscription.list.Id, subscriptionId);
  }

  @autobind
  private async onUpdate(subscriptionId: string, expirationDate: string): Promise<void> {
    await this.props.onUpdateSubscription(this.props.listSubscription.list.Id, subscriptionId, expirationDate);
  }

  public render(): React.ReactElement<ISubscriptionListProps> {
    const { listSubscription } = this.props;
    const { onExpanded, showAddPanel } = this.state;

    return (
      <div key={listSubscription.list.Id}>
        <h3 className="subscriptionListHeader">
          <FabricIconButton
            fabricIconName={onExpanded ? "ChevronUp rotate" : "ChevronUp rotate down"}
            onClick={this.onToggleExpand}
            tooltipText={onExpanded ? strings.HideSubscriptions : strings.ExpandSubscriptions}
          />
          <FabricIconButton
            fabricIconName="Add"
            onClick={this.onEnablePanel}
            tooltipText={strings.AddSubscription}
          />
          <span className="title">{listSubscription.list.Title} ({listSubscription.subscriptions.length})</span>
        </h3>
        {
          onExpanded ?
            <div className="subscriptions">
              {
                listSubscription.subscriptions.length > 0 ?
                  listSubscription.subscriptions.map((s) => {
                    return <SubscriptionListItem
                    key={s.id}
                      subscription={s}
                      onDeleteSubscription={this.onDelete}
                      onUpdateSubscription={this.onUpdate}
                    />;
                  })
                  :
                  <div className="noSubscriptions">{strings.NoSubscriptions}</div>
              }
            </div>
            : null
        }
        {
          showAddPanel ?
            <AddSubscriptionPanel
              enabled={showAddPanel}
              onClosePanel={this.onClosePanel}
              onAdd={this.onAdd} />
            : null
        }
      </div>
    );
  }
}


