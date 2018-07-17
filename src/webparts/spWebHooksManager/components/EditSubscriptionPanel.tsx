import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ISubscription } from './SpWebHooksManager';
import { autobind } from '@uifabric/utilities/lib';

const DayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],

  shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year'
};

export interface IEditSubscriptionProps {
  subscription: ISubscription;
  enabled: boolean;
  onUpdate: (expirationDateTime: string) => void;
  onClosePanel: () => void;
}

export interface IEditSubscriptionState {
  expirationDateTime: Date;
}

export default class EditSubscriptionPanel extends React.Component<IEditSubscriptionProps, IEditSubscriptionState> {
  private minDate: Date;
  constructor(props: IEditSubscriptionProps) {
    super(props);

    this.minDate = new Date(props.subscription.expirationDateTime);

    this.state = {
      expirationDateTime: new Date(props.subscription.expirationDateTime)
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
    this.props.onUpdate(this.state.expirationDateTime.toISOString());
    this.props.onClosePanel();
  }

  @autobind
  private onAddToDate() {
    let date = this.addDays(this.state.expirationDateTime.toISOString(), 90);

    this.setState({
      expirationDateTime: date
    });
  }

  @autobind
  private onRenderFooterContent() {
    return (
      <div>
        <PrimaryButton onClick={this.onSave} style={{ marginRight: '8px' }}>
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
    });
  }

  public render(): React.ReactElement<IEditSubscriptionProps> {
    const { subscription } = this.props;

    return (
      <Panel
        isOpen={this.props.enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.onCloseEditPanel}
        headerText={`Edit Subscription`}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this.onRenderFooterContent}>
        <Label>ID</Label>
        <TextField disabled={true} value={subscription.id} />
        <Label>Notification URL</Label>
        <TextField disabled={true} value={subscription.notificationUrl} />
        <Label>Resource</Label>
        <TextField disabled={true} value={subscription.resource} />
        <Label>Client State</Label>
        <TextField disabled={true}
          value={subscription.clientState != null
            && subscription.clientState.length > 0
            ? subscription.clientState : "N/A"} />
        <Label required={true}>Expiration Date</Label>
        <DatePicker
          firstDayOfWeek={DayOfWeek.Monday}
          strings={DayPickerStrings}
          placeholder="Select a date..."
          minDate={this.minDate}
          allowTextInput={true}
          value={this.state.expirationDateTime}
          onSelectDate={this.onSelectDate} />
        <DefaultButton onClick={this.onAddToDate}>Add 90 Days</DefaultButton>
      </Panel>
    );
  }
}
