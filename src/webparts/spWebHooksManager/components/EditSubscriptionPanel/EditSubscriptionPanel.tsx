import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DatePicker, DayOfWeek } from 'office-ui-fabric-react/lib/DatePicker';
import { autobind } from '@uifabric/utilities/lib';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import styles from '../SpWebHooksManager.module.scss';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { IEditSubscriptionProps, IEditSubscriptionDispatch } from './IEditSubscriptionState';
import { onUpdateProperty, onEditingSubscription, onValidated, onCancel, onUpdateSubscription } from '../../actions/EditSubscription';
import { ISubscription } from '../../interfaces/ISubscription';

class EditSubscriptionPanel extends React.Component<IEditSubscriptionProps, {}> {
  private minDate: Date;
  private maxDate: Date;

  constructor(props: IEditSubscriptionProps) {
    super(props);
  }

  public componentWillReceiveProps(nextProps: IEditSubscriptionProps) {
    if (nextProps.subscription !== this.props.subscription) {
      this.minDate = new Date(nextProps.subscription.expirationDateTime);
      this.maxDate = this.addDays(new Date().toISOString(), 90);
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
    this.props.onUpdateSubscription(this.props.subscription);
  }

  @autobind
  private onMaxDate() {
    this.onSelectDate(this.maxDate);
  }

  @autobind
  private onSelectDate(date: Date) {
    this.props.onUpdateProperty("subscription", {
      ...this.props.subscription,
      expirationDateTime: date.toISOString()
    });
    this.onValidated();
  }

  @autobind
  private onRenderFooterContent() {
    const { validated, loading } = this.props;

    return (
      <div>
        {
          loading ?
            <Spinner size={SpinnerSize.large} label={strings.UpdatingSubscription} />
            :
            <div className={styles.panelButtons}>
              <DefaultButton disabled={!validated} onClick={this.onSave} text={strings.Save} primary={true} />
              <DefaultButton onClick={this.props.onCancel} text={strings.Cancel} />
            </div>
        }
      </div>
    );
  }

  @autobind
  private onValidated() {
    this.props.onValidated(this.props.subscription.expirationDateTime != null && new Date(this.props.subscription.expirationDateTime) <= this.maxDate);
  }

  public render(): React.ReactElement<IEditSubscriptionProps> {
    const { enabled } = this.props;

    return (
      <Panel
        isOpen={enabled}
        type={PanelType.smallFixedFar}
        onDismiss={this.props.onCancel}
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
          showGoToToday={false}
          allowTextInput={true}
          value={this.minDate}
          onSelectDate={this.onSelectDate} />
        <DefaultButton onClick={this.onMaxDate}>{strings.AddMaxExpiration}</DefaultButton>
      </Panel>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  subscription: state.editSubscription.subscription,
  validated: state.editSubscription.validated,
  loading: state.editSubscription.loading,
  enabled: state.editSubscription.enabled,
});

const mapDispatchToProps = (dispatch): IEditSubscriptionDispatch => ({
  onUpdateProperty: (key: string, value: ISubscription) => dispatch(onUpdateProperty(key, value)),
  onEditingSubscription: (value: boolean) => dispatch(onEditingSubscription(value)),
  onUpdateSubscription: (subscription: ISubscription) => dispatch(onUpdateSubscription(subscription)),
  onValidated: (value: boolean) => dispatch(onValidated(value)),
  onCancel: () => dispatch(onCancel())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSubscriptionPanel);
