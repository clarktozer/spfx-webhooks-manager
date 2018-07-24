import * as React from 'react';
import styles from './SpWebHooksManager.module.scss';
import { ISpWebHooksManagerProps } from './ISpWebHooksManagerProps';
import { sp } from '@pnp/sp';
import { IODataList, } from '@microsoft/sp-odata-types';
import { autobind } from '@uifabric/utilities/lib';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Subscription } from '@pnp/sp/src/subscriptions';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Overlay } from "office-ui-fabric-react/lib/Overlay";
import { IListSubscription } from '../interfaces/IListSubscription';
import { ISpWebHooksManagerState } from '../interfaces/ISpWebHooksManagerState';
import { QueryType } from '../interfaces/QueryType';
import { IAddSubscription } from './AddSubscriptionPanel/IAddSubscription';
import SubscriptionsList from './SubscriptionList/SubscriptionsList';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { ErrorDialog } from './ErrorDialog/ErrorDialog';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import TimedMessageBar from './TimedMessageBar/TimedMessageBar';

export default class SpWebHooksManager extends React.Component<ISpWebHooksManagerProps, ISpWebHooksManagerState> {
  private batchLimit = 50;

  constructor(props: ISpWebHooksManagerProps) {
    super(props);

    this.state = {
      listSubscriptions: [],
      loadingSubscriptions: true
    };
  }

  @autobind
  private setSubscriptionsLoading(loading: boolean) {
    this.setState({
      loadingSubscriptions: loading
    });
  }

  @autobind
  private setError() {
    this.setState({
      loadingSubscriptions: false,
      error: true
    });
  }

  @autobind
  private async refreshSubscriptions() {
    try {
      let listSubscriptions = await this.getSubscriptions();
      this.setState({
        listSubscriptions: listSubscriptions,
        loadingSubscriptions: false,
        error: false
      });
    } catch (e) {
      this.setError();
    }
  }

  public async componentDidMount() {
    this.refreshSubscriptions();
  }

  public async componentDidUpdate(prevProps: ISpWebHooksManagerProps) {
    if (prevProps.listTemplateTypes !== this.props.listTemplateTypes
      || prevProps.queryType !== this.props.queryType
      || prevProps.lists !== this.props.lists) {
      this.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    }
  }

  @autobind
  private generateListTemplateFilter(): string {
    let map = this.props.listTemplateTypes.map((e) => {
      return `BaseTemplate eq ${SP.ListTemplateType[e]}`;
    });
    return map.join(" or ");
  }

  @autobind
  private generateListFilter(): string {
    let listFilter = "Hidden eq false";
    if (this.props.queryType == QueryType.TEMPLATE) {
      if (this.props.listTemplateTypes != null && this.props.listTemplateTypes.length > 0) {
        listFilter += ` and ${this.generateListTemplateFilter()}`;
      }
    } else if (this.props.queryType == QueryType.LIST && this.props.lists.length > 0) {
      let map = this.props.lists.map((e) => {
        return `Id eq guid'${e}'`;
      });
      listFilter += ` and (${map.join(" or ")})`;
    }
    return listFilter;
  }

  @autobind
  private async onDeleteWebHook(listId: string, subscriptionId: string): Promise<void> {
    try {
      await sp.web.lists
        .getById(listId)
        .subscriptions
        .getById(subscriptionId)
        .delete();
      //display timed message bar success message
      this.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    } catch (e) {
      let dialog = new ErrorDialog(strings.DeleteErrorTitle, strings.ErrorDeletingMessage);
      dialog.show();
      this.setSubscriptionsLoading(false);
    }
  }

  @autobind
  private async onAddWebHook(listId: string, subscription: IAddSubscription): Promise<void> {
    try {
      await sp.web.lists
        .getById(listId)
        .subscriptions
        .add(subscription.notificationUrl, subscription.expirationDateTime.toISOString(), subscription.clientState);
      //display timed message bar success message
      this.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    } catch (e) {
      let dialog = new ErrorDialog(strings.AddErrorTitle, `${strings.ErrorAddingMessage} ${e.data.responseBody["odata.error"].message.value}`);
      dialog.show();
      this.setSubscriptionsLoading(false);
    }
  }

  @autobind
  private async onUpdateWebHook(listId: string, subscriptionId: string, expirationDate: string): Promise<void> {
    try {
      await sp.web.lists
        .getById(listId)
        .subscriptions.getById(subscriptionId)
        .update(expirationDate);
      //display timed message bar success message
      this.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    } catch (e) {
      let dialog = new ErrorDialog(strings.UpdateErrorTitle, strings.ErrorUpdatingMessage);
      dialog.show();
      this.setSubscriptionsLoading(false);
    }
  }

  @autobind
  private async getSubscriptions(): Promise<IListSubscription[]> {
    var lists: IODataList[] = await sp.web.lists.filter(this.generateListFilter()).get();
    var promises = [];
    let batches = [];
    let batch = sp.createBatch();

    for (var i = lists.length - 1; i > -1; i--) {
      let list = lists[i];
      promises.push(sp.web.lists.getById(list.Id).subscriptions.inBatch(batch).get().then((subscriptions: Subscription[]) => {
        return {
          list: list,
          subscriptions: subscriptions
        };
      }));
      if (i % this.batchLimit == 0) {
        batches.push(batch.execute());
        batch = sp.createBatch();
      }
    }

    await Promise.all(batches);
    return Promise.all(promises);
  }

  public render(): React.ReactElement<ISpWebHooksManagerProps> {
    const { updateProperty, title, displayMode } = this.props;
    const { listSubscriptions, error, loadingSubscriptions } = this.state;

    return (
      <div className={styles.spWebHooksManager}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <WebPartTitle displayMode={displayMode}
              title={title}
              updateProperty={updateProperty} />
            {
              error ?
                <MessageBar
                  messageBarType={MessageBarType.error}>
                  {strings.ErrorFetchingSubscriptions}
                </MessageBar>
                :
                null
            }
            <div className={styles.listSubscriptions}>
              {
                listSubscriptions.map((listSubscription, index) => {
                  return <SubscriptionsList
                    key={`subscriptionList-${index}`}
                    listSubscription={listSubscription}
                    onAddSubscription={this.onAddWebHook}
                    onDeleteSubscription={this.onDeleteWebHook}
                    onUpdateSubscription={this.onUpdateWebHook}
                  />;
                })
              }
              {
                loadingSubscriptions ?
                  <Overlay className={styles.loaderOverlay}>
                    <Spinner className={styles.loaderSpinner} size={SpinnerSize.large} label={strings.Loading} />
                  </Overlay>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
