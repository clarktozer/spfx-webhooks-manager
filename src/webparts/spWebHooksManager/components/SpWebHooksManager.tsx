import * as React from 'react';
import styles from './SpWebHooksManager.module.scss';
import { ISpWebHooksManagerProps } from './ISpWebHooksManagerProps';
import { sp } from '@pnp/sp';
import { IODataList, } from '@microsoft/sp-odata-types';
import { autobind } from '@uifabric/utilities/lib';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Subscription } from '@pnp/sp/src/subscriptions';
import SubscriptionsList from './SubscriptionsList';
import { QueryType } from '../SpWebHooksManagerWebPart';

export interface ISubscription {
  clientState: string;
  expirationDateTime: string;
  id: string;
  notificationUrl: string;
  resource: string;
}

export interface IListSubscription {
  list: IODataList;
  subscriptions: ISubscription[];
}

export interface ISpWebHooksManagerState {
  listSubscriptions: IListSubscription[];
}

export default class SpWebHooksManager extends React.Component<ISpWebHooksManagerProps, ISpWebHooksManagerState> {
  private batchLimit = 50;

  constructor(props: ISpWebHooksManagerProps) {
    super(props);

    this.state = {
      listSubscriptions: []
    };
  }

  @autobind
  private async setSubscriptions() {
    let listSubscriptions = await this.getSubscriptions();
    this.setState({
      listSubscriptions: listSubscriptions
    });
  }

  public async componentDidMount() {
    this.setSubscriptions();
  }

  public async componentDidUpdate(prevProps: ISpWebHooksManagerProps) {
    if (prevProps.listTemplateTypes !== this.props.listTemplateTypes
      || prevProps.queryType !== this.props.queryType
      || prevProps.lists !== this.props.lists) {
      this.setSubscriptions();
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
      //await sp.web.lists.getById(listId).subscriptions.getById(subscriptionId).delete();
    } catch (e) {
      // some error
    }
  }

  @autobind
  private async onAddWebHook(listId: string, notificationUrl: string, expirationDate: string, clientState?: string) {
    try {
      console.log("onAddWebHook", listId);
      //let added = await sp.web.lists.getById(listId).subscriptions.add(notificationUrl, expirationDate, clientState);
    } catch (e) {

    }
  }

  @autobind
  private async onUpdateWebHook(listId: string, subscriptionId: string, expirationDate: string) {
    try {
      console.log("onUpdateWebHook", listId, subscriptionId);
      //let updated = await sp.web.lists.getById(listId).subscriptions.getById(subscriptionId).update(expirationDate);
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
          </div>
        </div>
      </div>
    );
  }
}
