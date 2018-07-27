import * as React from 'react';
import styles from './SpWebHooksManager.module.scss';
import { ISpWebHooksManagerProps, IConnectedDispatch, IConnectedProps, IProp } from './ISpWebHooksManagerProps';
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
import { connect } from 'react-redux';
import { IState } from '../reducers';
import { updateProperty } from '../reducers/webpart';
import { Dispatch } from 'redux';
import WebPartTitleWrapper from './WebPartTitle/WebPartTitle';

class SpWebHooksManager extends React.Component<ISpWebHooksManagerProps & IProp & IConnectedProps & IConnectedDispatch, {}> {
  private batchLimit = 50;

  constructor(props: ISpWebHooksManagerProps & IProp & IConnectedProps & IConnectedDispatch) {
    super(props);
  }

  @autobind
  private async refreshSubscriptions() {
    try {
      let listSubscriptions = await this.getSubscriptions();
      this.props.setSubscriptions(listSubscriptions);

      this.props.setSubscriptionsLoading(false);
      // this.setState({
      //   listSubscriptions: listSubscriptions,
      //   loadingSubscriptions: false,
      //   error: false
      // });
    } catch (e) {
      this.props.setError();
    }
  }

  public async componentDidMount() {
    this.refreshSubscriptions();
  }

  public async componentDidUpdate(prevProps: ISpWebHooksManagerProps & IProp & IConnectedProps & IConnectedDispatch) {
    if (prevProps.listTemplateTypes !== this.props.listTemplateTypes
      || prevProps.queryType !== this.props.queryType
      || prevProps.lists !== this.props.lists) {
      this.props.setSubscriptionsLoading(true);
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
      this.props.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    } catch (e) {
      let dialog = new ErrorDialog(strings.DeleteErrorTitle, strings.ErrorDeletingMessage);
      dialog.show();
      this.props.setSubscriptionsLoading(false);
    }
  }

  @autobind
  private async onAddWebHook(listId: string, subscription: IAddSubscription): Promise<void> {
    try {
      await sp.web.lists
        .getById(listId)
        .subscriptions
        .add(subscription.notificationUrl, subscription.expirationDateTime.toISOString(), subscription.clientState);
      this.props.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    } catch (e) {
      let dialog = new ErrorDialog(strings.AddErrorTitle, `${strings.ErrorAddingMessage} ${e.data.responseBody["odata.error"].message.value}`);
      dialog.show();
      this.props.setSubscriptionsLoading(false);
    }
  }

  @autobind
  private async onUpdateWebHook(listId: string, subscriptionId: string, expirationDate: string): Promise<void> {
    try {
      await sp.web.lists
        .getById(listId)
        .subscriptions.getById(subscriptionId)
        .update(expirationDate);
      this.props.setSubscriptionsLoading(true);
      this.refreshSubscriptions();
    } catch (e) {
      let dialog = new ErrorDialog(strings.UpdateErrorTitle, strings.ErrorUpdatingMessage);
      dialog.show();
      this.props.setSubscriptionsLoading(false);
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

  @autobind
  private setTitle(key: string, value: string) {
    this.props.updateProperty(value);
    this.props.updateWebPartProp(key, value);
  }

  public render(): React.ReactElement<ISpWebHooksManagerProps & IProp & IConnectedProps & IConnectedDispatch> {
    const { title, displayMode, error, listSubscriptions, loadingSubscriptions } = this.props;

    return (
      <div className={styles.spWebHooksManager}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <WebPartTitleWrapper
              propertyKey={"title"}
              displayMode={displayMode}
              title={title}
              updateTitle={this.setTitle} />
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

const mapStateToProps = (state: IState) => ({
  title: state.webpart.properties.title,
  listTemplateTypes: state.webpart.properties.listTemplateTypes,
  lists: state.webpart.properties.lists,
  queryType: state.webpart.properties.queryType,
  displayMode: state.webpart.properties.displayMode,
  listSubscriptions: state.webpart.properties.listSubscriptions,
  loadingSubscriptions: state.webpart.properties.loadingSubscriptions
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateProperty: (value: string) => {
    dispatch(updateProperty("title", value));
  },
  setSubscriptionsLoading: (loading: boolean) => dispatch(updateProperty("loadingSubscriptions", loading)),
  setError: () => dispatch(updateProperty("error", true)),
  setSubscriptions: (listSubscriptions: IListSubscription[]) => dispatch(updateProperty("listSubscriptions", listSubscriptions))
})

export default connect(mapStateToProps, mapDispatchToProps)(SpWebHooksManager);
