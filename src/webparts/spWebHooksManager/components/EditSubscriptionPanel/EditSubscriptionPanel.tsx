import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { autobind } from '@uifabric/utilities/lib';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { IEditSubscriptionProps } from './IEditSubscriptionProps';
import { IEditSubscriptionState } from './IEditSubscriptionState';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import styles from '../SpWebHooksManager.module.scss';

export default class EditSubscriptionPanel extends React.Component<IEditSubscriptionProps, IEditSubscriptionState> {
  private minDate: Date;
  private maxDate: Date;

  constructor(props: IEditSubscriptionProps) {
    super(props);

    this.minDate = new Date(props.subscription.expirationDateTime);
    this.maxDate = this.addDays(props.subscription.expirationDateTime, 90);

    this.state = {
      expirationDateTime: this.minDate,
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
  private onMaxDate() {
    this.setState({
      expirationDateTime: this.maxDate
    });
  }

  @autobind
  private onRenderFooterContent() {
    const { error, loading } = this.state;

    return (
      <div>
        {
          loading ?
            <Spinner size={SpinnerSize.large} label={strings.UpdatingSubscription} />
            :
            <div className={styles.panelButtons}>
              <DefaultButton disabled={error} onClick={this.onSave} text={strings.Save} primary={true} />
              <DefaultButton onClick={this.onCloseEditPanel} text={strings.Cancel}/>
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
      error: this.state.expirationDateTime == null && this.state.expirationDateTime > this.maxDate
    });
  }

  public render(): React.ReactElement<IEditSubscriptionProps> {
    const { enabled } = this.props;
    const { expirationDateTime } = this.state;

    return (
      <Panel
        isOpen={enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.onCloseEditPanel}
        headerText={strings.EditSubscription}
        onRenderFooterContent={this.onRenderFooterContent}>
        <DatePicker
          label={strings.ExpirationDate}
          firstDayOfWeek={DayOfWeek.Monday}
          isRequired={true}
          strings={strings.DatePickerStrings}
          placeholder={strings.SelectDate}
          minDate={this.minDate}
          maxDate={this.maxDate}
          allowTextInput={true}
          value={expirationDateTime}
          onSelectDate={this.onSelectDate} />
        <DefaultButton onClick={this.onMaxDate}>{strings.AddMaxExpiration}</DefaultButton>
      </Panel>
    );
  }
}
