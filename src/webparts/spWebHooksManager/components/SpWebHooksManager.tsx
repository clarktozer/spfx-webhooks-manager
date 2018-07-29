import * as React from 'react';
import styles from './SpWebHooksManager.module.scss';
import { autobind } from '@uifabric/utilities/lib';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { Overlay } from "office-ui-fabric-react/lib/Overlay";
import SubscriptionsList from './SubscriptionList/SubscriptionsList';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { connect } from 'react-redux';
import { IState } from '../reducers';
import WebPartTitleWrapper from './WebPartTitle/WebPartTitle';
import { onUpdateProperty, onGetSubscriptions } from '../actions/GetSubscriptions';
import ErrorDialog from './ErrorDialog/ErrorDialog';
import { ISpWebHooksManagerProps } from './ISpWebHooksManagerProps';

class SpWebHooksManager extends React.Component<ISpWebHooksManagerProps, {}> {

  constructor(props: ISpWebHooksManagerProps) {
    super(props);
  }

  public async componentDidMount() {
    this.props.getSubscriptions();
  }

  public async componentDidUpdate(prevProps: ISpWebHooksManagerProps) {
    if (prevProps.listTemplateTypes !== this.props.listTemplateTypes
      || prevProps.queryType !== this.props.queryType
      || prevProps.lists !== this.props.lists) {
        this.props.getSubscriptions();
    }
  }

  public render(): React.ReactElement<ISpWebHooksManagerProps> {
    const { title, displayMode, error, listSubscriptions, loadingSubscriptions } = this.props;

    return (
      <div className={styles.spWebHooksManager}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <WebPartTitleWrapper
              propertyKey={"title"}
              displayMode={displayMode}
              title={title}
              updateTitle={this.props.updateProperty} />
            {
              error != null ?
                <ErrorDialog propertyKey={"error"} title={"Error"} message={error} onClose={this.props.updateProperty} />
                :
                null
            }
            <div className={styles.listSubscriptions}>
              {
                listSubscriptions.map((listSubscription, index) => {
                  return <SubscriptionsList
                    key={`subscriptionList-${index}`}
                    listSubscription={listSubscription}
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
  title: state.webpart.title,
  listTemplateTypes: state.webpart.listTemplateTypes,
  lists: state.webpart.lists,
  queryType: state.webpart.queryType,
  displayMode: state.webpart.displayMode,
  listSubscriptions: state.webpart.listSubscriptions,
  loadingSubscriptions: state.webpart.loadingSubscriptions
});

const mapDispatchToProps = (dispatch) => ({
  updateProperty: (key: string, value: string) => dispatch(onUpdateProperty(key, value)),
  getSubscriptions: () => dispatch(onGetSubscriptions())
});

export default connect(mapStateToProps, mapDispatchToProps)(SpWebHooksManager);
