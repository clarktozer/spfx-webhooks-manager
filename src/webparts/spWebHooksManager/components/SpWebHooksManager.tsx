import * as React from 'react';
import styles from './SpWebHooksManager.module.scss';
import { ISpWebHooksManagerProps } from './ISpWebHooksManagerProps';
import { sp } from '@pnp/sp';
import { IODataList,  } from '@microsoft/sp-odata-types';
import { autobind } from '@uifabric/utilities/lib';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

export interface Subscription {
  clientState: string;
  expirationDateTime: string;
  id: string;
  notificationUrl: string;
  resource: string;
}

export interface ListSubscription {
  key: string;
  list: IODataList;
  subscriptions: Subscription[];
}

export interface ISpWebHooksManagerState {
  listSubscriptions: ListSubscription[];
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
    if (prevProps.listTemplateTypes !== this.props.listTemplateTypes) {
      this.setSubscriptions();
    }
  }

  @autobind
  private generateFilter(): string {
    let map = this.props.listTemplateTypes.map((e) => {
      return `BaseTemplate eq ${SP.ListTemplateType[e]}`;
    });
    return map.join(" or ");
  }

  @autobind
  private async getSubscriptions(): Promise<ListSubscription[]> {
    var lists: IODataList[] = await sp.web.lists.filter(this.generateFilter()).get();
    var promises = [];
    let batches = [];
    let batch = sp.createBatch();

    for (var i = lists.length - 1; i > -1; i--) {
      let list = lists[i];
      promises.push(sp.web.lists.getById(list.Id).subscriptions.inBatch(batch).get().then((subscriptions: Subscription[]) => {
        return {
          key: list.Id,
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
                return <div key={e.key}>
                  <h3>{e.list.Title} ({e.subscriptions.length})</h3>
                  {
                    e.subscriptions.map((s)=>{
                      return <div>{s.id}</div>
                    })
                  }
                </div>;
              })
            }
          </div>
        </div>
      </div>
    );
  }
}
