import * as React from 'react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { autobind } from '@uifabric/utilities/lib';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { IEditSubscriptionProps } from './IEditSubscriptionProps';
import { IEditSubscriptionState } from './IEditSubscriptionState';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

export default class EditSubscriptionPanel extends React.Component<IEditSubscriptionProps, IEditSubscriptionState> {
  private minDate: Date;
  constructor(props: IEditSubscriptionProps) {
    super(props);

    this.minDate = new Date(props.subscription.expirationDateTime);

    this.state = {
      expirationDateTime: new Date(props.subscription.expirationDateTime),
      loading: false,
      error: false
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
    this.setState({
      loading: true
    });
    await this.props.onUpdate(this.state.expirationDateTime.toISOString());
    this.onCloseEditPanel();
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
    const { error, loading } = this.state;

    return (
      <div>
        {
          loading ?
            <div><Spinner className="" size={SpinnerSize.large} label={"Updating subscription..."} /></div>
            :
            <div>
              <PrimaryButton disabled={error} onClick={this.onSave} style={{ marginRight: '8px' }}>
                Save
              </PrimaryButton>
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
    });
  }

  public render(): React.ReactElement<IEditSubscriptionProps> {
    const { subscription, enabled } = this.props;
    const { expirationDateTime } = this.state;

    return (
      <Panel
        isOpen={enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.onCloseEditPanel}
        headerText={`Edit Subscription`}
        closeButtonAriaLabel="Close"
        onRenderFooterContent={this.onRenderFooterContent}>
        <Label>ID</Label>
        <TextField readOnly={true} value={subscription.id} />
        <Label>Notification URL</Label>
        <TextField readOnly={true} value={subscription.notificationUrl} />
        <Label>Resource</Label>
        <TextField readOnly={true} value={subscription.resource} />
        <Label>Client State</Label>
        <TextField readOnly={true}
          value={subscription.clientState != null
            && subscription.clientState.length > 0
            ? subscription.clientState : "N/A"} />
        <Label required={true}>Expiration Date</Label>
        <DatePicker
          firstDayOfWeek={DayOfWeek.Monday}
          isRequired={true}
          strings={strings.DatePickerStrings}
          placeholder="Select a date..."
          minDate={this.minDate}
          allowTextInput={true}
          value={expirationDateTime}
          onSelectDate={this.onSelectDate} />
        <DefaultButton onClick={this.onAddToDate}>Add 90 Days</DefaultButton>
      </Panel>
    );
  }
}
