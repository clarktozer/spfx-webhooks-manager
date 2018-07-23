import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from '@uifabric/utilities/lib';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { IAddSubscriptionProps } from './IAddSubscriptionProps';
import { IAddSubscriptionState } from './IAddSubscriptionState';
import { IAddSubscription } from './IAddSubscription';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

export default class AddSubscriptionPanel extends React.Component<IAddSubscriptionProps, IAddSubscriptionState> {
  private minDate: Date;
  private maxDate: Date;
  constructor(props: IAddSubscriptionProps) {
    super(props);

    let currentDate = new Date();
    this.minDate = this.addDays(currentDate.toISOString(), 1);
    this.maxDate = this.addDays(currentDate.toISOString(), 90);

    this.state = {
      expirationDateTime: this.minDate,
      notificationUrl: "",
      error: true,
      loading: false
    };
  }

  @autobind
  private addDays(date: string, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  @autobind
  private onCloseEditPanel() {
    this.props.onClosePanel();
  }

  @autobind
  private async onSave() {
    let subscription: IAddSubscription = {
      expirationDateTime: this.state.expirationDateTime,
      notificationUrl: this.state.notificationUrl,
      clientState: this.state.clientState
    };
    this.setState({
      loading: true
    });
    await this.props.onAdd(subscription);
    this.setState({
      loading: false
    });
  }

  @autobind
  private onAddToDate() {
    this.setState({
      expirationDateTime: this.addDays(this.state.expirationDateTime.toISOString(), 90)
    });
  }

  @autobind
  private onRenderFooterContent() {
    const { error, loading } = this.state;

    return (
      <div>
        {
          loading ?
            <Spinner size={SpinnerSize.large} label={strings.AddingSubscription} />
            :
            <div  className="panelButtons">
              <DefaultButton disabled={error} onClick={this.onSave} text={strings.Save} primary={true} />
              <DefaultButton onClick={this.onCloseEditPanel}>Cancel</DefaultButton>
            </div>
        }
      </div>
    );
  }

  @autobind
  private onSelectDate(date: Date) {
    this.setState({
      expirationDateTime: date
    }, () => {
      this.onError();
    });
  }

  @autobind
  private onError() {
    this.setState({
      error: this.state.expirationDateTime == null
        || this.state.notificationUrl == null
        || this.state.notificationUrl.length == 0
    });
  }

  @autobind
  private _getErrorMessage(value: string): string {
    return value.length > 0 ? '' : strings.NotificationUrlError;
  }

  @autobind
  private NotifyErrorResult() {
    this.onError();
  }

  @autobind
  private onTextFieldChanged(newValue: string, key: string): void {
    this.setState(() => ({
      [key]: newValue
    }));
  }

  public render(): React.ReactElement<IAddSubscriptionProps> {
    const { expirationDateTime, clientState, notificationUrl } = this.state;
    const { enabled } = this.props;

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
          onChanged={(newValue: string) => {
            this.onTextFieldChanged(newValue, "notificationUrl");
          }} />
        <TextField label={strings.ClientState}
          value={clientState}
          onChanged={(newValue: string) => {
            this.onTextFieldChanged(newValue, "clientState");
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
        <DefaultButton onClick={this.onAddToDate}>{strings.AddMaxExpiration}</DefaultButton>
      </Panel>
    );
  }
}
