

import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { IConfirmDialogProps } from './IConfirmDialogProps';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { connect } from 'react-redux';

class ConfirmDialog extends React.Component<IConfirmDialogProps, {}> {
  constructor(props: IConfirmDialogProps) {
    super(props);
  }

  public render(): React.ReactElement<IConfirmDialogProps> {
    const { title, message, loadingMessage, onClose, enabled } = this.props;

    return (
      <div>
        <Dialog
          hidden={!enabled}
          onDismiss={onClose}
          dialogContentProps={{
            type: DialogType.normal,
            title: title,
            subText: message
          }}>
          {
            this.props.loading ?
              <div><Spinner size={SpinnerSize.large} label={loadingMessage} /></div>
              :
              <DialogFooter>
                <DefaultButton disabled={this.props.loading} onClick={this.props.onSubmit} text={strings.OK} primary={true} />
                <DefaultButton onClick={this.props.onClose} text={strings.Cancel} />
              </DialogFooter>
          }
        </Dialog>
      </div>
    );
  }
}

// const mapStateToProps = (state: IState) => ({
//   title: state.webpart.title,
// });

// const mapDispatchToProps = (dispatch) => ({
//   updateProperty: (key: string, value: string) => dispatch(onUpdateProperty(key, value)),
// });

export default connect(null, null)(ConfirmDialog);
