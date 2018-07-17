import * as React from "react";
import { DialogContent, DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IConfirmDialogProps } from "./IConfirmDialogProps";

export class ConfirmDialogContent extends React.Component<IConfirmDialogProps, {}> {
  constructor(props) {
    super(props);
  }

  public render(): JSX.Element {
    return <DialogContent
      title={this.props.title}
      subText={this.props.message}
      onDismiss={this.props.close}
      showCloseButton={true}
    >
      <DialogFooter>
        <DefaultButton text={"Cancel"} title={"Cancel"}  onClick={this.props.close} />
        <DefaultButton text={"OK"}  title={"OK"}  onClick={this.props.submit} primary={true} />
      </DialogFooter>
    </DialogContent>;
  }
}
