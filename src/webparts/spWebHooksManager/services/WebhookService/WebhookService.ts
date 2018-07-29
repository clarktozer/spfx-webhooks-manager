import IWebhookService from "./IWebhookService";
import { IListSubscription } from "../../interfaces/IListSubscription";
import { IAddSubscription } from "../../components/AddSubscriptionPanel/IAddSubscription";
import { sp } from "@pnp/sp";
import { Subscription } from '@pnp/sp/src/subscriptions';
import { IODataList } from "@microsoft/sp-odata-types";
import { QueryType } from "../../interfaces/QueryType";
import ListQueryService from "../ListQueryService/ListQueryService";
import { autobind } from "@uifabric/utilities/lib";

export default class WebhookService implements IWebhookService {
  private batchLimit = 50;

  constructor() {
    this.getSubscriptions.bind(this);
  }

  public async getSubscriptions(queryType: QueryType, listIds: string[], listTemplateTypes: string[]): Promise<IListSubscription[]> {
    let listQueryService = new ListQueryService();
    let listQueryFilter = listQueryService.generateListFilter(queryType, listIds, listTemplateTypes);
    let lists: IODataList[] = await sp.web.lists.filter(listQueryFilter).get();
    let promises = [];
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

  public async onAddWebHook(listId: string, subscription: IAddSubscription): Promise<void> {
    await sp.web.lists
      .getById(listId)
      .subscriptions
      .add(subscription.notificationUrl, subscription.expirationDateTime.toISOString(), subscription.clientState);
  }

  public async onUpdateWebHook(listId: string, subscriptionId: string, expirationDate: string): Promise<void> {
    await sp.web.lists
      .getById(listId)
      .subscriptions.getById(subscriptionId)
      .update(expirationDate);
  }

  public async onDeleteWebHook(listId: string, subscriptionId: string): Promise<void> {
    await sp.web.lists
      .getById(listId)
      .subscriptions
      .getById(subscriptionId)
      .delete();
  }
}
