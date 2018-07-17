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

export default class AddSubscriptionPanel extends React.Component<IAddSubscriptionProps, IAddSubscriptionState> {
  private minDate: Date;
  constructor(props: IAddSubscriptionProps) {
    super(props);

    this.minDate = new Date();

    this.state = {
      expirationDateTime: this.minDate,
      notificationUrl: "",
      error: true
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
  private onSave() {
    let subscription: IAddSubscription = {
      expirationDateTime: this.state.expirationDateTime,
      notificationUrl: this.state.notificationUrl,
      clientState: this.state.clientState
    };
    this.props.onAdd(subscription);
    this.props.onClosePanel();
  }

  @autobind
  private onAddToDate() {
    this.setState({
      expirationDateTime: this.addDays(this.state.expirationDateTime.toISOString(), 90)
    });
  }

  @autobind
  private onRenderFooterContent() {
    return (
      <div>
        <PrimaryButton disabled={this.state.error} onClick={this.onSave} style={{ marginRight: '8px' }}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={this.onCloseEditPanel}>Cancel</DefaultButton>
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
    return value.length > 0 ? '' : `Please enter a url.`;
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

    return (
      <Panel
        isOpen={this.props.enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.onCloseEditPanel}
        headerText={`Add Subscription`}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this.onRenderFooterContent}>
        <TextField label="Notification URL"
          value={notificationUrl}
          required={true}
          onGetErrorMessage={this._getErrorMessage}
          onNotifyValidationResult={this.NotifyErrorResult}
          onChanged={(newValue: string) => {
            this.onTextFieldChanged(newValue, "notificationUrl");
          }} />
        <TextField label="Client State"
          value={clientState}
          onChanged={(newValue: string) => {
            this.onTextFieldChanged(newValue, "clientState");
          }}
        />
        <DatePicker
          label={"Expiration Date"}
          isRequired={true}
          firstDayOfWeek={DayOfWeek.Monday}
          strings={strings.DatePickerStrings}
          placeholder="Select a date..."
          minDate={this.minDate}
          value={expirationDateTime}
          onSelectDate={this.onSelectDate} />
        <DefaultButton onClick={this.onAddToDate}>Add 90 Days</DefaultButton>
      </Panel>
    );
  }
}
