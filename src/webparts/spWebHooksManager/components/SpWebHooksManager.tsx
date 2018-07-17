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

export default class SpWebHooksManager extends React.Component<ISpWebHooksManagerProps, ISpWebHooksManagerState> {
  private batchLimit = 50;

  constructor(props: ISpWebHooksManagerProps) {
    super(props);

    this.state = {
      listSubscriptions: [],
      loading: true
    };
  }

  @autobind
  private setLoading(isLoading: boolean) {
    this.setState({
      loading: isLoading
    });
  }

  @autobind
  private async refreshSubscriptions() {
    let listSubscriptions = await this.getSubscriptions();
    this.setState({
      listSubscriptions: listSubscriptions,
      loading: false
    });
  }

  public async componentDidMount() {
    this.refreshSubscriptions();
  }

  public async componentDidUpdate(prevProps: ISpWebHooksManagerProps) {
    if (prevProps.listTemplateTypes !== this.props.listTemplateTypes
      || prevProps.queryType !== this.props.queryType
      || prevProps.lists !== this.props.lists) {
      this.setLoading(true);
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
  private async onDeleteWebHook(listId: string, subscriptionId: string) {
    try {
      console.log("onDeleteWebHook", listId, subscriptionId);
      this.setLoading(true);
      //await sp.web.lists.getById(listId).subscriptions.getById(subscriptionId).delete();
      this.refreshSubscriptions();
    } catch (e) {
      // some error
    }
  }

  @autobind
  private async onAddWebHook(listId: string, subscription: IAddSubscription) {
    try {
      console.log("onAddWebHook", listId, subscription);
      this.setLoading(true);
      //let added = await sp.web.lists.getById(listId).subscriptions.add(notificationUrl, expirationDate, clientState);
      this.refreshSubscriptions();
    } catch (e) {

    }
  }

  @autobind
  private async onUpdateWebHook(listId: string, subscriptionId: string, expirationDate: string) {
    try {
      console.log("onUpdateWebHook", listId, subscriptionId, expirationDate);
      this.setLoading(true);
      //let updated = await sp.web.lists.getById(listId).subscriptions.getById(subscriptionId).update(expirationDate);
      this.refreshSubscriptions();
    } catch (e) {

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
    return (
      <div className={styles.spWebHooksManager}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <WebPartTitle displayMode={this.props.displayMode}
              title={this.props.title}
              updateProperty={this.props.updateProperty} />
            <div className="listSubscriptions">
              {
                this.state.listSubscriptions.map((e) => {
                  return <SubscriptionsList
                    listSubscription={e}
                    onAddSubscription={this.onAddWebHook}
                    onDeleteSubscription={this.onDeleteWebHook}
                    onUpdateSubscription={this.onUpdateWebHook}
                  />;
                })
              }
              {
                this.state.loading ?
                  <div className="loader">
                    <Overlay className="loader__overlay">
                      <Spinner className="loader__spinner" size={SpinnerSize.large} label={"Loading..."} />
                    </Overlay>
                  </div>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
