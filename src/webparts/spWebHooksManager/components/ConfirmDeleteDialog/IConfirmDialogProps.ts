export interface IConfirmDialogProps {
  title: string;
  message: string;
  close: () => void;
  submit: () => void;
}
