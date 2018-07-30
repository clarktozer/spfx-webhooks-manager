import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from '@uifabric/utilities/lib';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { IAddSubscriptionProps, IAddSubscriptionDispatch } from './IAddSubscriptionState';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import styles from '../SpWebHooksManager.module.scss';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { onUpdateProperty, onAddingSubscription, onAddSubscription, onValidated, onCancel } from '../../actions/NewSubscription';
import { IAddSubscription } from './IAddSubscription';

class AddSubscriptionPanel extends React.Component<IAddSubscriptionProps, {}> {
  private minDate: Date;
  private maxDate: Date;

  constructor(props: IAddSubscriptionProps) {
    super(props);
  }

  public componentWillReceiveProps(nextProps: IAddSubscriptionProps) {
    if (nextProps.enabled != this.props.enabled) {
      let currentDate = new Date();
      this.minDate = this.addDays(currentDate.toISOString(), 1);
      this.maxDate = this.addDays(currentDate.toISOString(), 90);
      this.props.onUpdateProperty("expirationDateTime", this.minDate);
    }
  }

  @autobind
  private addDays(date: string, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  @autobind
  private async onSave() {
    this.props.onAddSubscription(this.props.listId, {
      expirationDateTime: this.props.expirationDateTime,
      notificationUrl: this.props.notificationUrl,
      clientState: this.props.clientState
    });
  }

  @autobind
  private onRenderFooterContent() {
    const { validated, loading } = this.props;

    return (
      <div>
        {
          loading ?
            <Spinner size={SpinnerSize.large} label={strings.AddingSubscription} />
            :
            <div className={styles.panelButtons}>
              <DefaultButton disabled={!validated} onClick={this.onSave} text={strings.Save} primary={true} />
              <DefaultButton onClick={this.props.onCancel}>Cancel</DefaultButton>
            </div>
        }
      </div>
    );
  }

  @autobind
  private onMaxDate() {
    this.onSelectDate(this.maxDate);
  }

  @autobind
  private onSelectDate(date: Date) {
    this.props.onUpdateProperty("expirationDateTime", date);
    this.onValidated();
  }

  @autobind
  private onValidated() {
    this.props.onValidated(this.props.expirationDateTime != null
      && this.props.notificationUrl != null
      && this.props.notificationUrl.length > 0);
  }

  @autobind
  private _getErrorMessage(value: string): string {
    return value.length > 0 ? '' : strings.NotificationUrlError;
  }

  @autobind
  private NotifyErrorResult() {
    this.onValidated();
  }

  public render(): React.ReactElement<IAddSubscriptionProps> {
    const { enabled, clientState, notificationUrl, expirationDateTime } = this.props;

    return (
      <Panel
        isOpen={enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.props.onCancel}
        headerText={strings.AddSubscription}
        onRenderFooterContent={this.onRenderFooterContent}>
        <TextField label={strings.NotificationUrl}
          value={notificationUrl}
          required={true}
          onGetErrorMessage={this._getErrorMessage}
          onNotifyValidationResult={this.NotifyErrorResult}
          onChanged={(value: string) => {
            this.props.onUpdateProperty("notificationUrl", value);
          }} />
        <TextField label={strings.ClientState}
          value={clientState}
          onChanged={(value: string) => {
            this.props.onUpdateProperty("clientState", value);
          }}
        />
        <DatePicker
          label={strings.ExpirationDate}
          isRequired={true}
          firstDayOfWeek={DayOfWeek.Monday}
          strings={strings.DatePickerStrings}
          placeholder={strings.SelectDate}
          showGoToToday={false}
          minDate={this.minDate}
          maxDate={this.maxDate}
          value={expirationDateTime}
          onSelectDate={this.onSelectDate} />
        <DefaultButton onClick={this.onMaxDate}>{strings.AddMaxExpiration}</DefaultButton>
      </Panel>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  expirationDateTime: state.newSubscription.expirationDateTime,
  notificationUrl: state.newSubscription.notificationUrl,
  validated: state.newSubscription.validated,
  loading: state.newSubscription.loading,
  clientState: state.newSubscription.clientState,
  enabled: state.newSubscription.enabled,
  listId: state.newSubscription.listId
});

const mapDispatchToProps = (dispatch): IAddSubscriptionDispatch => ({
  onUpdateProperty: (key: string, value: string) => dispatch(onUpdateProperty(key, value)),
  onAddingSubscription: (value: boolean) => dispatch(onAddingSubscription(value)),
  onAddSubscription: (listId: string, subscription: IAddSubscription) => dispatch(onAddSubscription(listId, subscription)),
  onValidated: (value: boolean) => dispatch(onValidated(value)),
  onCancel: () => dispatch(onCancel())
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSubscriptionPanel);
