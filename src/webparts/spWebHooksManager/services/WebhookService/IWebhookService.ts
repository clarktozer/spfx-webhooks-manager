import { IListSubscription } from "../../interfaces/IListSubscription";
import { IAddSubscription } from "../../components/AddSubscriptionPanel/IAddSubscription";
import { QueryType } from "../../interfaces/QueryType";

export default interface IWebhookService{
  getSubscriptions(queryType: QueryType, lists: string[], listTemplateTypes: string[]): Promise<IListSubscription[]>;
  onUpdateWebHook(listId: string, subscriptionId: string, expirationDate: string): Promise<void>;
  onAddWebHook(listId: string, subscription: IAddSubscription): Promise<void>;
  onDeleteWebHook(listId: string, subscriptionId: string): Promise<void>;
}
