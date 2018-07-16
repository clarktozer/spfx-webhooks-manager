import * as React from 'react';
import { IListSubscription } from './SpWebHooksManager';
import { autobind } from '@uifabric/utilities/lib';
import SubscriptionListItem from './SubscriptionListItem';

export interface ISubscriptionListProps {
  listSubscription: IListSubscription;
  onDeleteSubscription: (listId: string, subscriptionId: string) => void;
  onAddSubscription: (listId: string, notificationUrl: string, expirationDate: string, clientState?: string) => void;
  onUpdateSubscription: (listId: string, subscriptionId: string, expirationDate: string) => void;
}

export interface ISubscriptionListState {
  onExpanded: boolean;
}

export default class SubscriptionList extends React.Component<ISubscriptionListProps, ISubscriptionListState> {
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
  private onAdd() {
    this.props.onAddSubscription(this.props.listSubscription.list.Id, "", "");
  }

  @autobind
  private onDelete(subscriptionId: string) {
    this.props.onDeleteSubscription(this.props.listSubscription.list.Id, subscriptionId);
  }

  @autobind
  private onUpdate(subscriptionId: string, expirationDate: string) {
    this.props.onUpdateSubscription(this.props.listSubscription.list.Id, subscriptionId, expirationDate);
  }

  public render(): React.ReactElement<ISubscriptionListProps> {
    const { listSubscription } = this.props;
    return (
      <div key={listSubscription.list.Id}>
        <h3>
          <i className={" ms-Icon ms-Icon--ChevronDown"} aria-hidden="true" onClick={this.onToggleExpand}></i>
          <i className={" ms-Icon ms-Icon--Add"} aria-hidden="true" onClick={this.onAdd}></i>
          {listSubscription.list.Title} ({listSubscription.subscriptions.length})
        </h3>
        {
          this.state.onExpanded ?
            <div className="subscriptions">
              {
                listSubscription.subscriptions.map((s) => {
                  return <SubscriptionListItem
                    subscription={s}
                    onDeleteSubscription={this.onDelete}
                    onUpdateSubscription={this.onUpdate}
                  />;
                })
              }
            </div>
            : null
        }
      </div>
    );
  }
}


