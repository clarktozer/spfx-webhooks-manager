import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from '@uifabric/utilities/lib';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { IAddSubscriptionProps } from './IAddSubscriptionState';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import styles from '../SpWebHooksManager.module.scss';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { updateProperty } from '../../actions/AddSubscription';

class AddSubscriptionPanel extends React.Component<IAddSubscriptionProps, {}> {
  private minDate: Date;
  private maxDate: Date;

  constructor(props: IAddSubscriptionProps) {
    super(props);
  }

  componentDidMount() {
    let currentDate = new Date();
    this.minDate = this.addDays(currentDate.toISOString(), 1);
    this.maxDate = this.addDays(currentDate.toISOString(), 90);
    this.props.updateProperty("expirationDateTime", this.minDate);
  }

  @autobind
  private addDays(date: string, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  @autobind
  private onCloseEditPanel() {
    this.props.updateProperty("enabled", false);
  }

  @autobind
  private async onSave() {
    this.props.addingSubscription(true);
    this.props.addSubscription({
      expirationDateTime: this.props.expirationDateTime,
      notificationUrl: this.props.notificationUrl,
      clientState: this.props.clientState
    });
  }

  @autobind
  private onRenderFooterContent() {
    const { error, loading } = this.props;

    return (
      <div>
        {
          loading ?
            <Spinner size={SpinnerSize.large} label={strings.AddingSubscription} />
            :
            <div className={styles.panelButtons}>
              <DefaultButton disabled={error} onClick={this.onSave} text={strings.Save} primary={true} />
              <DefaultButton onClick={this.onCloseEditPanel}>Cancel</DefaultButton>
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
    this.props.updateProperty("expirationDateTime", date);
    this.onError();
  }

  @autobind
  private onError() {
    this.props.updateProperty("error", this.props.expirationDateTime == null
      || this.props.notificationUrl == null
      || this.props.notificationUrl.length == 0);
  }

  @autobind
  private _getErrorMessage(value: string): string {
    return value.length > 0 ? '' : strings.NotificationUrlError;
  }

  @autobind
  private NotifyErrorResult() {
    this.onError();
  }

  public render(): React.ReactElement<IAddSubscriptionProps> {
    const { enabled, clientState, notificationUrl, expirationDateTime } = this.props;

    return (
      <Panel
        isOpen={enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.onCloseEditPanel}
        headerText={strings.AddSubscription}
        onRenderFooterContent={this.onRenderFooterContent}>
        <TextField label={strings.NotificationUrl}
          value={notificationUrl}
          required={true}
          onGetErrorMessage={this._getErrorMessage}
          onNotifyValidationResult={this.NotifyErrorResult}
          onChanged={(value: string) => {
            this.props.updateProperty("notificationUrl", value);
          }} />
        <TextField label={strings.ClientState}
          value={clientState}
          onChanged={(value: string) => {
            this.props.updateProperty("clientState", value);
          }}
        />
        <DatePicker
          label={strings.ExpirationDate}
          isRequired={true}
          firstDayOfWeek={DayOfWeek.Monday}
          strings={strings.DatePickerStrings}
          placeholder={strings.SelectDate}
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
  expirationDateTime: state.subscription.expirationDateTime,
  notificationUrl: state.subscription.notificationUrl,
  error: state.subscription.error,
  loading: state.subscription.loading,
  clientState: state.subscription.clientState,
  enabled: state.subscription.enabled
});

const mapDispatchToProps = (dispatch) => ({
  updateProperty: (key: string, value: string) => dispatch(updateProperty(key, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddSubscriptionPanel);
