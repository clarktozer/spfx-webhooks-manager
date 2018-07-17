import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from "@microsoft/sp-dialog";
import { autobind } from '@uifabric/utilities/lib';
import { ConfirmDialogContent } from './ConfirmDialogContent';
import { IConfirmDeleteDialogProps } from './IConfirmDeleteDialogProps';

export class ConfirmDeleteDialog extends BaseDialog {
  private props: IConfirmDeleteDialogProps;

  constructor(props: IConfirmDeleteDialogProps, config?: IDialogConfiguration) {
    super(config);
    this.props = props;
  }

  public render(): void {
    ReactDOM.render(
      <ConfirmDialogContent
        title="Delete"
        message={"Are you sure you want to delete this item?"}
        close={this.close}
        submit={this.submit}
      />, this.domElement);
  }

  @autobind
  private async submit() {
    this.close();
    this.props.onDeleteSubscription();
  }
}
