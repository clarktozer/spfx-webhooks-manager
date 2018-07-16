import * as React from 'react';
import { ISubscription } from './SpWebHooksManager';
import { autobind } from '@uifabric/utilities/lib';

export interface ISubscriptionListItemProps {
  subscription: ISubscription;
  onDeleteSubscription: (subscriptionId: string) => void;
  onUpdateSubscription: (subscriptionId: string, expirationDate: string) => void;
}

export interface ISubscriptionListItemState {

}

export default class SubscriptionListItem extends React.Component<ISubscriptionListItemProps, ISubscriptionListItemState> {
  constructor(props: ISubscriptionListItemProps) {
    super(props);
  }

  @autobind
  private onDelete() {
    this.props.onDeleteSubscription(this.props.subscription.id);
  }

  @autobind
  private onUpdate() {
    this.props.onUpdateSubscription(this.props.subscription.id, "");
  }

  public render(): React.ReactElement<ISubscriptionListItemProps> {
    return (
      <div key={this.props.subscription.id}>
        {this.props.subscription.id}
        <i className={" ms-Icon ms-Icon--ChromeClose"} aria-hidden="true" onClick={this.onDelete}></i>
        <i className={" ms-Icon ms-Icon--EditSolid12"} aria-hidden="true" onClick={this.onUpdate}></i>
      </div>
    );
  }
}
