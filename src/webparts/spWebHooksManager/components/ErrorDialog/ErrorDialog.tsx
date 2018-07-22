import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from "@microsoft/sp-dialog";
import { autobind } from '@uifabric/utilities/lib';
import { ErrorDialogContent } from './ErrorDialogContent';

export class ErrorDialog extends BaseDialog {
  constructor(config?: IDialogConfiguration) {
    super(config);
  }

  public render(): void {
    ReactDOM.render(
      <ErrorDialogContent
        message={"an error has occurred"}
        close={this.close}
      />, this.domElement);
  }
}
