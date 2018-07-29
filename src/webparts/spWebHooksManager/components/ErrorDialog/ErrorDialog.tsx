import * as React from 'react';
import { autobind } from '@uifabric/utilities/lib';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as strings from 'SpWebHooksManagerWebPartStrings';
import { IErrorDialogProps } from './IErrorDialogProps';

export default class ErrorDialog extends React.Component<IErrorDialogProps, {}> {
  constructor(props: IErrorDialogProps) {
    super(props);
  }


  @autobind
  private onClose() {
    this.props.onClose(this.props.propertyKey, null);
  }

  public render(): React.ReactElement<IErrorDialogProps> {
    const { title, message } = this.props;

    return (
      <div>
        <Dialog
          hidden={false}
          onDismiss={this.onClose}
          dialogContentProps={{
            type: DialogType.normal,
            title: title,
            subText: message
          }}>
              <DialogFooter>
                <DefaultButton onClick={this.onClose} text={strings.OK} primary={true} />
              </DialogFooter>
        </Dialog>
      </div>
    );
  }
}
