import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from "@microsoft/sp-dialog";
import { ErrorDialogContent } from './ErrorDialogContent';

export class ErrorDialog extends BaseDialog {
  private title: string;
  private message: string;
  constructor(title: string, message: string, config?: IDialogConfiguration) {
    super(config);
    this.title = title;
    this.message = message;
  }

  public render(): void {
    ReactDOM.render(
      <ErrorDialogContent
        title={this.title}
        message={this.message}
        close={this.close}
      />, this.domElement);
  }
}
